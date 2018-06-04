var express = require('express');
var router = express.Router();
var uni = require('unirest');
var _ = require('lodash');

router.get('/', function(req, res) {
        var Request = uni.get('http://api-c1.hivisasa.com/const/locations/_list');
        Request.end(function(response) {
            var locations = response.body;
            var Request = uni.get('http://analytics.hivisasa.tech/ranked');
            Request.end(function(response) {
                var rankedArticles = response.body;
                    var Request = uni.get('http://analytics.hivisasa.tech/latest');
                    Request.end(function(response) {
                        var latestArticles = response.body;
                        render_articles(res, req, rankedArticles, latestArticles, locations);
                    }
            });
      });
});

var render_articles = function(res, req, rankedArticles, latestArticles, locations) {
    res.render('mobile/index', {
        latestArticles: latestArticles,
        layout: 'mobile/layout',
        locations: locations,
        rankedArticles: rankedArticles)
    });
};

module.exports = router;
