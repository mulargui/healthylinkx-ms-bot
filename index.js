
var builder = require('botbuilder');

var microservice = require("./microservice"); 

//=========================================================
// Bot Setup to connect to the MS Bot Connector
//=========================================================
/*
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
*/
//=========================================================
// Bot Setup to connect to a console
//=========================================================

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

//=========================================================
// Bot Dialogs
//=========================================================

bot.dialog('/', [
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

		if(results.response == 'male')
			session.userData.gender = 'M';
		else
			session.userData.gender = 'F';
			
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

		if(results.response == 'nada')
			session.userData.specialty = '';
		else
			session.userData.gender = results.response;
			
		/*session.send('Ok! This is what we know');
		session.send('Zipcode: '    + session.userData.zipcode);
		session.send('Distance: '   + session.userData.distance);
		session.send('Gender: '     + session.userData.gender);
		session.send('Lastname: '   + session.userData.lastname);
		session.send('Speciality: ' + session.userData.specialty);*/

		microservice.getSearchResults(session.userData.zipcode, 
			session.userData.lastname, 
			session.userData.distance, 
			session.userData.gender, 
			session.userData.specialty)
			.then( function(res) {
				session.send(res);
			});
	}
]);
