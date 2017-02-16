
var builder = require('botbuilder');
var microservice = require("./microservice"); 

exports.conversation = [
	function (session) {
		builder.Prompts.text(session, 'Looking for a doctor? (yes/no)');
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');
		
		builder.Prompts.text(session, 'Great!\nWe only cover Washington State.\nWhich Zip code are you interested on (or no to finish)?');	 
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');

		session.userData.zipcode = results.response;
		builder.Prompts.text(session, 'Which is max distance you are happy to go in miles (or no to finish)?');	 
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');

		session.userData.distance = results.response;
		builder.Prompts.text(session, 'Do you prefere a Male or Female doctor (or no to finish)?');	 
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');

		session.userData.gender = results.response;			
		builder.Prompts.text(session, 'Include the lastname of the doctor if you know it (or no to finish)');	 
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');

		session.userData.lastname = results.response;
		builder.Prompts.text(session, 'Include the specialty you are looking for (or no to finish)');	 
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');

		session.userData.specialty = results.response;
		/*	
		session.send('Ok! This is what we know');
		session.send('Zipcode: '    + session.userData.zipcode);
		session.send('Distance: '   + session.userData.distance);
		session.send('Gender: '     + session.userData.gender);
		session.send('Lastname: '   + session.userData.lastname);
		session.send('Speciality: ' + session.userData.specialty);*/

		with(session.userData)
			microservice.getSearchResults(zipcode, lastname, distance, 
				gender, specialty)
				.then( function(res) {
					session.send(res);
				});
	}
];
