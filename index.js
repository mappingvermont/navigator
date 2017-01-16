
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
  	return lookupDirections(inputArray).then(function(result) {
  		return sendResults(result)
  	})
  } else {
  	return errorMsg
  }

}

var lookupDirections = function(data) {

return googleMapsClient.directions({
  origin: data[0],
  destination: data[1],
  mode: data[2].toLowerCase()
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

var mystr = '1762 U St NW DC;1101 Brook Valley Lane, Mclean VA;Driving'
console.log(main(mystr))


