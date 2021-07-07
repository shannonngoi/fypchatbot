// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { QnAMaker } = require('botbuilder-ai');
const utils = require('./utils.js');
const axios = require('axios').default;
const request = require('request-promise').defaults({ encoding: null });
const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Prediction-Key': '0fe4b153770a431d8dfb77ec1a481ec7'
    },
  });

class EchoBot extends ActivityHandler {
    constructor(configuration, qnaOptions) {
        super();
        if (!configuration) throw new Error('[QnaMakerBot]: Missing parameter. configuration is required');
        // now create a QnAMaker connector.
        this.qnaMaker = new QnAMaker(configuration, qnaOptions);
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
       

        this.onMessage(async (context, next) => {
            const replyText = `DIABOT: ${ context.activity.text }`;
            // if the picture is nothing
            if(typeof context.activity.attachments == "undefined"){
                //await myBot.run(context);
                console.log("somehting");
                //await context.sendActivity(MessageFactory.text(replyText, replyText));
                // send user input to QnA Maker.
                const qnaResults = await this.qnaMaker.getAnswers(context);
                console.log(context);
                // If an answer was received from QnA Maker, send the answer back to the user.
                if (qnaResults[0]) {
                    await context.sendActivity(` ${ qnaResults[0].answer}`);              
                }  
                else {
                    // If no answers were returned from QnA Maker, reply with help.
                    await context.sendActivity('So sorry DIABOT doesnt understand you.'
                        + 'Please pick another option as below: '
                        + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
    
                }
                await next();
            }
            //if got picture
            else{
                var attachment = context.activity.attachments[0];
                //console.log(attachment);
                var abc3= attachment.contentUrl;
                var data = JSON.stringify({URL:abc3})
                console.log("whatever");
                const options = {
                    method: 'POST',
                    uri:"https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/0df60e07-c3ec-4535-a2ab-684623f12526/classify/iterations/Iteration2/url",
                    headers: {
                        'Content-Type': 'application/json',
                        'Prediction-Key': '0fe4b153770a431d8dfb77ec1a481ec7'
                    },        
                    body:data
                };
                console.log("anything");
                await request(options).then(async (response)=>{
                    var jsonObj = JSON.parse(response.toString('utf8'));
                    console.log(jsonObj)
                    var topPrediction = jsonObj.predictions[0];

                    // make sure we only get confidence level with 0.80 and above. But you can adjust this depending on your need
                    if (topPrediction.probability >= 0.80) {
                        let subway={name:"subway chicken slice x6",calories:"290",fats:"5g", carbs:"47g", protein:"18g"};
                        let salad={name:"salad",calories:"290",fats:"5g", carbs:"47g", protein:"18g"};
                        let fishnoodles={name:"fish noodles",calories:"290",fats:"5g", carbs:"47g", protein:"18g"};
                        let chickenporridge={name:"chicken porridge",calories:"290",fats:"5g", carbs:"47g", protein:"18g"};
                        let friedrice={name:"fried rice",calories:"290",fats:"5g", carbs:"47g", protein:"18g"};
                        let friedchicken={name:"fried chicken",calories:"121",fats:"121"};
                        let mashedpotato={name:"mashed potato",calories:"121",fats:"121"};
                        var x= "not good dont eat this la try to eat this instead XXX";
                        console.log(`Hey, I think this image is a ${topPrediction.tagName}!`);

                        //if it is a salad then
                        if(subway.name == topPrediction.tagName ){
                             await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains Calories:'+subway.calories+ " Fats:"+subway.fats+" Carbs:"+subway.carbs+" Protein:"+subway.protein+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }

                        else if (salad.name == topPrediction.tagName ){
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains \n Total Calories:'+salad.calories+ " Fats:"+salad.fats+" Carbs:"+salad.carbs+" Protein:"+salad.protein+
                           '\n Is there anything you wanna ask from DIABOT?'
                           + ' Please pick another option as below: '
                           + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                       }
                        else if (fishnoodles.name == topPrediction.tagName ){
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains \n Total Calories:'+fishnoodles.calories+ " Fats:"+fishnoodles.fats+" Carbs:"+fishnoodles.carbs+" Protein:"+fishnoodles.protein+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }
                        else if (chickenporridge.name == topPrediction.tagName ){
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains \n Total Calories:'+chickenporridge.calories+" Fats:"+chickenporridge.fats+" Carbs:"+chickenporridge.carbs+" Protein:"+chickenporridge.protein+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }
                        else if (friedrice.name == topPrediction.tagName ){
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains \n Total Calories:'+friedrice.calories+ " Fats:"+friedrice.fats+" Carbs:"+friedrice.carbs+" Protein:"+friedrice.protein+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }
                        else if (friedchicken.name == topPrediction.tagName ){
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains \n Total Calories:'+friedchicken.calories+ " Fats:"+friedchicken.fats+" Carbs:"+friedchicken.carbs+" Protein:"+friedchicken.protein+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }
                        else if (mashedpotato.name == topPrediction.tagName ){
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+ '. \n This food contains \n Total Calories:'+mashedpotato.calories+ " Fats:"+mashedpotato.fats+" Carbs:"+mashedpotato.carbs+" Protein:"+mashedpotato.protein+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }
                        else{
                            await context.sendActivity('I think this is a '+ topPrediction.tagName+
                            '\n Is there anything you wanna ask from DIABOT?'
                            + ' Please pick another option as below: '
                            + `\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question`);
                        }

                      

                    } else {
                        await context.sendActivity('Sorry! I don\'t know what that is :( How about try to send another picture?');
                    }
                });
                
          
            }
           
        });
        

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello, im DIABOT. It is really good to see you here again. Is there anything you are interested to look for? \n (Please type the following number)\n 1. Check New Food Recipes \n 2. Check Your Food Details with DIABOT Image Recognition (Included Calories, Carboyhydrates) \n 3. Check Some Diabetes Diatery Question';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    
}

module.exports.EchoBot = EchoBot;
