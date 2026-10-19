// Fastify server: runs locally, in Docker, and on AWS (ECS Fargate, App Runner, EC2).
import Fastify from 'fastify';
import { renderPage, type RenderConfig } from './render';

const config: RenderConfig = {
  REMOTE_SELECTOR: process.env.REMOTE_SELECTOR,
  CANDIDATE_SELECTOR: process.env.CANDIDATE_SELECTOR,
  CANDIDATE_PERCENT: process.env.CANDIDATE_PERCENT,
  ALLOW_PREVIEW: process.env.ALLOW_PREVIEW,
  ZEPHYR_API: process.env.ZEPHYR_API,
  ALLOWED_REMOTE_HOSTS: process.env.ALLOWED_REMOTE_HOSTS,
  RUNTIME: process.env.RUNTIME_LABEL ?? `Fastify on Node.js ${process.version}`,
};

const app = Fastify({
  // JSON request logs, which CloudWatch Logs can query directly.
  logger: true,
  // AWS load balancers keep idle connections open for 60s. A shorter Node
  // keep-alive makes the server close sockets the ALB still uses: random 502s.
  keepAliveTimeout: 65_000,
});

// Load balancer health check (ECS Express Mode, ALB target groups, ...).
app.get('/healthz', async () => 'ok');

// Every other GET (and the HEAD Fastify derives from it) is a page.
app.get('/*', async (request, reply) => {
  const url = new URL(request.url, `${request.protocol}://${request.host}`);
  // Hand the render function a standard Request with the headers it reads.
  const headers = new Headers();
  for (const name of ['cookie', 'x-zephyr-preview']) {
    const value = request.headers[name];
    if (typeof value === 'string') headers.set(name, value);
  }
  const response = await renderPage(new Request(url, { headers }), config);

  // Copy the Web Response onto Fastify's reply. The body is sent as a Web
  // stream, which Fastify's HEAD handling knows how to discard.
  reply.status(response.status);
  response.headers.forEach((value, name) => reply.header(name, value));

  // One log line per page with the Zephyr builds behind it (the x-zephyr-*
  // headers), so errors can be grouped by release and cohort.
  const zephyr: Record<string, string> = {};
  response.headers.forEach((value, name) => {
    if (name.startsWith('x-zephyr-')) zephyr[name.slice('x-zephyr-'.length)] = value;
  });
  request.log.info({ statusCode: response.status, zephyr }, 'page rendered');

  return reply.send(response.body ?? undefined);
});

// 0.0.0.0, not Fastify's default localhost, or nothing outside the container
// can reach the server.
await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT ?? 8080) });

// ECS stops tasks with SIGTERM; finish in-flight requests before exiting.
process.on('SIGTERM', () => {
  app.close().then(() => process.exit(0));
});
