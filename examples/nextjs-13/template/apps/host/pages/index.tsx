import dynamic from 'next/dynamic';
import type { TableData } from 'remote/table';

// const Table = dynamic(() => import('remote/table'), { ssr: false });
const Table = dynamic(() => import('remote/table'), { ssr: false });

const tableData: TableData[] = [
  {
    name: 'San Francisco',
    age: 66,
    email: 'san.francisco@email.com',
  },
  {
    name: 'Alex Smith',
    age: 42,
    email: 'alex.smith@email.com',
  },
  {
    name: 'Mary Jane',
    age: 77,
    email: 'mary.jane@email.com',
  },
];

export function Index() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-2xl">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          This is a <strong>Zephyr Cloud</strong> example.{' '}
          <a
            href="https://github.com/ZephyrCloudIO/zephyr-examples"
            className="font-semibold text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            See more here <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to the <span className="text-blue-600">host application</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            This is a template for a host application you can get started by editing{' '}
            <code className="text-sm font-bold text-gray-900">pages/index.tsx</code>
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="https://zephyr-cloud.io/"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Zephyr Cloud
            </a>
            <a
              href="https://github.com/ZephyrCloudIO/zephyr-examples"
              className="text-sm font-semibold leading-6 text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <h3 className="mt-16">The component below is comes from the remote app</h3>
      <div className="mt-4 border-4 border-dashed border-blue-500 p-16 rounded-lg w-full">
        <Table data={tableData} />
      </div>
    </section>
  );
}

export default Index;
