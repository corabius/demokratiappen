/* Copyright (C) 2014 Demokratiappen.
 *
 * This file is part of Demokratiappen.
 *
 * Demokratiappen is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Demokratiappen is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Demokratiappen.  If not, see <http://www.gnu.org/licenses/>.
 */

// Require paths are relative to root path of parse (but only code in cloud
// can be used).

var saplo = require('cloud/saplo');
Parse.Cloud.define('tagga', saplo.extractTags);
// Parse.Cloud.define('listCollections', saplo.listCollections);

// var setup = require('cloud/setup');
// Parse.Cloud.define('createDefaultUsers', setup.createDefaultUsers);

// var tag = require('cloud/tag');
// Parse.Cloud.define("getTags", tag.getTags);



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
/*Parse.Cloud.define("texta",
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
); // END texta*/

