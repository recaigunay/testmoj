const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var anagramRoutes = require('./api/anagram');

app.use('*',anagramRoutes);


app.listen(process.env.PORT || port, () => console.log("server is running on " + port + " port"));