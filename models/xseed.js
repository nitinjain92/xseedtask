var mongoose = require('./db').db();

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
			modelMap[key1] = second;
		}
		else 
		{
			var key1 = first.substring( first.indexOf('type') + 4, first.length).trim();
			nonModelMap[key1] = second;
		}
	});

	//callback(modelMap, nonModelMap);
	generateSchema(modelMap, nonModelMap, callback);
}

function generateSchema(modelMap, nonModelMap, callback)
{	
	var modelSchema = new Array();
	var nonModelSchema = new Array();
	//var nonModel = new Array();

	Object.keys(nonModelMap).forEach(function(xkey) 
	{
		var xschema = new mongoose.Schema({});
		var propArray = nonModelMap[xkey].split(",");

		//console.log("Non Model Schema Key => " + xkey);
		//console.log("Non Model Schema Array => " + JSON.stringify(propArray));
		
		for(var jIndex in propArray)
		{
			var properties = propArray[jIndex].split(":");
			var typeKey = properties[0].trim();
			var typeValue = properties[1].trim();
			
			//console.log("Non Model Schema properties => " + typeKey + " => " + typeValue);
			xschema.path(new String(typeKey), getValidSchemaType(typeKey, typeValue, nonModelSchema) );
		}

		// var xmodel = mongoose.model(xkey, xschema);
		// nonModel[xkey] = xmodel;
		nonModelSchema[xkey] = xschema;
	});

	Object.keys(modelMap).forEach(function(xkey) 
	{
		var xschema = new mongoose.Schema({});
		var propArray = modelMap[xkey].split(",");	

		//console.log("Model Schema Key => " + xkey);
		//console.log("Model Schema Array => " + JSON.stringify(propArray));
		
		for(var jIndex in propArray)
		{
			var properties = propArray[jIndex].split(":");
			var typeKey = properties[0].trim();
			var typeValue = properties[1].trim();
			
			//console.log("Model Schema properties => " + typeKey + " => " + typeValue);
			xschema.path(typeKey, getValidSchemaType(typeKey, typeValue, nonModelSchema));
		}

		var xmodel = mongoose.model(xkey, xschema);
		xmodel.createIndexes(function (err) {
			if (err) 
				console.log("Index creation failed => "+err);
			else
				console.log("Index creation success => "+xkey);
		});
		modelSchema[xkey] = xmodel;
	});

	//callback(modelSchema, nonModelSchema, nonModel);
	callback(modelSchema);
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
		var xvalue = nonModelSchema[key];

		if(isArray)
			return new mongoose.SchemaTypes.DocumentArray(key, xvalue.clone());
		else
			return new mongoose.SchemaTypes.Embedded(xvalue.clone(), key);
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
	
	//console.log("Input = > " + input);
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
		schemaType.unique(isUnique);
		schemaType.required(isRequired, inputKey + ' is required.');
	}

	return schemaType;
}

exports.generateModel = generateModel;