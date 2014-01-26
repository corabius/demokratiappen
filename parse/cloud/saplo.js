var saploKeys = require('cloud/saplo_parameters').saploKeys; // relative to root path of parse

function extractTags(request, response){
  var textToBeParsed = request.text;

  // Request object to ask for a auth token
  var accessTokenRequest = {
  	"method": "auth.accessToken",
  	"params": {
  		"api_key":    saploKeys.saploApiKey,
  		"secret_key": saploKeys.saploSecretKey
  	  }
  };

  // Request object to create a new collection and ask for id for the same
  // Start again; we must onöly create the collection once (for each language), and then find it here
  // I.e. a datastore with language + collectionId
  var collectionRequest = {
  	"method": "collection.create", 
  	"params": {
  		"name":     "DemokratiArtiklar", 
  		"language": "sv"
  	}, 
  	"id": 0
  };
  
  // Reqest object to create a text and get back the ID
  // should we also tag the text? We shouldn't add the same url more tha once.
  // We should store the taxt's in "our" database with url, text, language, (collection-id), saplo-id
  // then we can do straight to call text.tags(id)
  var textIdRequest = { 
  	"method": "text.create",  
  	"params": { 
  		"body": textToBeParsed, 
  		"collection_id": 0, 
  		"ext_text_id":   "AX-44-D" 
  	}, 
  	"id": 0 
  };
  
  // Object to use to post the text id and get back the tags
  var tagRequest = {
  	"method": "text.tags", 
  	"params": { 
  		"collection_id": 0, 
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
        response.success(tagResultObject);
      },
      error: function(httpResponse){
        console.error('Request failed with response code ' + httpResponse.status);
      }
    }
    );
                   
  } // textIdSuccess

  function collectionSuccess(httpResponse) {
    var textObject = JSON.parse(httpResponse.text);
    var resultObject = textObject.result;

response.success(textObject);
    /*
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
*/
   } // collectionSuccess

  function accessSuccess(httpResponse) {
    var resultObject = JSON.parse(httpResponse.text).result;
    var accessToken = resultObject.access_token;
    urlWithToken = urlWithToken + accessToken;

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