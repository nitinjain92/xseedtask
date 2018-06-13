var mongoose = require('mongoose');

var MY_URI = 'mongodb://localhost:27017/';
var MY_USER =  'myAdmin';
var MY_PASSWORD = 'abc123';
var MY_DATABASE = 'xseed';

const options = 
{
		dbName: MY_DATABASE,
		user: MY_USER,
		pass: MY_PASSWORD,
		autoIndex: false, // Don't build indexes
		poolSize: 10, // Maintain up to 10 socket connections
		bufferMaxEntries: 0
};
	
mongoose.connect(MY_URI, options, function(error) 
{
		console.log( "Mongo DB Error => " + error);
});
				
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() 
{
	console.log('we re connected!');
});

var Schema = mongoose.Schema;
 
var bugSchema = new Schema({
		bugName: String,
		bugColour: String,
		Genus: String
});

var Bug = mongoose.model("Bug", bugSchema);

var Bee = new Bug({
		bugName: "Scruffy",
		bugColour: "Orange",
		Genus: "Bombus"
});

Bee.save(function(error) 
{
	console.log("Your bee has been saved!");
	if (error)
		console.error(error);	
});

var Ant = new Bug({
	bugName: "Ants",
	bugColour: "Black",
	Genus: "Antler"
});

Ant.save(function(error) 
{
	console.log("Your bee has been saved!");
	if (error)
		console.error(error);	
});


