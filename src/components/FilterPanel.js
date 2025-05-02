import React from 'react';
import styles from './FilterPanel.module.css';

function FilterPanel({ categories, currentFilters, onFilterChange }) {
    console.log('FilterPanel categories:', categories); // Debugging line

    const handleCategoryChange = (event) => {
        onFilterChange('category', event.target.value);
    };

    const handleMonthChange = (event) => {
        onFilterChange('month', parseInt(event.target.value));
    };

    const handleDateChange = (event) => {
        // Add handlers for other filters (e.g., date range) here
    };
    const dict_month = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'};

    return (
        <div className={styles.filterPanel}>
            <h3>Filters</h3>
            <div className={styles.filterGroup}>
                <label htmlFor="category-select">Category:</label>
                <select
                    id="category-select"
                    value={currentFilters.category}
                    onChange={handleCategoryChange}
                    className={styles.selectInput}
                >
                    {categories[0].map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === 'all' ? 'All Categories' : cat}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.filterGroup}>
                <label htmlFor="month-select">Month:</label>
                <select
                    id="month-select"
                    value={dict_month[currentFilters.month]}
                    onChange={handleMonthChange}
                    className={styles.selectInput}
                >
                    {categories[1].map((cat) => (
                        <option key={cat} value={cat}>
                            {dict_month[cat] === new Date().getMonth() ? new Date().getMonth() : dict_month[cat]}
                        </option>
                    ))}
                </select>
            </div>
            {/* Add more filter inputs here (e.g., date pickers) */}
        </div>
    );
}

export default FilterPanel;