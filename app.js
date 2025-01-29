const express = require('express');
const app = express();
const inventoryRoute = require('./routes/inventoryRoute');
const errorHandlingMiddleware = require('./middleware/errorHandling');

app.use(express.static('public'));
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/inventory', inventoryRoute);

app.use(errorHandlingMiddleware);


