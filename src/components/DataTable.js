import React from 'react';
import styles from './DataTable.module.css';
function DataTable({ data }) {
if (!data || data.length === 0) {
return <p>No data to display.</p>;
}
// Get headers from the keys of the first object
const headers = Object.keys(data[0]);
return (
<div className={styles.tableContainer}>
<table className={styles.dataTable}>
<thead>
<tr>
{headers.map(header => <th key={header}>{header}</th>)}
</tr>
</thead>
<tbody>
{data.map((row, index) => (
<tr key={row.id || index}> {/* Use a unique ID if available */}
{headers.map(header => <td key={`${header}-${row.id ||
index}`}>{row[header]}</td>)}
</tr>
))}
</tbody>
</table>
</div>
);
}

export default DataTable;