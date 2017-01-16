var botBuilder = require('claudia-bot-builder');
var googleMapsClient = require('@google/maps').createClient({
    Promise: require('q').Promise
});


var bot = botBuilder(function(message) {
  console.log('starting bot')

  var inputArray = parseInput(message.text)

  if (inputArray) {
  	return lookupDirections(inputArray).then(function(result) {
  		return sendResults(result)
  	})
  } else {
  	var errorMsg = 'Error! Input should be delimited by semi colons, ' +
        'and in the form {start};{end};{mode} where mode is one of {driving, ' +
        'bicycling, transit, walking}'

  	console.log('match text failed')
    //return errorMsg;
    return [errorMsg, 'demo msg', errorMsg];
  }
}, { platforms: ['twilio'] });

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
   	console.log('Input array:')
    console.log(inputArray)

    if (inputArray.length === 3) {
        return inputArray
    } else {
        return false
    }

}

var sendResults = function(response) {
	console.log('got results from google maps:')
	console.log(response)

	stepArr = []

  	var steps = response.json.routes[0].legs[0].steps
  	for (i = 0; i < steps.length; i ++) {
  		var step = steps[i]
  		var instruction = step.html_instructions.replace(/<(?:.|\n)*?>/gm, '');
  		var distance = step.distance.text

  		var msg = instruction + ' (' + distance + ')';
  		stepArr.push(msg)
  		console.log(msg)
  		
  	}

  	return stepArr.join(', ')

  	/*
	respArray = []

	var currentStr = stepArr[0]

	for (i = 1; i < stepArr.length; i++) {
		if (currentStr.length + stepArr[i].length <= 160) {
			currentStr += ', ' + stepArr[i]
		} else {
			respArray.push(currentStr)
			currentStr = stepArr[i]
		}
	}

	respArray.push(currentStr)
	console.log('respArray')
	console.log(respArray)

	return respArray[0]
	*/
}


module.exports = bot;