var saploKeys = require('cloud/saplo_parameters').saploKeys; // relative to root path of parse

// Supported parameters in request object:
// text: The text to be tagged
// url:  The url for the text (uesd for cache:ing)
function extractTags(request, response){
  var textToBeParsed = JSON.parse(request.body).text;
  var textUrl = JSON.parse(request.body).url;
  var urlExists = false;
  var textHeadline = JSON.parse(request.body).headline;
  // var textDate = JSON.parse(request.body).date;


  if ( !textToBeParsed ){
    // Meddela att det saknas texten.
  }

  // Request object to ask for a auth token
  var accessTokenRequest = {
  	"method": "auth.accessToken",
  	"params": {
  		"api_key":    saploKeys.saploApiKey,
  		"secret_key": saploKeys.saploSecretKey
    }
  };
  
  // Add text to "our" collection 
  // should we also tag the text? We shouldn't add the same url more than once.
  // We should store the text's in "our" database with url, text, language, (collection-id), saplo-id
  // then we can do straight to call text.tags(id)
  // When we create a text we /can/ add the following properties:
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

  var urlWithToken = 'http://api.saplo.com/rpc/json?access_token=';

  // Inner functions 
  function textIdSuccess(httpResponse) {
    var requestObject = JSON.parse(httpResponse.text).result;

    // TODO: Ibland kommer vi hit och det är fel från Saplo
    //       Hur ska vi hantera det?
    //       Då blir requestObject.text_id "undefined"

    var textId = requestObject.text_id;     

    if( !textId ){
      response.success(httpResponse);  // Eller kan man sätta response.error()?
      return;
    }

    tagRequest.params.text_id = textId;
    
    if( !urlExists ){ // If the text_id isn't in our database then add it:
      addUrl(textUrl, textId);
    }

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
        tagResultObject.source = "textIdSuccess";
        response.success(tagResultObject);
      },
      error: function(httpResponse){
        console.error('Request failed with response code ' + httpResponse.status);
      }
    }
    );          
  } // textIdSuccess

  function accessSuccess(httpResponse) {
    var requestObject = JSON.parse(httpResponse.text).result;
    var accessToken = requestObject.access_token;
    urlWithToken = urlWithToken + accessToken;
    
    var newRequest = textIdCreate;

    if( textUrl ) {
      textIdCreate.url = textUrl;
    }
    if( textHeadline ) {
      textIdCreate.headline = textHeadline;
    }

    // Store the url + collection id + text id in a parse object. 
    //var query = new Parse.Query("Url");
    //query.equalTo("url", textUrl);
    //query.find().then(function(url) {     // Fast detta är en asynkron funktion 
    //  urlExists = true;
    //
    //  textIdCreate.text_id = url.text_id;
    //
    //  newRequest = textIdGet;
    //});
    
    Parse.Cloud.httpRequest( 
    {
      url: urlWithToken,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRequest),
      success: textIdSuccess,
      error: function(httpResponse){
        console.error('Request failed with response code ' + httpResponse.status);
      }
    }
    );    
  }  // accessSuccess

  // Main request, sends the others as "result functions" to the httpResult's success function.
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
  } // Main request
  );
};

function addUrl(textUrl, textId){
  var Url = Parse.Object.extend("Url");
  var url = new Url();

  url.set("url", textUrl);
  url.set("text_id", textId);

  url.save(null, function(url) {}, function(url, error) {});
}

exports.extractTags = extractTags;