/* eslint-disable-next-line */
export interface TableProps {}

export function Table(props: TableProps) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs leading-4 text-gray-500 uppercase tracking-wider">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              John Doe
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              30
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              john@example.com
            </td>
          </tr>
          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              Jane Smith
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              25
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              jane@example.com
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
