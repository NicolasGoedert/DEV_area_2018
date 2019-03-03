const express = require('express')
const path = require('path')
const app = express()
const pages = '/pages'


app.use(express.static(__dirname));

var client_id_spotify = '6b1be766250242c6a9eb00ee7d797ccf';
var client_secret_spotify = '9e9c623489d94ac685ec7d2a00d71a98';
var redirect_uri_spotify = 'http://localhost:8081/callback';
var querystring = require('querystring');
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var stateKey = 'spotify_auth_state';

var code_deezer = '';
var client_id_deezer = '331582';
var client_secret_deezer = 'ae4d68d1eb3b2f274959d34adfe9846c';
var redirect_uri_deezer = 'http://localhost:8081/callback/deezer';

var client_id_insta = '369f39d83af84b1e9b53b6a7692dad65';
var client_secret_insta = '5dea8db4d3084437995f0c85827ac809';
var redirect_uri_insta = 'http://localhost:8081/callback/insta';

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

/*app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
})*/

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + pages + '/register.html'));
})

app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname + pages + '/home.html'));
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + pages + '/login.html'));
})

app.listen(8081, function () {
    console.log('Website listening on port 8081!')
})

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/login/spotify', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id_spotify,
      scope: scope,
      redirect_uri: redirect_uri_spotify,
      state: state
    }));
});

app.get('/callback', function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null) {
	res.redirect('/#' +
		     querystring.stringify({
			 error: 'state_mismatch'
		     }));
    } else {
	res.clearCookie(stateKey);
    var authOptions = {
	url: 'https://accounts.spotify.com/api/token',
	form: {
            code: code,
            redirect_uri: redirect_uri_spotify,
            grant_type: 'authorization_code'
	},
	headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id_spotify + ':' + client_secret_spotify).toString('base64'))
	},
	json: true
    };
	
	request.post(authOptions, function(error, response, body) {
	    if (!error && response.statusCode === 200) {
		
		var access_token = body.access_token,
		    refresh_token = body.refresh_token;
		
		var options = {
		    url: 'https://api.spotify.com/v1/me',
		    headers: { 'Authorization': 'Bearer ' + access_token },
		    json: true
		};
		
		// we can also pass the token to the browser to make requests from there
		res.redirect('/#' +
			     querystring.stringify({
				 access_token: access_token,
				 refresh_token: refresh_token
			     }));
	    } else {
		res.redirect('/#' +
			     querystring.stringify({
				 error: 'invalid_token'
			     }));
	    }
	});
    }
});

app.get('/callback/deezer', function(req, res) {
    code_deezer = req.url.substr(22);
    var authOptions = {
        url: 'https://connect.deezer.com/oauth/access_token.php?app_id=' + client_id_deezer + '&secret=' + client_secret_deezer + '&code=' + code_deezer + '&output=json',
        json: true
    };

    request.post(authOptions, function(error, response, body) {
	var access_token_deezer = body.access_token;
	res.redirect('/# - ' + access_token_deezer + ' - mabite');
    });
});

app.get('/login/insta', function(req, res) {
    res.redirect('https://api.instagram.com/oauth/authorize/?client_id=' + client_id_insta + '&redirect_uri=' + redirect_uri_insta + '&response_type=code');
    console.log("coucou");
});

app.get('/login/deezer', function(req, res) {
    res.redirect('https://connect.deezer.com/oauth/auth.php?app_id=' + client_id_deezer + '&redirect_uri=' + redirect_uri_deezer + '&perms=basic_access,email');
});

app.get('/callback/insta', function(req, res) {
    var code_insta = req.url.split('code=')[1];
    var authOptionsInsta = {
	url: 'https://api.instagram.com/oauth/access_token',
	form: {
	    client_id: client_id_insta,
	    client_secret: client_secret_insta,
	    grant_type: 'authorization_code',
	    redirect_uri: 'http://localhost:8081/callback/insta',
	    code: code_insta,
	},
	json: true
    };

    request.post(authOptionsInsta, function(error, response, body) {
	var access_token_insta = body.access_token;
	res.redirect('/#access_token=' + access_token_insta);
    });
});
