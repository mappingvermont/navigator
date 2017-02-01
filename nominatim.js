var Q = require('q')
var request = require('request');
var querystring = require('querystring');

function nominatim(place) {
	
	console.log('in nominatim')
	console.log(place)
	
	base_url = 'http://nominatim.openstreetmap.org/search?'
	var params = {'q': place, 'format': 'json'}
	
	url = base_url + querystring.stringify(params)
	
    return Q.Promise(function(resolve, reject, notify) {

        request(url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                //resolve(body)
                resolve(JSON.parse(body)[0])
              }
            })
    });
}


module.exports = nominatim;

/*	
nominatim('1762 U St NW DC')
.then(function (results) {
	console.log(results)
	console.log('here')
});


var start = nominatim('22 Hubbard St, Montpelier VT')
var end = nominatim('1762 U St NW DC')

Q.all([start, end])
.then(function (results) {
	console.log(results)
	})
	
*/