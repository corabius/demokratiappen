// relative to root path of parse (but only code in cloud can be used)
var saplo = require('cloud/saplo');
// var tag = require('cloud/tag');

// Parse.Cloud.define("getTags", tag.getTags);

Parse.Cloud.define('tagga', saplo.extractTags);
// Parse.Cloud.define('listCollections', saplo.listCollections);



// -----------------------------------------------------------------------
/*

Can be tried with

curl -X POST \
-H "X-Parse-Application-Id: XXXXXXXXX” \
-H "X-Parse-REST-API-Key: XXXXXXXX” \
-H "Content-Type: application/json" \
-d '{text:"Huvudledare. Vänsterpartiet tror att vinster i välfärden blir en viktig valfråga. Det är tänkbart, men partiets linje brister i logik. Vänstervindarna tilltar. I en ny mätning från Demoskop är det rödgröna blocket mer än 16 procentenheter större än det borgerliga. Vänsterpartiet backar något, men partiledaren Jonas Sjöstedt valde att bortse från det när han invigningstalade på Vänsterpartiets ...  “, url: "http://..."}’ \
https://api.parse.com/1/functions/tagga

Supported parameters:
{
  text: "The text to be tagged"
  url:  "The url for the text (uesd for cache:ing)"
}

For questions ask Rasmus or Sven

*/


// -----------------------------------------------------------------------
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

            // https://nodejsmodules.org/pkg/xmldom
            // https://npmjs.org/package/xmldom
            //var DOMParser = require('xmldom').DOMParser;
            //var doc = new DOMParser();
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
