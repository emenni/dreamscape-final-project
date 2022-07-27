const normalizeEvent = event => {
  var tmp = event.routeArn.split(':');
  var apiGatewayArnTmp = tmp[5].split('/');
  var method = apiGatewayArnTmp[2];
  return {
      method: method,
      data: event['body'] ? JSON.parse(event['body']) : {},
      querystring: event['queryStringParameters'] || {},
      pathParameters: event['pathParameters'] || {},
      headers: event['headers'],
  };
};

module.exports = normalizeEvent;
