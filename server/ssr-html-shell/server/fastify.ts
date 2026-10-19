// Fastify server: runs locally, in Docker, and on AWS (ECS Fargate, App Runner, EC2).
import Fastify from 'fastify';
import { renderPage, type RenderConfig } from './render';

const config: RenderConfig = {
  ZEPHYR_URL: process.env.ZEPHYR_URL,
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
  const response = await renderPage(url, config);

  // Copy the Web Response onto Fastify's reply. The body is sent as a Web
  // stream, which Fastify's HEAD handling knows how to discard.
  reply.status(response.status);
  response.headers.forEach((value, name) => reply.header(name, value));

  // One log line per page with the Zephyr deployment behind it (the x-zephyr-*
  // headers), so errors can be grouped by release.
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
