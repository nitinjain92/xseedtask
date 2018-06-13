function test(xseed) 
{
	var typeArray = [
		'type Address2 { city:String!, state:String, pincode:Int!}',
		'type User2 @model { id:String! @unique, email:String! @unique, name:String!, age:Int, address:Address2, dateOfBirth:Date, images:[String]}'
		];	

	xseed.generateModel(typeArray, function(modelSchema) {

		var User2 = modelSchema['User2'];

		var u21 = new User2({
			id: "9580",
			email: "nitinjain92nj@gmail.com",
			name: "Nitin Jain",
			age:26,
			dateOfBirth:Date.now(),
			images:['heybuddy.png', 'helloworld.jpg'],
			address: {
				city:'Noida',
				state:'U.P.',
				pincode:201301,
				zipcode:321022 // auto neglected values
			}
		});
		u21.save(function(error) // Success case
		{
			if (error)
				console.error('u21 ' + error);
			else
				console.log("u21 has been saved!");
		});

		var u22 = new User2({
			id: "9582",
			email: "aman.nith@gmail.com",
			name: "Aman Mishra",
			age:28,
			dateOfBirth:Date.now(),
			images:['heybuddy.png', 'helloworld.png','nith.jpg']
		});
		u22.save(function(error) // Success case
		{
			if (error)
				console.error('u22 ' + error);
			else
				console.log("u22 has been saved!");
		});

		var u23 = new User2({
			id: "9583",
			email: "navneetgupta13@gmail.com",
			name: "Navneet Gupta",
			age:26,
			dateOfBirth:Date.now(),
			images:['gone.jpg'],
			address: {
				city:'Delhi',
				state:'NCR',
				pincode:201301,
				zipcode:321022 // auto neglected values
			}
		});
		u23.save(function(error) // Success case
		{
			if (error)
				console.error('u23' + error);
			else
			{
				console.log("u23 has been saved!");
				var u24 = new User2({
					id: "9583",
					email: "abc@gmail.com",
					name: "Navneet Gupta",
					age:28,
					address:{
						city:'Noida',
						state:'U.P.',
						pincode:201301
					},
					dateOfBirth:Date.now()
				});
				u24.save(function(error) // Error case as 9583 duplicate id error
				{
					if (error)
						console.error('u24 ' + error);
					else
						console.log("u24 has been saved!");
				});
			}
		});

		var u26 = new User2({
			id: "9585",
			email: "abc@gmail.com",
			name: "Navneet Gupta",
			age:28,
			address:{
				state:'U.P.'
			},
			dateOfBirth:Date.now()
		});
		u26.save(function(error) // Error case as city and pincode field missing validation error
		{
			if (error)
				console.error('u26 ' + error);
			else
				console.log("u26 has been saved!");
		});

		var u27 = new User2({
			id: "9586",
			email: "abc@gmail.com",
			name: "Abc Xyz",
			age:28,
			address:{
				city:'Kanpur',
				state:'U.P.',
				pincode:211330
			},
			dateOfBirth:Date.now()
		});
		u27.save(function(error) // Success case
		{
			if (error)
				console.error('u27 ' + error);
			else
				console.log("u27 has been saved!");
		});

	});
}

exports.test = test;