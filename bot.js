var botBuilder = require('claudia-bot-builder');
var nominatim = require('./nominatim')
var Q = require('q')
var googleMapsClient = require('@google/maps').createClient({
    Promise: require('q').Promise
});

var bot = botBuilder(function(message) {
  console.log('starting bot')

    var inputArray = parseInput(message.text)

    if (inputArray.error) {
        return inputArray.error

    } else {
        return geocode(inputArray)
            .then(function(result) {
                return lookupDirections(result, inputArray)
            })
            .catch(function(error) {
                return {
                    error: error.name + ': ' + error.message
                }
            })
            .then(function(result) {
                console.log(result)

                if (result.error) {
                    console.log(result.error)
                    return result.error
                } else {
                    return sendResults(result)
                }
            })
    }

}, { platforms: ['twilio'] });

var geocode = function(data) {

<<<<<<< HEAD
return googleMapsClient.directions({
  origin: data[0],
  destination: data[1],
  mode: data[2].toLowerCase().trim().replace('biking', 'bicycling')
  })
  .asPromise()
=======
    console.log('gecoding')
>>>>>>> 1e5a9286f36d91f56832eb1a5ddf7bb1ef2f2ed9

    var start = nominatim(data[0])
    var end = nominatim(data[1])

    return Q.all([start, end])
}

var lookupDirections = function(data, inputArray) {

    origin = finalAddress(data[0], inputArray[0])
    destination = finalAddress(data[1], inputArray[1])

    return googleMapsClient.directions({

            origin: origin,
            destination: destination,
            mode: inputArray[2].toLowerCase().trim()
        })
        .asPromise()
}

var finalAddress = function(nominatimInput, rawInput) {
    if (nominatimInput) {
        return [nominatimInput.lat, nominatimInput.lon]
    } else {
        console.log('nominatim failed')
        return rawInput
    }
}

var parseInput = function(input_sms) {
    var inputArray = input_sms.split(';')
<<<<<<< HEAD

   	console.log('Input array:')
    console.log(inputArray)
=======
>>>>>>> 1e5a9286f36d91f56832eb1a5ddf7bb1ef2f2ed9

    if (inputArray.length != 3) {
        var msg = 'Error! Input should be delimited by semi colons, ' +
            'and in the form {start};{end};{mode} where mode is one of {driving, ' +
            'bicycling, transit, walking}'

        return {
            error: Error(msg)
        }
    } else {
        return inputArray
    }
}

var sendResults = function(response) {
    console.log('got results from google maps:')
    console.log(response)

    if (response.json.status === 'ZERO_RESULTS') {
        console.log('zero results')
        return 'No results found, try different search terms'
    } else {

        stepArr = []

<<<<<<< HEAD
  	var steps = response.json.routes[0].legs[0].steps
  	for (i = 0; i < steps.length; i ++) {
  		var step = steps[i]
  		var instruction = step.html_instructions.replace(/<(?:.|\n)*?>/gm, '').replace(/[^\x00-\x7F]/g, "");
  		var distance = step.distance.text
=======
        var steps = response.json.routes[0].legs[0].steps
        for (i = 0; i < steps.length; i++) {
            var step = steps[i]
            var instruction = step.html_instructions.replace(/<(?:.|\n)*?>/gm, '');
            var distance = step.distance.text
>>>>>>> 1e5a9286f36d91f56832eb1a5ddf7bb1ef2f2ed9

            var msg = instruction + ' (' + distance + ')';
            stepArr.push(msg)
        }

        console.log(stepArr)

        return stepArr.join(', ')
    }
}


module.exports = bot;