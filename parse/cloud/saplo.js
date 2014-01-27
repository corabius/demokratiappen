var saploKeys = require('cloud/saplo_parameters').saploKeys; // relative to root path of parse

// Supported parameters in request object:
// text: The text to be tagged
// url:  The url for the text (uesd for cache:ing)
function extractTags(request, response){
  var textToBeParsed = JSON.parse(request.body).text;
  var textUrl = JSON.parse(request.body).url;

  if ( !textToBeParsed ){
    // Meddela att det texten saknas
  }

  // Request object to ask for a auth token
  var accessTokenRequest = {
  	"method": "auth.accessToken",
  	"params": {
  		"api_key":    saploKeys.saploApiKey,
  		"secret_key": saploKeys.saploSecretKey
  	  }
  };
  
  // Ad text to "our" collection 
  // should we also tag the text? We shouldn't add the same url more than once.
  // We should store the text's in "our" database with url, text, language, (collection-id), saplo-id
  // then we can do straight to call text.tags(id)
  var textIdRequest = { 
  	"method": "text.create",  
  	"params": { 
  		"body":          textToBeParsed, 
  		"collection_id": saploKeys.DemokratiArtiklar//, 
  		//"ext_text_id":   "url" (Set in accessSuccess if it exists)
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
    var resultObject = JSON.parse(httpResponse.text).result;
    var accessToken = resultObject.access_token;
    urlWithToken = urlWithToken + accessToken;
    
    // TODO: Start by trying to find the ext_text_id (textUrl) in the collection.
    //       If we don't find it add it as a new text.
    //       In both cases return the text_id of the text.
    //       (now we always add the text)

    if( textUrl ) {
      textIdRequest.ext_text_id = textUrl;
    }

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

exports.extractTags = extractTags;