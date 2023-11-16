import styles from './table.module.css';

/* eslint-disable-next-line */
export interface TableProps {}

export function Table(props: TableProps) {
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
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>John Doe</td>
          <td className={styles.tableCell}>30</td>
          <td className={styles.tableCell}>john@example.com</td>
        </tr>
        <tr className={styles.tableRow}>
          <td className={styles.tableCell}>Jane Smith</td>
          <td className={styles.tableCell}>25</td>
          <td className={styles.tableCell}>jane@example.com</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
