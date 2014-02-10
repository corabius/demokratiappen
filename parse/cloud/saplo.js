var saploKeys = require('cloud/saplo_parameters').saploKeys; // relative to root path of parse

// Supported parameters in request object:
// text:     The text to be tagged
// url:      The url for the text (uesd for cache:ing)
// headline: The text's headline
function extractTags(request, response){
  var textToBeParsed = JSON.parse(request.body).text;
  var textUrl = JSON.parse(request.body).url;
  var textHeadline = JSON.parse(request.body).headline;
  // var textDate = JSON.parse(request.body).date;
  var urlExists = false;

  if ( !textToBeParsed ){
    // Meddela att texten saknas.
  }

  // Request object to ask for a authorization token
  var accessTokenRequest = {
  	"method": "auth.accessToken",
  	"params": {
  		"api_key":    saploKeys.saploApiKey,
  		"secret_key": saploKeys.saploSecretKey
    }
  };
  
  // Add text to "our" collection 
  // We store the text's in "our" database with url, text, language, (collection-id), saplo-id
  // then we can do straight to call text.tags(id)
  // When we create a text in Saplo we /can/ add the following properties:
  //  headline (used), url (used), publish_date, authors and ext_text_id
  var textIdCreate = { 
  	"method": "text.create",  
  	"params": { 
      "body":          textToBeParsed, 
  		"collection_id": saploKeys.DemokratiArtiklar//, 
  		//"url":         "url" (Set in accessSuccess if it exists)
  	}, 
  	"id": 0 
  };
  
  // Get the text from "our" collection
  var textIdGet = { 
    "method": "text.get",  
    "params": { 
      "text_id":       0, 
      "collection_id": saploKeys.DemokratiArtiklar//, 
      //"url":         "url" (Set in accessSuccess if it exists)
    }, 
    "id": 0 
  };

  // Object to use to post the text id and get back the tags
  var tagRequest = {
  	"method": "text.tags", 
  	"params": { 
  		"collection_id": saploKeys.DemokratiArtiklar, 
  		"text_id":       0, 
  		"wait":          15 
  	}, 
  	"id": 0 
  };

  var saploUrlWithToken = 'http://api.saplo.com/rpc/json?access_token=';

  // Inner functions 
  // Get the Saplo tags from the text object requestObject.text_id
  function textIdSuccess(httpResponse) {
    var requestObject = JSON.parse(httpResponse.text).result;

    // TODO: Ibland kommer vi hit och det är fel från Saplo
    if( !requestObject ){
      httpResponse.source = "textIdSuccess: (no requestObject)";
      response.success(httpResponse);  // Eller kan man sätta response.error()?
      return;
    }

    var textId = requestObject.text_id;
    if( !textId ){
      httpResponse.source = "textIdSuccess: (no textId)";
      response.success(httpResponse);  // Eller kan man sätta response.error()?
      return;
    }

    tagRequest.params.text_id = textId;

    if( !urlExists ){
      addUrl(textUrl, textId, textToBeParsed, textHeadline);
    }
    
    Parse.Cloud.httpRequest( 
    {
      url: saploUrlWithToken,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagRequest),
      success: function(httpResponse){
        var tagResultObject = JSON.parse(httpResponse.text).result;
        tagResultObject.source = "textIdSuccess";
        tagResultObject.found = urlExists;  // Debug: Show if we added or found the url
        response.success(tagResultObject);
      },
      error: function(httpResponse){
        console.error('Request failed with response code ' + httpResponse.status);
      }
    }
    );          
  } // textIdSuccess

  // We have access to Saplo, try to find the text in our database
  // if we have it, get the ID to get the tags from Saplo
  // if not, add it to Saplo, get the ID and add the url to our database
  function accessSuccess(httpResponse) {
    var requestObject = JSON.parse(httpResponse.text).result;
    var accessToken = requestObject.access_token;

    saploUrlWithToken = saploUrlWithToken + accessToken;
    
    if( textUrl ) {
      textIdCreate.url = textUrl;
    }
    if( textHeadline ) {
      textIdCreate.headline = textHeadline;
    }

    // Start a thread to find the url in our database, and get the tags
    var query = new Parse.Query("Url");
    query.equalTo("url", textUrl);
    query.find().then( function( url ) {
      var textId = url.text_id;
      if( !textId ){
        // If we _don't_ have the url, add it:
        Parse.Cloud.httpRequest( {
          url: saploUrlWithToken,
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(textIdCreate),
          success: textIdSuccess,
          error: function(httpResponse){ console.error('Request failed with response code ' + httpResponse.status); }
        }); 

      } else {
        textIdGet.text_id = textId;
        urlExists = true;

        // Get the tags from Saplo or from Parse?
        // Now from Saplo (=> we must have the Saplo accessToken)
        // If we change this, we _could_ move the saplo login from the main request.
        Parse.Cloud.httpRequest( {
          url: saploUrlWithToken,
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(textIdGet),
          success: textIdSuccess,
          error: function(httpResponse){ console.error('Request failed with response code ' + httpResponse.status); }
        });    
      }
    
    }); 
  }  // accessSuccess

  // Main request, sends the others as "result functions" to the httpResult's success function.
  Parse.Cloud.httpRequest({
    // First connect to Saplo (we need an access token to get the tags)
    url: 'http://api.saplo.com/rpc/json',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accessTokenRequest),
    success: accessSuccess,
    error: function(httpResponse){
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });  // Main request

}; // extractTags

function addUrl(textUrl, textId, textToBeParsed, textHeadline){
  var Url = Parse.Object.extend("Url");
  var url = new Url();

  url.set("url", textUrl);
  url.set("text_id", textId);
  url.set("text", textToBeParsed);
  url.set("headline", textHeadline);

  url.save(null, function(url) {}, function(url, error) {});
}; // addUrl

exports.extractTags = extractTags;
