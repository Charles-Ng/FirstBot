var restify = require('restify');
var builder = require('botbuilder');

var intents = new builder.IntentDialog();


//===============BOT SETUP==================

//Set up Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){console.log('%s listening to %s', server.name, server.url);
});

//Create chat bot
var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//==============BOTS INTENTS==================
bot.dialog('/', intents);

intents.matches(/^change name/i, [
	function (session){
		session.beginDialog('/profile');
	},
	function (session, results){
		session.send('Ok, I changed your name to %s', session.userData.name);
	}]);

intents.onDefault([
	function(session, args, next){
		if(!session.userData.name){
			session.beginDialog('/profile');
		}else{
			next();
		}
	},
	function(session, results){
		session.send('Hello %s!', session.userData.name);
	}
]);

//================BOTS DIALOGS================

/*bot.dialog('/', [
	function(session, args, next){
		session.send('Hello! What is your name?');
		if(!session.userData.name){
			session.beginDialog('/profile');
		}else{
			next();
		}
	},
	function(session, results){
		session.send('Hello %s!', session.userData.name);
	} /*waterfall chaining - result of first is fed to second 
]);*/

bot.dialog('/profile', [
	function(session){
		builder.Prompts.text(session, 'Hi! What\'s your name?');
	},
	function(session, results){
		session.userData.name = results.response;
		session.endDialog(); 
	}
]);