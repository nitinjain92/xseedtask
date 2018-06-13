function test(xseed) 
{
	var typeArray = [
		'type Address1 { city:String!, state:String}',
		'type User1 @model { id:String! @unique, email:String! @unique, name:String!, age:Int, addresses:[Address1], dateOfBirth:Date}',
		];	

	xseed.generateModel(typeArray, function(modelSchema) {

		var User1 = modelSchema['User1'];

		var u11 = new User1({
			id: "9580",
			email: "nitinjain92nj@gmail.com",
			name: "Nitin Jain",
			age:26,
			dateOfBirth:Date.now()
		});
		u11.save(function(error) // No error
		{
			if (error)
				console.error('u11 ' + error);
			else
				console.log("u11 has been saved!");
		});

		var u12 = new User1({
			id: "9582",
			email: "aman.nith@gmail.com",
			name: "Aman Mishra",
			age:28,
			dateOfBirth:Date.now()
		});	
		u12.save(function(error) // Success case
		{
			if (error)
				console.error('u12 ' + error);
			else
				console.log("u12 has been saved!");
		});

		var u13 = new User1({
			id: "9583",
			email: "navneetgupta13@gmail.com",
			name: "Navneet Gupta",
			age:28,
			addresses:[{
				city:'Noida',
				state:'U.P.',
				pincode:201301, // auto neglected values
				zipcode:321022 // auto neglected values
			}, {
				city:'Delhi',
				state:'NCR',
				pincode:201301, // auto neglected values
				zipcode:321022 // auto neglected values
			}],
			dateOfBirth:Date.now()
		});
		u13.save(function(error) // Success case
		{
			if (error)
				console.error('u13 ' + error);
			else
			{
				console.log("u13 has been saved!");
				var u14 = new User1({
					id: "9583",
					email: "abc@gmail.com",
					name: "Navneet Gupta",
					age:28,
					addresses:[{
						city:'Noida',
						state:'U.P.',
					}],
					dateOfBirth:Date.now()
				});
				u14.save(function(error) // Error case as 9583 duplicate id error
				{
					if (error)
						console.error('u14 ' + error);
					else
						console.log("u14 has been saved!");
				});		
			}
		});

		var u16 = new User1({
			id: "9585",
			email: "abc@gmail.com",
			name: "Navneet Gupta",
			age:28,
			addresses:[{
				state:'U.P.'
			}],
			dateOfBirth:Date.now()
		});
		u16.save(function(error) // Error case as city field missing validation error
		{
			if (error)
				console.error('u16 ' + error);
			else
				console.log("u16 has been saved!");
		});

		var u17 = new User1({
			id: "9586",
			email: "abc@gmail.com",
			name: "Abc Xyz",
			age:28,
			addresses:[{
				city:'Kanpur',
				state:'U.P.'
			}],
			dateOfBirth:Date.now()
		});
		u17.save(function(error) // Success case
		{
			if (error)
				console.error('u17 ' + error);
			else
				console.log("u17 has been saved!");
		});

	});
}

exports.test = test;