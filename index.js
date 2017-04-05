require('dotenv').load();
var nominatim = require('./nominatim')
var Q = require('q')
var googleMapsClient = require('@google/maps').createClient({
    Promise: require('q').Promise
});

var main = function(input_sms) {

    var inputArray = parseInput(input_sms)

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
                //console.log(result)

                if (result.error) {
                    //console.log(result.error)
                    return result.error
                } else {
                    return sendResults(result)
                }
            })
    }

}


var geocode = function(data) {

    console.log('gecoding')

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
            mode: data[2].toLowerCase().trim().replace('biking', 'bicycling')
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
    //console.log('got results from google maps:')
    //console.log(response)

    if (response.json.status === 'ZERO_RESULTS') {
        console.log('zero results')
        return 'No results found, try different search terms'
    } else {

        stepArr = []

        var steps = response.json.routes[0].legs[0].steps
        for (i = 0; i < steps.length; i++) {
            var step = steps[i]
            var instruction = step.html_instructions.replace(/<(?:.|\n)*?>/gm, '').replace(/[^\x00-\x7F]/g, "");
            var distance = step.distance.text

            var msg = instruction + ' (' + distance + ')';
            stepArr.push(msg)
        }

        console.log(stepArr)

        return stepArr.join(', ')
    }
}

var mystr = '1762 U St NW DC;Comet Ping Pong;Walking'
console.log(main(mystr))