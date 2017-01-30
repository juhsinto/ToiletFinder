var MongoDb = function(){
	//DB
	this.MongoClient = require('mongodb').MongoClient
	    , format = require('util').format,
	    assert = require('assert');


	this.findDocuments = function(db, params, callback) {
		var lon = parseFloat(params.longitude);
		var lat = parseFloat(params.latitude);
		var collection = db.collection('toilets');
		collection.find(
		        { location:
		           { $near :
		              {
		                $geometry: { type: "Point",  coordinates: [ lon, lat ] },
		                $minDistance: 1,
		                $maxDistance: 500
		              }
		           }
		       }
		    ).toArray(function(err, docs) {
		        // console.dir(docs);
		        callback(docs);
		    });
		}
};

module.exports = function () {
	return new MongoDb();

};



