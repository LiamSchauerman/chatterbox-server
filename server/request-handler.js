/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
// var objToReturn = {results:[]};
var fs = require("fs");

module.exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */


  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  /* .writeHead() tells our server what HTTP status code to send back */

var sendResponse = function(response, data, statusCode){
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end( JSON.stringify(data) );
}

  if (request.method === "OPTIONS") {
    sendResponse(response, null, 204);
  } else if (request.method === "GET") {
    if (request.url === "/classes/messages") {
      // response.end(JSON.stringify(objToReturn));
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
    } else {
      sendResponse(response, null, 404);
    }
  } else if (request.method === "POST") {
    if (request.url === "/classes/messages") {
      request.on('data', function(data) {
        // objToReturn.results.push(JSON.parse(data));
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
    } else {
      sendResponse(response, null, 404);

    }
  } else {
    sendResponse(response, null, 404);
  }

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
