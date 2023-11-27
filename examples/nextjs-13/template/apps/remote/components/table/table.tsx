import styles from './table.module.css';

export type TableData = {
  name: string;
  age: number;
  email: string;
};

/* eslint-disable-next-line */
export interface TableProps {
  data: TableData[];
}

export function Table({ data }: TableProps) {
  return (
    <table className={`${styles.table}`}>
      <thead>
        <tr>
          <th className={styles.tableHeader}>Name</th>
          <th className={styles.tableHeader}>Age</th>
          <th className={styles.tableHeader}>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr className={styles.tableRow} key={row.email}>
            <td className={styles.tableCell}>{row.name}</td>
            <td className={styles.tableCell}>{row.age}</td>
            <td className={styles.tableCell}>{row.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
