const fs = require('fs');
const restify = require('restify');
const skype = require('skype-sdk');

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

botService.on('personalMessage', (bot, data) => {
    console.log("got request: ${data.content}");
    bot.reply(`Hey ${data.from}. Thank you for your message: ${data.content}.`, true);
});

const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
const port = process.env.PORT || 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);
