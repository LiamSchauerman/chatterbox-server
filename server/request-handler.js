var fs = require("fs");

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode){
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end( JSON.stringify(data) );
};

var collectData = function(request, callback) {
  request.on('data', function(chunk){
    callback(chunk);
  });
}

module.exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);


  switch(request.method){
    case 'OPTIONS':
      sendResponse(response, null, 204);
      break;
    case 'GET':
      if (request.url === "/classes/messages") {
        var readFile = function(callback) {
          var options = {
            encoding: 'utf8'
          };
          fs.readFile('./files/messages.txt', options, function(err, data) {
            callback(err, data);
          });
        };
        readFile(function(err, data) {
          data = data.replace(/\n/g, ",");
          data = "["+data.slice(0,-2)+"}]";
          var parsedData = JSON.parse(data);
          var objToReturn = {
            results: parsedData
          };
          sendResponse(response, objToReturn);
        });
      } else if (request.url === '/classes/room1'){
        sendResponse(response, objToReturn);
      }
    break;
    case 'POST':
      if (request.url === "/classes/messages") {
        collectData(request, function(data) {
          fs.appendFile('./files/messages.txt', data+"\n", function(err) {
            if (err) throw err;
            console.log("The 'data to append' was appended to file!");
          });
        });
        sendResponse(response, null, 201);
      } else if (request.url === '/classes/room1') {
        request.on('data', function(data) {
          objToReturn.results.push(JSON.parse(data));
        });
        sendResponse(response, null, 201);
      };
      break;
  }
};
