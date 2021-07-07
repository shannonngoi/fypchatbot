// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const axios = require('axios').default;
const { ActivityHandler, MessageFactory } = require('botbuilder');
const https = require('https');
const path = require('path');
const utils = require('./utils.js');
const customVisionService = require('./customVisionService.js');
const dotenv = require('dotenv');
// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });


const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Prediction-Key': '0fe4b153770a431d8dfb77ec1a481ec7'
    },
  });

const customURL = "https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/0df60e07-c3ec-4535-a2ab-684623f12526/classify/iterations/Iteration1/url"
const abc ="https://i0.wp.com/eatwhattonight.com/wp-content/uploads/2018/09/DSC_0514.jpg"
const abc2 = "https://www.seriouseats.com/thmb/iYMnKlLrza5RZeis8HzoMK2ZlUw=/610x343/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__20100408blueribbonnorthernfriedchicken-e3781415f559475598fd24aff789e4a4.jpg"


const customVisionPredictionKey = "0fe4b153770a431d8dfb77ec1a481ec7"
const customVisionPredictionEndPoint = "https://westus2.api.cognitive.microsoft.com/"
const projectId = "0df60e07-c3ec-4535-a2ab-684623f12526"
const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const restify = require('restify');

const credentials = new ApiKeyCredentials({ inHeader: {"Prediction-key": customVisionPredictionKey } });
const client = new PredictionAPIClient(credentials, customVisionPredictionEndPoint);

const imageURL =
"https://www.atlantatrails.com/wp-content/uploads/2019/02/north-georgia-waterfalls-1024x683.jpg";

const fetch = require('node-fetch');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// This bot's main dialog.
const { EchoBot } = require('./bot');
// Map knowledge base endpoint values from .env file into the required format for `QnAMaker`.
const configuration = {
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    endpointKey: process.env.QnAAuthKey,
    host: process.env.QnAEndpointHostName,
 };

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Create the main dialog.
const myBot = new EchoBot(configuration, {});

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await myBot.run(context);
        
    });
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });
    // Set onTurnError for the BotFrameworkAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    streamingAdapter.useWebSocket(req, socket, head, async (context) => {
        // After connecting via WebSocket, run this logic for every request sent over
        // the WebSocket connection.
        await myBot.run(context);
    });
});





