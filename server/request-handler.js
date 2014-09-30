var utils = require("./utils");
var routes = require("./routes");

module.exports = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var action = routes[request.method];
  if (action) {
    action(request,response);
  } else {
    utils.sendResponse(response, null, 404);
  }
};
