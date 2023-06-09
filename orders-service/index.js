require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('../db-service');

const app = express();
const orderRouter = require('./routes/orderRouter');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.use('/api', orderRouter);

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
