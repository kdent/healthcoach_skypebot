/*jshint esversion:6, node:true */

const fs = require('fs');
const restify = require('restify');
const skype = require('skype-sdk');
const luisHost = 'api.projectoxford.ai';
//const luisHost = 'encrypted.google.com';
const luisPath = '/luis/v1/application';
const luisIdParams = 'id=825a810c-8e48-4e37-a73e-6bbaa758a0d3&subscription-key=e0ef50cf20ae4a14b33b88b73b9f9837';

const botService = new skype.BotService({
    messaging: {
        botId: 'bea3b9f7-c53e-4857-b1fb-18dff17bf098',
        serverUrl : "https://apis.skype.com ",
        requestTimeout : 15000,
//        appId: process.env.APP_ID,
        appId: "7d5734a4-5822-4dd1-ac0c-f902c36d7b41",
//        appSecret: process.env.APP_SECRET
        appSecret: "og966z4bGkzkgakEBpFb4kN"
    }
});

botService.on('contactAdded', (bot, data) => {
    bot.reply(`Hello ${data.fromDisplayName}!`, true);
});

/*
 * Callback for when a message is received by the bot.
 * bot - Bot class object
 * data - Message class object
 *
 * The data variable has the message with various attributes.
 * use the bot object to reply to messages.
 */
botService.on('personalMessage', (bot, data) => {
    var https = require('https');
    var req;
    var options;

    console.log("got request: " + data.content);

    options = {
        hostname: luisHost,
        port: 443,
        path: luisPath + '?' + luisIdParams + "&q="
            + encodeURIComponent(data.content),
        method: 'GET'
    };

    console.log("sending request to LUIS: " + options.path);
    req = https.request(options, (response) => {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            bot.reply('Intent info: ' + str, true);
            console.log(str);
        });

    });
    req.end();
    console.log("past request");

    req.on('error', (e) => {
        console.error(e);
    });

});


const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
const port = process.env.PORT || 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);
