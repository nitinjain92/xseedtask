var mongoose = require('mongoose');

var db;
var MY_URI = 'mongodb://localhost:27017/';
var MY_USER =  'myAdmin';
var MY_PASSWORD = 'abc123';
var MY_DATABASE = 'xseed';

console.log("monoogse => Fetching mongo db...(1/3)");

const options = 
{
		dbName: MY_DATABASE,
		user: MY_USER,
		pass: MY_PASSWORD,
		autoIndex: false, // Don't build indexes
		poolSize: 20, // Maintain up to 10 socket connections
		bufferMaxEntries: 0
};

exports.db = function() 
{
    console.log("monoogse => Fetching mongo db...(2/3)");

    if (db == null)
    {
        console.log("monoogse => Fetching mongo db...(3/3)");
        mongoose.connect(MY_URI, options, function(error) 
        {
            console.log( "mongoose => DB Error => " + error);
        });

        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() 
        {
            console.log('mongoose => we re connected!');
        });
    }

    return mongoose;
}
