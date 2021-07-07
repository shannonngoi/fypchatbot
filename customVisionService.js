'use strict';

const request = require('request-promise').defaults({ encoding: null });

module.exports = {
    predict: predict,
    predict2: predict2,
    predict3: predict3
}

function predict(stream) {
    const options = {
        method: 'POST',
        uri:stream.contentUrl,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Prediction-Key': '0fe4b153770a431d8dfb77ec1a481ec7'
        },
        body: stream
    };
    return request(options);
}

function predict2(stream,uri) {
    const options = {
        method: 'POST',
        uri:uri+".jpg",
        headers: {
            'Content-Type': 'application/octet-stream',
            'Prediction-Key': '0fe4b153770a431d8dfb77ec1a481ec7'
        },
        body: stream,uri
        //body: {"Url":uri}
    };console.log("anything2 "+uri+" aaaaa");
    console.log(options);
    console.log("anything");
    return request(options);
}


function predict3(stream,uri) {
    const options = {
        method: 'POST',
        uri:"https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/0df60e07-c3ec-4535-a2ab-684623f12526/classify/iterations/Iteration1/url",
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '0fe4b153770a431d8dfb77ec1a481ec7'
        },
        //body: stream,uri
        body: {"Url":"https://i0.wp.com/eatwhattonight.com/wp-content/uploads/2018/09/DSC_0514.jpg"}
    };//console.log("anything2 "+uri+" aaaaa");
    //console.log(options);
    console.log("anything");
    var x = request(options);
    console.log(x);
    return x;
    
}