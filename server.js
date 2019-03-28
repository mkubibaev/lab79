const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const categories = require('./app/categories');
const places = require('./app/places');
const items = require('./app/items');

const app = express();
const port = 8000;

const connection = mysql.createConnection({
    'host'     : 'localhost',
    'port'     : '3306',
    'user'     : 'root',
    'password' : '55558888',
    'database' : 'lab79'
});

app.use(express.json());
app.use(cors());
app.use('/categories', categories(connection));
app.use('/places', places(connection));
app.use('/items', items(connection));
app.use(express.static('public'));

connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    });
});


