var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': 'application/json'
};

module.exports.sendResponse = function(response, data, statusCode){
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end( JSON.stringify(data) );
};

module.exports.collectData = function(request, callback) {
  request.on('data', function(chunk){
    callback(chunk);
  });
}
