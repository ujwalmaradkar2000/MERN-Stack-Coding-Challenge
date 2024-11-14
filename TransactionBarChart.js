import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function TransactionBarChart(){
    const [chartData, setChartData] = useState({});
    const [month, setMonth] = useState(3);

    useEffect(()=> {
        axios.get(`http://localhost:8080/api/bar-chart-data?month=${month}`)
        .then(response => {
            const labels = response.data.map(itm => item._id);
            const counts = response.data.map(item => item.count);
            setChartData({labels, datasets: [{ label: 'Transactions', data: counts} ] } );
        });
    }, [month]);
    const handleMonthChange = (event) =>{
        setMonth(event.target.value);
    };
    
    return (
        <div>
            <select value={month} onChange={handleMonthChange}>
                {[...Array(12).keys()].map((month)=>(
                    <option key={month} value={month + 1}> {month + 1}</option>
                ))}
            </select>
            <Bar data={chartData}/>
        </div>
    );
}
export default TransactionBarChart;