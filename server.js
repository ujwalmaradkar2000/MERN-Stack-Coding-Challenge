
const express = require('express');
const app = express();
const dataUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
const axios = require('axios');
const mongoose = require('mongoose');
const port = 8080;

// Connect to mongoDB
// const mongodbURI = `mongodb://localhost:27017/mydatabase`
mongoose.connect(`mongodb://localhost:27017/mydatabase`);

// Schema Definition
const transactionSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    description: String,
    dateOfSale: Date,
    category: String,
    image: String,
    sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Initialize Database
app.get(`/api/initialize-db`, async(req, res)=>{
    try{
        const response = await axios.get(`${dataUrl}`);
        await Transaction.insertMany(response.data);
        res.send(`Database initialisation successful.`);
    }catch(error){
        console.error(error);
        res.status(500).send(`Error initializing database`);
    }
});

// API for listing data
app.get(`/api/transactions`, async(req,res)=>{
    const month = req.query.month;
    const search = req.query.search;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;

    const query = {$expr: { $eq: [{ $month: `$dateOfSale`}, month]}};

    if(search){
        query.$or = [{productTitle: {$regex: search, $options: `i`}},
            {productPrice: {$regex: search, $options: `i`}}
        ];
    }
    const transactions = await Transaction.find(query)
    .skip((page -1) * perPage)
    .limit(perPage);

    res.json(transactions);
});

app.get('/data', async(req, res) => {
    try{
        const response = await axios.get(`${dataUrl}`);
        console.log(`Get Data API called`)
        res.json(response.data); 
    }catch(error){
        console.error('Error while fetching the data', error);
    }
    
});

app.listen(8080, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});


// API for statistics
app.get('/api/statistics', async (req, res) => {
    const month = req.query.month;
  
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: '$dateOfSale' }, month] } } },
      { $group: { _id: null, totalSaleAmount: { $sum: '$productPrice' } } }
    ]);
  
    const totalSoldItems = await Transaction.countDocuments({
      transactionType: 'sold',
      $expr: { $eq: [{ $month: '$dateOfSale' }, month] }
    });
  
    const totalNotSoldItems = await Transaction.countDocuments({
      transactionType: 'not sold',
      $expr: { $eq: [{ $month: '$dateOfSale' }, month] }
    });
  
    res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  });
  
  // API for bar chart data
  app.get('/api/bar-chart-data', async (req, res) => {
    const month = req.query.month;
  
    const data = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: '$dateOfSale' }, month] } } },
      { $bucket: {
          groupBy: '$productPrice',
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901, Infinity],
          default: 'Unknown',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
  
    res.json(data);
  });
  
  // API for pie chart data
  app.get('/api/pie-chart-data', async (req, res) => {
    const month = req.query.month;
  
    const data = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: '$dateOfSale' }, month] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
  
    res.json(data);
  });
  
  // API to combine statistics, bar chart and pie chart data
  app.get('/api/combined-data', async (req, res) => {
    const month = req.query.month;
  
    const statistics = await axios.get(`http://localhost:8080/api/statistics?month=${month}`);
    const barChartData = await axios.get(`http://localhost:8080/api/bar-chart-data?month=${month}`);
    const pieChartData = await axios.get(`http://localhost:8080/api/pie-chart-data?month=${month}`);
  
    res.json({ statistics: statistics.data, barChartData: barChartData.data, pieChartData: pieChartData.data });
  });