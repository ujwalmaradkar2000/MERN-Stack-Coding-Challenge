import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(3); // March by default
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/transactions?month=${month}&search=${search}&page=${page}`)
      .then(response => setTransactions(response.data));
  }, [month, search, page]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <select value={month} onChange={handleMonthChange}>
        {[...Array(12).keys()].map((month) => (
          <option key={month} value={month + 1}>{month + 1}</option>
        ))}
      </select>
      <input
        type="search"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search transactions"
      />
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.productId}>
              <td>{transaction.productName}</td>
              <td>{transaction.productPrice}</td>
              <td>{transaction.dateOfSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePrevPage}>Previous</button>
      <button onClick={handleNextPage}>Next</button>
    </div>
  );
}

export default TransactionTable;