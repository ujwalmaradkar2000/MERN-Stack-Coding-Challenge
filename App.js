import React from 'react';
import './App.css';
import TransactionTable from './TransactionTable';
import TransactionStatistics from './TransactionStatistics';
// import TransactionBarChart from './TransactionBarChart';

function App() {
  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <div className="container">
        <div className="table-container">
          <TransactionTable />
        </div>
        <div className="statistics-container">
          <TransactionStatistics />
        </div>
        {/* <div className="chart-container">
          <TransactionBarChart />
        </div> */}
      </div>
    </div>
  );
}

export default App;