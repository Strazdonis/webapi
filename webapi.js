const rp = require('request-promise');
const $ = require('cheerio');
let cntr = 0;

/**
 * 
 * @param {dom query} query html DOM query (cheerio) 
 * @param {string} url website url
 */
function scrape(query, url) {
    return new Promise((resolve, reject) => {
        rp(url, {
            transform: function (html) {
                console.log('transformed:');
                 //success!
                var data = $(query, html);
                console.log(data);
                if(data.length != 0 || cntr > 2) {

                    console.log('omg data not empty');
                    delete data['prevObject'];
                    delete data['options'];
                    console.log(data);
                    if(data.length == 0) {
                        console.log('empty');
                    }
                    console.log(Object.entries(data));
                    Object.keys(data).forEach(function(key,i) {
                        if(!isNaN(key)) {
                
                            delete data[i].parent;
                            delete data[i]['x-attribsNamespace'];
                            delete data[i]['x-attribsPrefix'];
                            data[i].children.forEach(child => {
                                delete child.parent;
                                delete child.prev;
                                delete child.next;
                            });
                            delete data[i].prev;
                            delete data[i].next;
                        }
                    });
                    resolve(data);
                } else {
                    console.log("uwu data was empty");
                    cntr++;
                }
            }
        })
        .then(function(html){
           console.log(html);
        })
        .catch(function(err){
            reject(`broke at web-scraping: ${err}`);
        });
    });

}




exports.handler = async function(event, context) {
    try {
        var body = JSON.parse(event.body);
        console.log(`fething url: ${body.url}\nquery: ${body.query}`);
        console.log(event.httpMethod);
        if(event.httpMethod != "POST") {
            return {
                statusCode: 422,
                body: (JSON.stringify({message: `only POST method is allowed, got ${event.httpMethod} instead.`})),
            };
        }
        return scrape(body.query, body.url)
        .then(response => ({
            statusCode: 200,
            // body: String(response),
            body: JSON.stringify(response.length != 0 ? response : {message: "empty html was returned", response}),
        }))
        .catch(error => ({ statusCode: 422, body: String(error) }));
    } catch(err) {
        //err
        return {
            statusCode: 422,
            body: JSON.stringify({message: err == "SyntaxError: Unexpected token W in JSON at position 0" ? `expected POST, got ${event.httpMethod} request` : `${err}`}),
        };
    }

};

