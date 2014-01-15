
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello Democracy!");
});


/*

Can be tried with

curl -X POST \
-H "X-Parse-Application-Id: XXXXXXXXX” \
-H "X-Parse-REST-API-Key: XXXXXXXX” \
-H "Content-Type: application/json" \
-d '{text:"Huvudledare. Vänsterpartiet tror att vinster i välfärden blir en viktig valfråga. Det är tänkbart, men partiets linje brister i logik. Vänstervindarna tilltar. I en ny mätning från Demoskop är det rödgröna blocket mer än 16 procentenheter större än det borgerliga. Vänsterpartiet backar något, men partiledaren Jonas Sjöstedt valde att bortse från det när han invigningstalade på Vänsterpartiets ...  “}’ \
https://api.parse.com/1/functions/tagga


For questions ask Rasmus or Sven

*/




Parse.Cloud.define("tagga",
  function(request, response)
    {

      var textToBeParsed = request.text;
      //textToBeParsed = "Zlatan Ibrahimovic och hans Paris SG vände och vann bortamatchen på Korsika mot Ajaccio med 2–1.                Zlatan spelade fram till båda målen. Det blev annars en tuff början för PSG, då Eduardo Dos Santos slog in 1–0 till hemmalaget från nära håll redan efter några minuters spel. Men så spelade Ibrahimovic mycket vackert fram Ezequiel Lavezzi till hans tredje mål för säsongen innan den svenske landslagskaptenen såg till att Blaise Matuidi kunde nicka in segermålet en kvart från slutet. I och med segern är Paris Saint Germain nu fem poäng före Monaco i tabellen. Nyfiken på andra matcher ikväll? Följ resultaten på målservice.";
          
                   
    
    //Request object to ask for a auth token
    var accessTokenRequest = {"method":"auth.accessToken","params":{"api_key":"API_KEY","secret_key":"SECRET_KEY"}};
    // For some reason the global object isn't available here :(
    //var accessTokenRequest = {"method":"auth.accessToken","params":{"api_key":global.applications.Demokratiappen.saploApiKey,"secret_key":global.applications.Demokratiappen.saploSecretKey}};
    //Request object to create a new collection and ask for id for the same
    var collectionRequest = {"method":"collection.create", "params":{"name":"DemoAppArtiklar", "language":"sv"}, "id":0};
    //Reqest object to create a text and get back the ID
    var textIdRequest = { "method":"text.create",  "params":{ "body": textToBeParsed, "collection_id": 0000, "ext_text_id":"AX-44-D" }, "id":0 };
    //Object to use to post the text id and get back the tags
    var tagRequest = {"method":"text.tags", "params":{ "collection_id":00000, "text_id":000000, "wait":15 }, "id":0 }
                   
    
    var urlWithToken;
                   

    function textIdSuccess(httpResponse) {
      var resultObject = JSON.parse(httpResponse.text).result;
      var textId = resultObject.text_id;
                   
      tagRequest.params.text_id = textId;
                   
      Parse.Cloud.httpRequest(
        {
          url: urlWithToken,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tagRequest),
          success: function(httpResponse){
            var tagResultObject = JSON.parse(httpResponse.text).result;
            response.success(tagResultObject);
          },
          error: function(httpResponse){
            console.error('Request failed with response code ' + httpResponse.status);
          }
        }
      );
                   
    } //END textIdSuccess
                   
    function collectionSuccess(httpResponse) {
      var resultObject = JSON.parse(httpResponse.text).result;
      var collectionId = resultObject.collection_id;
                   
      textIdRequest.params.collection_id = collectionId;
      tagRequest.params.collection_id = collectionId;
                   
      Parse.Cloud.httpRequest(
        {
          url: urlWithToken,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(textIdRequest),
          success: textIdSuccess,
          error: function(httpResponse){
            console.error('Request failed with response code ' + httpResponse.status);
          }
        }
      );
    }//END collectionSuccess
                   
    function accessSuccess(httpResponse) {
      var resultObject = JSON.parse(httpResponse.text).result;
      var accessToken = resultObject.access_token;
                   
      urlWithToken = 'http://api.saplo.com/rpc/json?access_token=' + accessToken;
                   
      Parse.Cloud.httpRequest(
        {
          url: urlWithToken,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(collectionRequest),
          success: collectionSuccess,
          error: function(httpResponse){
            console.error('Request failed with response code ' + httpResponse.status);
          }
        }
      );
    } // END accessSuccess
                   
    Parse.Cloud.httpRequest(
      {
        url: 'http://api.saplo.com/rpc/json',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accessTokenRequest),
        success: accessSuccess,
        error: function(httpResponse){
          console.error('Request failed with response code ' + httpResponse.status);
        }
      }
    ); //END request
                   
                   
  }// END anonymous function
); // END tagga


/*
Example usage:
curl -X POST -H "X-Parse-Application-Id: APP_ID" -H "X-Parse-REST-API-Key: REST_KEY" -H "Content-Type: application/json" -d '{"url" : "http://www.sydsvenskan.se/opinion/huvudledare/luftiga-loften-om-dagis/"}'  https://api.parse.com/1/functions/texta
*/
Parse.Cloud.define("texta",
  function(request, response) {
    var textare = {
      work: function(requestUrl) {
        var text;
        var document;

        Parse.Cloud.httpRequest( 
        {
          url: requestUrl,
          method: 'POST',
          success: function(httpResponse){
            text = httpResponse.text;
            var mime_type = httpResponse.headers["Content-Type"];
            var line_count = text.split("\r\n").length;

            //document = (new global.DOMParser).parseFromString(text, mime_type);

            response.success(mime_type + " - [" + line_count + "] - " + text);
          },
          error: function(httpResponse){
            console.error('Request failed with response code ' + httpResponse.status);
          }
        }
      );
      } // END work
    };

    textare.work(request.params.url);

    } // END main lambda
); // END texta