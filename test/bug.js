function test(xseed) 
{
	var typeArray = ['type Bug @model { bugName:String!, bugColour:String!, Genus:String}' ];	

	xseed.generateModel(typeArray, function(modelSchema) {
		var Bug = modelSchema['Bug']; // fetch

		var Bee = new Bug({
			bugName: "Scruffy",
			bugColour: "Orange",
			Genus: "Bombus"
		});
		Bee.save(function(error) // Success case
		{
			if (error)
				console.error('Bee ' + error);
			else
				console.log("Bee has been saved!");
		});
	
		var Ant = new Bug({
			bugName: "Ant",
			bugColour: "Black",
			Genus: "Formica"
		});
		Ant.save(function(error) // Success case
		{
			if (error)
				console.error('Ant ' + error);
			else
				console.log("Ant has been saved!");
		});

		var BedBug = new Bug({
			bugName: "Bed Bug",
			Genus: "Cimex"
		});
		BedBug.save(function(error)  // Error case as bugColour is undefined
		{
			if (error)
				console.error('BedBug ' + error);
			else
				console.log("BedBug has been saved!");
		});
		
	});
}

exports.test = test;