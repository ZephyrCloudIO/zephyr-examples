import Table from '../components/table/table';

export function Index() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-2xl">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Hey there! This is a bullet{' '}
          <a href="#" className="font-semibold text-indigo-600">
            <span className="absolute inset-0" aria-hidden="true" />
            Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to the{' '}
            <span className="text-indigo-600">template remote</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            This is a template for a remote application you can get started by
            editing{' '}
            <code className="text-sm font-bold text-gray-900">
              pages/index.tsx
            </code>
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <h3 className="mt-16">The component below is comes from this app</h3>
      <div className="mt-4 border-4 border-dashed border-blue-500 p-16 rounded-lg w-full">
        <Table />
      </div>
    </section>
  );
}

export default Index;
