const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookies = require('cookie-parser')
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');


connectToDb();
app.use(cors());
app.use(cookies());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.send('HELLO WORLD');
})

app.use('/users', userRoutes);


module.exports = app;