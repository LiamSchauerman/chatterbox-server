var http = require("http");
var handleRequest = require("./request-handler");
var url = require("url");
var utils = require("./utils");

var port = 3000;
var ip = "127.0.0.1";

var paths = {
  "/classes/messages": handleRequest
}

var server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname;
  if (paths[path]) {
    paths[path](request,response);
  } else {
    utils.sendResponse(response,null, 404);
  }

});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
