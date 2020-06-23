const express = require('express');
const path = require('path');
const app = express();
const readData = require('./readData.js');

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

let reports = [];
let stateReports = [];

readData.loadAllReports("ConfirmedCasesandDeaths_061020_UCLALawCovid19BehindBarsDataProject.csv" ,(reports) => {
	reports = reports;
	console.log("reports read");

	stateReports = readData.getStateData(reports,[]);

	app.listen(3000);
	console.log("server started; type CTRL+C to shut down");
});

app.get('/', function(req, res) {
  	res.render('home');
});

app.get('/reports/bystate', function(req, res) {
	let result = stateReports;
  	if(req.query.hasOwnProperty('keywords') && req.query.keywords !== "") {
  		result = stateReports.filter(report => report.State === req.query.keywords);
  	}

  	res.render('reportsearch', {reports: result});
});