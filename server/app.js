const express = require('express');
const mysql = require('./dbcon.js');
// const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use('/', express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Init HandleBars
const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
const port = process.env.PORT || 8010;

// Public folder
// const publicDirectoryPath = path.join(__dirname, './public');
// Setup static directory to server
// app.use(express.static(publicDirectoryPath));
app.set('mysql', mysql);
app.use(express.static('/public'));

// ROUTES
app.use('/artists', require('./artists.js'));
app.use('/events', require('./events.js'));
app.use('/inventory', require('./inventory.js'));
app.use('/styles', require('./styles.js'));
app.use('/mediums', require('./mediums.js'));
app.use('/events_inventory', require('./events_inventory.js'));
app.use('/events_artists', require('./events_artists.js'));
//
// Index Route
app.get('/', function (req, res) {
  res.render('index');
});

// Start server
// app.listen('61579', () => console.log('Server started on port 61579'));
app.listen(port, function(){
  console.log(`Server started on port ${port}` + '; press Ctrl-C to terminate.');
});