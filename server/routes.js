var utils = require("./utils");
var fs = require("fs");

module.exports = {
  'OPTIONS': function(request, response) {
    utils.sendResponse(response, null, 204);
  },
  'GET': function(request, response) {
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
  },
  'POST': function(request, response) {
    utils.collectData(request, function(data) {
      fs.appendFile('./files/messages.txt', data+"\n", function(err) {
        if (err) throw err;
        console.log("The 'data to append' was appended to file!");
      });
    });
    utils.sendResponse(response, null, 201);
  }
}
