var utils = require("./utils");
var fs = require("fs");

module.exports = {
  'OPTIONS': function(request, response) {
    utils.sendResponse(response, null, 204);
  },
  'GET': function(request, response) {
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
        utils.sendResponse(response, objToReturn);
      });
    } else if (request.url === '/classes/room1'){
      utils.sendResponse(response, objToReturn);
    }
  },
  'POST': function(request, response) {
    if (request.url === "/classes/messages") {
      utils.collectData(request, function(data) {
        fs.appendFile('./files/messages.txt', data+"\n", function(err) {
          if (err) throw err;
          console.log("The 'data to append' was appended to file!");
        });
      });
      utils.sendResponse(response, null, 201);
    } else if (request.url === '/classes/room1') {
      request.on('data', function(data) {
        objToReturn.results.push(JSON.parse(data));
      });
      utils.sendResponse(response, null, 201);
    };
  }
}
