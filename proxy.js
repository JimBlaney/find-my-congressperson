var request = require('request');

exports.proxyRequest = function() {
  return function(req, res, next) {
    var url;
    if (req.url.indexOf('?') > -1) {
      url = req.url.substr(2);
    } else {
      return next();
    }
    if (req.method === 'GET') {
      request.get(url).pipe(res);
    } else if (req.method === 'POST') {
      request({
        method: 'POST',
        url: url,
        form: req.body
      }).pipe(res);
    } else {
      res.send('support get and post only.');
    }
  };
};
