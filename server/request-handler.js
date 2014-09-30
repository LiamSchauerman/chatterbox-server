var fs = require("fs");
var utils = require("./utils");

var actions = {
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

module.exports = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var action = actions[request.method];
  if (action) {
    action(request,response);
  } else {
    utils.sendResponse(response, null, 404);
  }

  // switch(request.method){
  //   case 'OPTIONS':
  //     sendResponse(response, null, 204);
  //     break;
  //   case 'GET':
  //     if (request.url === "/classes/messages") {
  //       var readFile = function(callback) {
  //         var options = {
  //           encoding: 'utf8'
  //         };
  //         fs.readFile('./files/messages.txt', options, function(err, data) {
  //           callback(err, data);
  //         });
  //       };
  //       readFile(function(err, data) {
  //         data = data.replace(/\n/g, ",");
  //         data = "["+data.slice(0,-2)+"}]";
  //         var parsedData = JSON.parse(data);
  //         var objToReturn = {
  //           results: parsedData
  //         };
  //         sendResponse(response, objToReturn);
  //       });
  //     } else if (request.url === '/classes/room1'){
  //       sendResponse(response, objToReturn);
  //     }
  //   break;
  //   case 'POST':
  //     if (request.url === "/classes/messages") {
  //       collectData(request, function(data) {
  //         fs.appendFile('./files/messages.txt', data+"\n", function(err) {
  //           if (err) throw err;
  //           console.log("The 'data to append' was appended to file!");
  //         });
  //       });
  //       sendResponse(response, null, 201);
  //     } else if (request.url === '/classes/room1') {
  //       request.on('data', function(data) {
  //         objToReturn.results.push(JSON.parse(data));
  //       });
  //       sendResponse(response, null, 201);
  //     };
  //     break;
  // }
};
