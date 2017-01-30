var Q = require('q')
var request = require('request');


function requestOkText(url) {
    return Q.Promise(function(resolve, reject, notify) {

        console.log('promise')

        request(url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                console.log('got response')

                resolve(body)
                //console.log(body) 
                // Show the HTML for the Google homepage.
              }
            })
    });
}

function request2(url) {

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('got response')
        //console.log(body)
        return body
        //console.log(body) 
        // Show the HTML for the Google homepage.
      }
    })

}


var start = requestOkText("http://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json")
var end = requestOkText("http://nominatim.openstreetmap.org/search?q=1762+u+st+nw+dc&format=json")

function main() {

    console.log('start')

    return requestOkText("http://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json")
    .then(function (value) {
        console.log(value)
    }, function (reason) {
        console.log(reason)
    });
}

//main()
//var start = request2("http://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json")
//var end = request2("http://nominatim.openstreetmap.org/search?q=1762+u+st+nw+dc&format=json")

//    console.log('here')
//    console.log('this is start: ' + start.display_name)
//    console.log('this is end: ' + end.display_name)
//    return start, end;
//});

var promises = [start, end]
//console.log(start)
//console.log(end)


//console.log('here')

//var out = Q.all([start, end]);

//Q.allSettled(promises)
//.then(function (results) {
//    console.log(results.value)
//})
//.then(console.log('finally'))
//
Q.allSettled(promises)
.then(function (results) {
    results.forEach(function (result) {
        console.log('here')
        if (result.state === "fulfilled") {
            var value = result.value;
            console.log(JSON.parse(value)[0].display_name)
        } else {
            var reason = result.reason;
        }
    });
});
//
//console.log(output)

//.then(function (responseText) {
//    // If the HTTP response returns 200 OK, log the response text.
//    console.log(responseText);
//}, function (error) {
//    // If there's an error or a non-200 status code, log the error.
//    console.error(error);
//}, function (progress) {
//    // Log the progress as it comes in.
//    console.log("Request progress: " + Math.round(progress * 100) + "%");
//});