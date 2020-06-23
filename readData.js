const fs = require('fs');
const path = require('path');

function loadAllReports(path, done){
	fs.readFile(path, 'utf8', (err, data) => {
		if(err){
			console.log(err);
		}
		else{
			const reports = [];
			const lines = data.split(/\r\n|\n/);
			const headers = lines[0].split(',');

			for(let i = 1; i < lines.length; i++){
				const line = lines[i].split(",");
				let obj = {};
				for(let j = 0; j < headers.length; j++){
					obj[headers[j]] = line[j];
				}
				if(obj['State'] !== undefined){
					reports.push(obj);
					if(i < 10){
						// console.log(obj);
					}
				}
			}

			done(reports);
		}
	});
}

function getStateData(reports, stateReports){
	let currState = reports[0]['State'];
	let staffConfirmed = 0;
  	let residentsConfirmed = 0;
  	let staffDeaths = 0;
  	let residentsDeaths = 0;
  	let staffRecovered = 0;
  	let residentsRecovered = 0;
	for(let i = 0; i < reports.length-1; i++){
		if(reports[i]['Facility.ID'] !== reports[i+1]['Facility.ID']){
			if(reports[i]['Staff.Confirmed'] !== 'NA')
				staffConfirmed += parseInt(reports[i]['Staff.Confirmed']);
			if(reports[i]['Residents.Confirmed'] !== 'NA')
  				residentsConfirmed += parseInt(reports[i]['Residents.Confirmed']);
  			if(reports[i]['Staff.Deaths'] !== 'NA')
  				staffDeaths += parseInt(reports[i]['Staff.Deaths']);
  			if(reports[i]['Residents.Deaths'] !== 'NA')
  				residentsDeaths += parseInt(reports[i]['Residents.Deaths']);
  			if(reports[i]['Staff.Recovered'] !== 'NA')
  				staffRecovered += parseInt(reports[i]['Staff.Recovered']);
  			if(reports[i]['Residents.Recovered'] !== 'NA')
  				residentsRecovered += parseInt(reports[i]['Residents.Recovered']);
		}

		if(currState !== reports[i+1]['State']){
			const obj = {State: currState, staffConfirmed: staffConfirmed, residentsConfirmed: residentsConfirmed, staffDeaths: staffDeaths, residentsDeaths: residentsDeaths, staffRecovered: staffRecovered, residentsRecovered: residentsRecovered};
			stateReports.push(obj);
			currState = reports[i+1]['State'];
			staffConfirmed = 0;
  			residentsConfirmed = 0;
  			staffDeaths = 0;
  			residentsDeaths = 0;
  			staffRecovered = 0;
  			residentsRecovered = 0;
		}
	}

	const obj = {State: currState, staffConfirmed: staffConfirmed, residentsConfirmed: residentsConfirmed, staffDeaths: staffDeaths, residentsDeaths: residentsDeaths, staffRecovered: staffRecovered, residentsRecovered: residentsRecovered};
	stateReports.push(obj);
	// console.log(stateReports[0]);
	// console.log(stateReports.length);
	return stateReports;
}

module.exports = {
	loadAllReports: loadAllReports,
	getStateData: getStateData
};