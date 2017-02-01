require('dotenv').load();
var nominatim = require('./nominatim')
var Q = require('q')
var googleMapsClient = require('@google/maps').createClient({
	Promise: require('q').Promise
  //key: (set using GOOGLE_MAPS_API_KEY environment variable)
});

var main = function(input_sms) {

  var errorMsg = 'Error! Input should be delimited by semi colons, ' + 
  	       'and in the form {start};{end};{mode} where mode is one of {driving, ' + 
  	       'bicycling, transit, walking}'

  var inputArray = parseInput(input_sms)

  if (inputArray) {
	  
	return geocode(inputArray)
	.then(function(result) {
		console.log(result)
		return lookupDirections(result, inputArray[2])})
	.then(function(result) {
  		return sendResults(result)
  	})
  } else {
  	return errorMsg
  }

}

var geocode = function(data) {
	console.log('gecoding')
	console.log(data)
	
	var start = nominatim(data[0])
	var end = nominatim(data[1])
	
	return Q.all([start, end])
}
	
var lookupDirections = function(data, mode) {
	
	//console.log('looking up directions')
	//console.log(data[0].lat, data[0].lon)
	//console.log(data[1].lat, data[1].lon)
	//console.log(mode)

    return googleMapsClient.directions({
	  
      origin: [data[0].lat, data[0].lon],
      destination: [data[1].lat, data[1].lon],
      mode: mode.toLowerCase()
      })
	  .asPromise()
}

var parseInput = function(input_sms) {
  var inputArray = input_sms.split(';')
  console.log(inputArray)

  if (inputArray.length === 3) {
  	return inputArray
  } else {
  	return false
  }

}

var sendResults = function(response) {
	//console.log('got results from google maps:')
	//console.log(response)

	stepArr = []

  	var steps = response.json.routes[0].legs[0].steps
  	for (i = 0; i < steps.length; i ++) {
  		var step = steps[i]
  		var instruction = step.html_instructions.replace(/<(?:.|\n)*?>/gm, '');
  		var distance = step.distance.text

  		var msg = instruction + ' (' + distance + ')';
  		stepArr.push(msg)
  		//console.log(msg)
  		
  	}

  	console.log(stepArr)

  	return stepArr.join(', ')

  }

var mystr = '1762 U St NW DC;Comet Ping Pong DC;Walking'
main(mystr)





