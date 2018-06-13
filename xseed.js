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
		Genus: String,
});

var testType = new mongoose.SchemaType('test', null, 'String');
testType.unique(true);
testType.required(true, 'Path is required.');

bugSchema.path('test', testType);
console.log(JSON.stringify(bugSchema));

var Bug = mongoose.model("Bug", bugSchema);

function generateModel(typeStringArray, callback)
{
	var nonModelMap = new Array();
	var modelMap = new Array();
	
	typeStringArray.forEach(function (value) 
	{
		console.log("Value => " + value);
		value = value.trim();

		var bracesIndex1 = value.indexOf('{');
		var bracesIndex2 = value.indexOf('}');

		var first = value.substring(0, bracesIndex1).trim();
		var second = value.substring(bracesIndex1+1, bracesIndex2).trim();

		if(first.indexOf('@model') > -1) 
		{
			var key1 = first.substring( first.indexOf('type') + 4, first.indexOf('@model') ).trim();
			modelMap.push({
				key:   key1,
				value: second
			});
		}
		else 
		{
			var key1 = first.substring( first.indexOf('type') + 4, first.length).trim();
			nonModelMap.push({
				key:   key1,
				value: second
			});
		}
	});

	//callback(modelMap, nonModelMap);
	generateSchema(modelMap, nonModelMap, callback);
}

function generateSchema(modelMap, nonModelMap, callback)
{	
	var modelSchema = new Array();
	var nonModelSchema = new Array();

	for (var index in nonModelMap)
	{
		var xschema = new mongoose.Schema();
		var xkey = nonModelMap[index]["key"];

		var propArray = nonModelMap[index]["value"].split(",");	
		console.log("Non Model Schema Key => " + xkey);
		console.log("Non Model Schema Array => " + JSON.stringify(propArray));
		
		for(var jIndex in propArray)
		{
			var properties = propArray[jIndex].split(":");
			var typeKey = properties[0].trim();
			var typeValue = properties[1].trim();
			
			console.log("Non Model Schema properties => " + typeKey + " => " + typeValue);
			xschema.path(new String(typeKey), getValidSchemaType(typeKey, typeValue, nonModelSchema) );
		}

		nonModelSchema.push({
			key:   xkey,
			value: xschema
		})
	}
	
	for (var index in modelMap)
	{
		var xschema = new mongoose.Schema();
		var xkey = modelMap[index]["key"];

		var propArray = modelMap[index]["value"].split(",");	
		console.log("Model Schema Key => " + xkey);
		console.log("Model Schema Array => " + JSON.stringify(propArray));
		
		for(var jIndex in propArray)
		{
			var properties = propArray[jIndex].split(":");
			var typeKey = properties[0].trim();
			var typeValue = properties[1].trim();
			
			console.log("Model Schema properties => " + typeKey + " => " + typeValue);
			xschema.path(typeKey, getValidSchemaType(typeKey, typeValue, nonModelSchema));
		}

		modelSchema.push({
			key:   xkey,
			value: xschema
		})
	}

	callback(modelSchema, nonModelSchema);
}

function getValidSchemaType(inputKey, inputType, nonModelSchema)
{
	var constSchemaTypes = new Array();
	constSchemaTypes['String'] = function(key, isArray) 
	{
		if(isArray)
			return new mongoose.SchemaTypes.Array(key, mongoose.SchemaTypes.String);
		else
			return new mongoose.SchemaTypes.String(key);
	}

	constSchemaTypes['Int'] = function(key, isArray) 
	{
		if(isArray)
			return new mongoose.SchemaTypes.Array(key, mongoose.SchemaTypes.Number);
		else
			return new mongoose.SchemaTypes.Number(key);
	}

	constSchemaTypes['Date'] = function(key, isArray) 
	{
		if(isArray)
			return new mongoose.SchemaTypes.Array(key, mongoose.SchemaTypes.Date);
		else
			return new mongoose.SchemaTypes.Date(key);
	}

	constSchemaTypes['Boolean'] = function(key, isArray) 
	{
		if(isArray)
			return new mongoose.SchemaTypes.Array(key, mongoose.SchemaTypes.Boolean);
		else
			return new mongoose.SchemaTypes.Boolean(key);
	}

	constSchemaTypes['ObjectId'] = function(key, isArray) 
	{
		if(isArray)
			return new mongoose.SchemaTypes.Array(key, mongoose.SchemaTypes.ObjectId);
		else
			return new mongoose.SchemaTypes.ObjectId(key);
	}

	constSchemaTypes['nonModelSchema'] = function(key, isArray) 
	{
		var xvalue;

		for (var index in nonModelSchema)
		{
			var xkey = nonModelSchema[index]["key"];
			if( xkey == key)
			{
				xvalue = nonModelSchema[index]["value"];
				break;
			}
		}

		if(isArray)
			return new mongoose.SchemaTypes.Array(key, typeof xvalue);
		else
			return new mongoose.SchemaType(Object.assign({}, xvalue));
	}

	var isUnique = false;
	var isRequired = false;
	var isArray = false;
	
	var input = inputType;

	if(inputType.indexOf('@unique') > -1)
	{
		isUnique = true;
		input = input.substring(0, input.indexOf('@unique'));
	}

	if(inputType.indexOf('!') > -1)
	{
		isRequired = true;
		input = input.substring(0, input.indexOf('!'));
	}

	if(inputType.indexOf(']') > -1)
	{
		isArray = true;
		input = input.substring(input.indexOf('[') + 1, input.indexOf(']'));
	}
	
	console.log("Input = > " + input);
	var schemaType = new mongoose.SchemaType();

	if(constSchemaTypes[input])
	{
		schemaType = constSchemaTypes[input](input, isArray);
		schemaType.unique(isUnique);
		schemaType.required(isRequired, inputKey + ' is required.');	
	}
	else
	{
		schemaType = constSchemaTypes['nonModelSchema'](input, isArray);
		console.log(JSON.stringify(schemaType));
		schemaType.unique(isUnique);
		schemaType.required(isRequired, inputKey + 'Path is required.');
	}

	return schemaType;
}

var typeArray = [
				'type Address1 { city:String!, state:String}',
				'type Address2 { city:String!, state:String, pincode:Int!}',
				'type User1​ @model​ { id:String! @unique, email:String! @unique, name:String!, age:Int, addresses:Address1, dateOfBirth:Date​}',
				'type User2​ @model​ { id:String! @unique, email:String! @unique, name:String!, age:Int, addresses:Address2, dateOfBirth:Date​}'
				];

generateModel(typeArray, function(modelSchema, nonModelSchema) {
		console.log("Model Schema => " + JSON.stringify(modelSchema));
		console.log("Non Model Schema => " + JSON.stringify(nonModelSchema));
	}
);