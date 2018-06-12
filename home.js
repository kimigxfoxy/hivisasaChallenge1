var express = require('express');
var router = express.Router();
var uni = require('unirest');
var _ = require('lodash');

router.get('/', function(req, res) {
    var locations=[];
	var rankedArticles=[];
	var latestArticles=[];
	const requestProm1=unirest_prom(uni.get('http://api-c1.hivisasa.com/const/locations/_list'), true);
	
	
	const requestProm2=requestProm1.then(function(e){
		if(e.status==200){
			locations=e.body;
			console.log(locations);
		}else{
			console.log('http://api-c1.hivisasa.com/const/locations/_list: '+e.status);
		}
		return unirest_prom(uni.get('http://analytics.hivisasa.tech/ranked'), true);
	},function(e){
		console.log('error http://api-c1.hivisasa.com/const/locations/_list: '+e.status);
	});

	const requestProm3=requestProm2.then(function(e){
		if(e.status==200){
			rankedArticles=body.e;
			console.log(rankedArticles);
		}else{
			console.log('errorCode: http://analytics.hivisasa.tech/ranked: '+e.status);
		};
		return unirest_prom(uni.get('http://analytics.hivisasa.tech/latest'), true);		
	},function(e){
		console.log('error http://analytics.hivisasa.tech/ranked:');
	});
	
	requestProm3.then(function(e){
		if(e.status==200){
			latestArticles=body.e;
			console.log(latestArticles);
		}else{
			console.log('errorCode: http://analytics.hivisasa.tech/latest: '+e.status);
		};
		render_articles(res, req, rankedArticles, latestArticles, locations);
	},function(e){
		console.log('error http://analytics.hivisasa.tech/latest:');
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


function unirest_prom(unirest_req, always_resolve) {
  // Returns a Promise by wrapping a unirest.Request object in
  // a Promise that immediately calls `.end(...)`
  //
  // Params:
  //
  // *   unirest_req - unirest.Request - any unirest Request object that has
  //                   not yet had `.end(...)` called on it
  // *   always_resolve - bool (optional) - defaults to `false`, iff `true` then
  //                      the Promise always resolves--even when the request fails
  //                      (since HTTP errors are encapsulated in the `response`
  //                      object). A unirest.Response object is passed to either
  //                      `resolve` or `reject`.
  //
  return new Promise((resolve, reject) => {
    unirest_req.end(r => {
      return ((always_resolve === true ||
               (r.status >= 200 && r.status < 300)) ?
              resolve(r) :
              reject(r));
    });
  });
}

module.exports = router;
