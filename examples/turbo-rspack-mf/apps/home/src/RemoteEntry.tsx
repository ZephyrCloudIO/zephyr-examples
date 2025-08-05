import { Cloud, Book, Link2Icon } from 'lucide-react';
import { Link } from 'react-router';

function RemoteEntry() {
  return (
    <div className="h-full bg-gradient-to-b from-neutral-950 p-10 to-black flex flex-col items-center justify-center">
      <div className="rounded-md p-4">
        {' '}
        <div className="text-center max-w-2xl">
          <div className="flex items-center justify-center mb-6">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Zephyr Cloud Starter
          </h1>
          <p className="text-neutral-400 mb-8">
            Edge-ready template with module federation and RSPack bundling.
            Start building your application with instant deployments.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://app.zephyr-cloud.io"
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center"
            >
              Get Started
            </a>
            <a
              href="https://docs.zephyr-cloud.io/"
              className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-neutral-900 transition-colors inline-flex items-center"
            >
              <Book className="w-4 h-4 mr-2" />
              Documentation
            </a>
            <Link
              to="/settings"
              className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-neutral-900 transition-colors inline-flex items-center"
            >
              <Link2Icon className="w-4 h-4 mr-2" />
              Router Link To Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoteEntry;
