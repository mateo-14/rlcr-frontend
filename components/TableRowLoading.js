const TableRowLoading = ({ cols = 1 }) => (
  <tr className="animate-pulse">
    {[...Array(cols)].map((_, i) => (
      <td key={i}>
        <div className="rounded-full h-5 bg-gray-500 rounded my-3 mx-6"></div>
      </td>
    ))}
  </tr>
);

export default TableRowLoading;
