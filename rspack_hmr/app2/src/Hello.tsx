interface Props {
  name: string;
}

export const Hello = ({ name }: Props) => {
  return (
    <div className="relative  h-40  w-full">
      <code className="absolute z-10 top-4 left-6 bg-gray-700 p-2 rounded-lg">
        &lt;Hello name="{name}"&gt; from app2
      </code>
      <div className="border z-0 border-1 absolute top-10 w-full border-red-400 rounded-lg px-4 py-8">
        Hello, from app_02, {name}!
      </div>
    </div>
  );
};
