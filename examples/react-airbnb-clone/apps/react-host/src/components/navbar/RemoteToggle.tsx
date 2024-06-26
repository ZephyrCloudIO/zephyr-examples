import useShowRemotes from '../../common/hooks/useShowRemotes';

export default function RemoteToggle() {
  const { toggle } = useShowRemotes();
  return (
    <div className="fixed bottom-6 right-6 flex items-center justify-center shadow-lg px-5 py-3 rounded-md bg-gray-100">
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" onChange={toggle} />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-700">
          Highlight Remotes
        </span>
      </label>
    </div>
  );
}
