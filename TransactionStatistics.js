import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionStatistics() {
  const [statistics, setStatistics] = useState({});
  const [month, setMonth] = useState(3); // March by default

  useEffect(() => {
    axios.get(`http://localhost:8080/api/statistics?month=${month}`)
      .then(response => setStatistics(response.data));
  }, [month]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div>
      <select value={month} onChange={handleMonthChange}>
        {[...Array(12).keys()].map((month) => (
          <option key={month} value={month + 1}>{month + 1}</option>
        ))}
      </select>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
}

export default TransactionStatistics;