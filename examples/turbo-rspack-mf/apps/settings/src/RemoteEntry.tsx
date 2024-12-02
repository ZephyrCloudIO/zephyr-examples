function RemoteEntry() {
  return (
    <div className="text-white rounded-md p-4 items-center">
      <h1 className="text-3xl">Routing Demo</h1>
      <p>
        This is a remote entry route. It is a separate bundle that is loaded
        dynamically.
      </p>
      <p>
        This route is not part of the main host application. It is a separate
        micro-frontend.
      </p>
      <p>This is just a demo route</p>
    </div>
  );
}

export default RemoteEntry;
