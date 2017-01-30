var express = require('express');
var app     = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var qs = require('querystring');

var server = require('http').Server(app);
server.listen(3000);

// Database (mongodb native)
var Db    = require('./Mongodb')();
var dbUrl = 'mongodb://127.0.0.1:27017/toilet';


/*----------------------------------------
| API
|----------------------------------------*/
app.get('/api/search', function(req, res){
  res.render('default');
});

app.get('/api/all', function(req, res){
  res.send("HEY! You don't want all that $h!t on your screen. Do you?");
});

app.post('/api/coords/', function(req, res){
	var body = '';
    req.on('data', function (data) {
        body += data;
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) { 
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE req
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        var POST = qs.parse(body);
        var params = {};
        params.latitude = POST['coords[latitude]'];
        params.longitude = POST['coords[longitude]'];

        Db.MongoClient.connect(dbUrl, function(err, db) {
	        if(err) throw err;
	        
	        Db.findDocuments(db, params, function(results){
	            res.json(results);
	            db.close();
	        });
	    }.bind(this));	
    });
});

app.get('/api/:longitude/:latitude', function(req, res){

    Db.MongoClient.connect(dbUrl, function(err, db) {

        if(err) throw err;
        
        Db.findDocuments(db, req.params, function(results){
            // res.send(results);
            res.render('default', {tlts: results});

            db.close();
        });

    }.bind(this));
});
