import React, { useState, useEffect, useMemo } from 'react';
import ChartCard from './components/ChartCard';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable'; // Optional
import rawData from './data/sampleData.json'; // Import static data
import styles from './App.module.css'; // Import CSS Module
// Optional: Import specific chart types if needed for tree shaking
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
LineElement, Title, Tooltip, Legend } from 'chart.js';
// Register Chart.js components
ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);
function App() {
const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [filters, setFilters] = useState({
category: 'All categories', // Default filter state
// Add other filters like date range here
// give startDate a default different from null and end Date today
year: new Date().getFullYear, // Default start Year
month: new Date().getMonth, // Default end Month
date: new Date().getDate(), // Default 

// Add more filters as needed
// Example: date range, numeric range, etc.
dateRange: { start: new Date('2023-01-01'), end: new Date() },
// give me a numeric range different from null
numericRange: { min: 0, max: 100 },
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
// --- Data Loading ---
useEffect(() => {
// Simulate fetching data or just use imported data
try {
// In a real app, you might fetch:
// fetch('/api/data')
// simulate fetching data from src/data/sampleData.json
fetch('/data/sampleData.json')
//
 .then(response => response.json())
//
 .then(jsonData => {
//
 setData(jsonData);
//
 setFilteredData(jsonData); // Initialize filtered data
//
 setLoading(false);
//
 })
//
 .catch(err => {
//
 setError('Failed to fetch data');
//
 setLoading(false);
//
 });
// Using imported static data:
setData(rawData);
setFilteredData(rawData); // Initialize filtered data
setLoading(false);
} catch (err) {
setError('Failed to load data');
console.error(err);
setLoading(false);
}
}, []); // Empty dependency array means run once on mount
// --- Filtering Logic ---

useEffect(() => {
  let result = data;
  // Apply category filter
  if (filters.category !== 'All categories') {
  result = result.filter(item => item.category === filters.category);
  }
  if (filters.month !== new Date().getMonth) {
    result = result.filter(item => new Date(item.date).getMonth() === filters.month);
    }
  if (filters.year !== new Date().getFullYear) {
    result = result.filter(item => new Date(item.date).getFullYear() === filters.year);
    }
    // Add more filtering logic here (e.g., date range)
  setFilteredData(result);
  }, [filters, data]); // Re-run whenever filters or the original data change
/*  
useEffect(() => {
  let resultMonth = data;
  // Apply category filter
  if (filters.month !== new Date().getMonth) {
    resultMonth = resultMonth.filter(item => item.month === filters.month);
    }
    // Add more filtering logic here (e.g., date range)
  setFilteredData(resultMonth);
  }, [filters, data]); // Re-run whenever filters or the original data change
  */  
  
  // --- Prepare data for charts (using useMemo for optimization) ---
  const barChartData = useMemo(() => {
  // Process 'filteredData' specifically for the bar chart
  // Example: Aggregate values by category
  const aggregated = filteredData.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + item.value;
  return acc;
  }, {});
  return {
  labels: Object.keys(aggregated),
  datasets: [{
  label: 'Money Spent by Category',
  data: Object.values(aggregated),
  backgroundColor: 'rgba(75, 192, 192, 0.6)',
  }],
  };
  }, [filteredData]);
  console.log('BarChart Data for Bar Chart:', barChartData); // Debugging line

  const lineChartData = useMemo(() => {
  // Process 'filteredData' for a line chart (e.g., value over time)
  // Ensure data is sorted by date if needed
  const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new
  Date(b.date));
  return {
  labels: sortedData.map(item => item.date),
  datasets: [{
  label: 'Money Spet Over Time',
  data: sortedData.map(item => item.value),
  borderColor: 'rgb(255, 99, 132)',
  backgroundColor: 'rgba(255, 99, 132, 0.5)',
  }],
  };
  }, [filteredData]);
  // --- Event Handlers ---
  const handleFilterChange = (filterName, value) => {
  setFilters(prevFilters => ({
  ...prevFilters,
  [filterName]: value,
  }));
  };


  // concatenate the two arrays
  const uniqueCategoriesAndMonths = useMemo(() => {
  const uniqueMonths = [new Date().getMonth(), ...new Set(data.map(item => new Date(item.date).getMonth()).filter(month => month !== new Date().getMonth()))];
  const uniqueYears = [new Date().getFullYear(), ...new Set(data.map(item => new Date(item.date).getFullYear()).filter(year => year !== new Date().getFullYear()))];  
  console.log('Unique Months:', uniqueMonths); // Debugging line
  const uniqueCategories = ['All categories', ...new Set(data.map(item => item.category))];
  return [[...uniqueCategories], [...uniqueMonths],[...uniqueYears]];
  }, [data]);


  if (loading) return <div className={styles.message}>Loading data...</div>;
  if (error) return <div className={`${styles.message} $
  {styles.error}`}>{error}</div>;

  return (
    <div className={styles.appContainer}>
    <header className={styles.header}>
    <h1>Data Science Dashboard</h1>
    </header>
    <aside className={styles.sidebar}>
    <FilterPanel
    categories={uniqueCategoriesAndMonths}
    currentFilters={filters}
    onFilterChange={handleFilterChange}
    />
    <div className={styles.infoBox}>
    <h2>About</h2>
    <p className={styles.infoText}>
    This is a simple data science dashboard.
    <br />
    This dashboard visualizes personal financial data.
    Use the filters to explore the spendings for different categories accross months and years.
    <br />Data Source: Static JSON
    <br />Tech: React, Chart.js
    </p>
    </div>
    </aside>
    <main className={styles.mainContent}>
    <div className={styles.chartGrid}>
    <ChartCard
  title={barChartData.datasets[0].label}
  data={barChartData.labels.map((label, index) => ({
    category: label,
    value: barChartData.datasets[0].data[index],
  }))}
  />
    {/* Pass processed data to the specific chart type */}
    {/* Example using react-chartjs-2 Bar chart */}
    {/* <Bar data={barChartData} options={{ responsive: true }} /> */}
    {/*
    <p>Bar Chart Placeholder - Integrate your chart component here</p>
    <pre>{JSON.stringify(barChartData, null, 2)}</pre> 
    */}
    <ChartCard
    title={lineChartData.datasets[0].label}
    data={lineChartData.labels.map((label, index) => ({
    category: label,
    value: lineChartData.datasets[0].data[index],
  }))}
  />
    {/* Example using react-chartjs-2 Line chart */}
    {/* <Line data={lineChartData} options={{ responsive: true }} /> */}
    {/*<p>Line Chart Placeholder - Integrate your chart component here</p>
    <pre>{JSON.stringify(lineChartData, null, 2)}</pre>  */}
    {/* Add more ChartCard components as needed */}
    </div>
    {/* Optional Data Table */}
    <section className={styles.dataTableSection}>
    <h2>Data After applying filtering</h2>
    <DataTable data={filteredData} />
    </section>
    </main>
    <footer className={styles.footer}>
    <p className='footerp'>Dr. Vagner Zeizer Carvalho Paes React Portfolio Project &copy; {new Date().getFullYear()}</p>
    </footer>
    </div>
    );
    }
    export default App;