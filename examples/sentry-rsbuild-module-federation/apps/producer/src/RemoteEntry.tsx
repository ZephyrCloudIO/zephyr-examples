const RemoteEntry = () => {
  const handleClick = () => {
    throw new Error("Producer Error!");
  };
  return (
    <div className="content">
      <h2>Remote Entry</h2>
      <p>
        I'm a remote entry thats mounted from the producer project inside of the
        consumer project
      </p>
      <button type="button" onClick={handleClick}>
        Break me
      </button>
    </div>
  );
};

export default RemoteEntry;
