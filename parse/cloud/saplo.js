var saploKeys = require('cloud/saplo_parameters').saploKeys; // relative to root path of parse

/**
 * Connect to Saplo.
 *
 * @return Promise when we are connected
 */
function connectToSaplo() {
  var saploUrlWithToken = 'http://api.saplo.com/rpc/json?access_token=';

  // Request object to ask for a authorization token
  var accessTokenRequest = {
    "method": "auth.accessToken",
    "params": {
      "api_key":    saploKeys.saploApiKey,
      "secret_key": saploKeys.saploSecretKey
    }
  };

  return Parse.Cloud.httpRequest({
    // First connect to Saplo (we need an access token to get the tags)
    url: 'http://api.saplo.com/rpc/json',
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(accessTokenRequest),
  }).then(function (httpResponse) {
    if (httpResponse.status != 200) {
      return Parse.Promise.error('saploConnectFailure: Saplo returned status: ' + httpResponse.status);
    }

    var requestObject = JSON.parse(httpResponse.text).result;
    var accessToken = requestObject.access_token;

    return Parse.Promise.as(saploUrlWithToken + accessToken);
  });
}


// Supported parameters in request object:
// text:     The text to be tagged
// url:      The url for the text (uesd for cache:ing)
// headline: The text's headline
function extractTags(request, response) {
  var requestJSON = JSON.parse(request.body);

  var textToBeParsed = requestJSON.text;
  var textUrl = requestJSON.url;
  var textHeadline = requestJSON.title;
  // var textDate = requestJSON.date;
  var urlExists = false;
  var url; // The Url object in Parse database

  if (!textToBeParsed) {
    response.error("Missing required field: text");
    return;
  }
  if (!textUrl) {
    response.error("Missing required field: url");
    return;
  }
  if (!textHeadline) {
    response.error("Missing required field: title");
    return;
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
      "body": textToBeParsed, 
      "collection_id": saploKeys.DemokratiArtiklar, 
      //"url": "url" (Set in accessSuccess if it exists)
    }, 
    "id": 0 
  };
  
  // Get the text from "our" collection
  var textIdGet = { 
    "method": "text.get",  
    "params": {
      "text_id":       0, 
      "collection_id": saploKeys.DemokratiArtiklar, 
      //"url":         "url" (Set in accessSuccess if it exists)
    }, 
    "id": 0 
  };

  // Object to use to post the text id and get back the tags
  var tagRequest = {
    "method": "text.tags", 
    "params": { 
      "collection_id": saploKeys.DemokratiArtiklar, 
      "text_id": 0, 
      "wait": 15 
    }, 
    "id": 0 
  };

  var saploUrlWithToken = 'http://api.saplo.com/rpc/json?access_token=';

  // Inner functions 
  // Get the Saplo tags from the text object requestObject.text_id
  function textIdSuccess(httpResponse) {
    if (httpResponse.status != 200) {
      console.log("Saplo returned status: " + httpResponse.status);
      response.error("TextId REST request failed");
      return;
    }

    var parsedResult = JSON.parse(httpResponse.text).result;
    if (!parsedResult){
      // httpResponse.source = "textIdSuccess: (no requestObject)";
      console.error("Saplo did not return a result " + httpResponse.text);
      response.error("Saplo did not return a result.");
      return;
    }

    var textId = parsedResult.text_id;
    if (!textId) {
      // httpResponse.source = "textIdSuccess: (no textId)";
      console.error('Saplo did not return a text_id ' + httpResponse.text);
      response.error("Saplo did not return a text_id.");
      return;
    }

    tagRequest.params.text_id = textId;

    // This is where we collect our parse tags. The indices matches the
    // items in the saploTags.tags array
    var resultTags = [];
    var relevanceTags = [];
    var saploTags = [];
 
    Parse.Cloud.httpRequest({
      url: saploUrlWithToken,
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(tagRequest)
    }).then(function (httpResponse) {
        if (httpResponse.status != 200) {
          console.log("tagRequest: saplo returned status: " + httpResponse.status);
          response.error("tagRequest REST request failed");
          return;
        }

        // Now we have an array with tags
        // [
        //   { "category": "person/location/organisation",
        //     "tag": "Bertil Adam",
        //     "relevance": 0.7,
        //   },
        // ]
        saploTags = JSON.parse(httpResponse.text).result;

        // Search for tags in the parse database, prepare our query
        var tagNames = [];
        for (var i = 0; i < saploTags.tags.length; i++) {
          tagNames = tagNames.concat(saploTags.tags[i].tag);
        }

        var Tag = Parse.Object.extend("Tag");
        var query = new Parse.Query("Tag");
        query.containedIn("name", tagNames);
        return query.find();
    }).then(function (parseTags) {
          // Check if we have found any new tags that don't have a post in
          // the parse database.
          var newTagPromises = [];
          for (var i = 0; i < saploTags.tags.length; i++) {
            var foundTag = false;
            for (var j = 0; j < parseTags.length; j++) {
              if (parseTags[j].get("name") == saploTags.tags[i].tag
                  && parseTags[j].get("type") == saploTags.tags[i].category) {
                foundTag = true;

                resultTags[resultTags.length] = parseTags[j];
                break;
              }
            }

            if (!foundTag) {
              // Create parse object
              var Tag = Parse.Object.extend("Tag");
              var tag = new Tag();
              tag.set("name", saploTags.tags[i].tag);
              tag.set("type", saploTags.tags[i].category);

              // Add save operation to promise
              newTagPromises.push(tag.save());
              resultTags[resultTags.length] = tag;
            }
          }

          // Return promise that is triggered when all tags have been saved.
          return Parse.Promise.when(newTagPromises);
    }).then(function () {
          // Associate relevance with the tags (now we have id on all our
          // objects).
          // Note resultTags and saploTags match so same index can be used in
          // both arrays.
         var urlRelevanceTags = [];
         for (var i = 0; i < resultTags.length; i++) {
            var relevanceTag = {
              id: resultTags[i].id,
              name: resultTags[i].get("name"),
              relevance: saploTags.tags[i].relevance
            };
            relevanceTags[relevanceTags.length] = relevanceTag;

            urlRelevanceTags[urlRelevanceTags.length] = {
              tag: resultTags[i],
              relevance: saploTags.tags[i].relevance
            };
          }
 
          // Save the tags on the Url object
          var promise;
          if (!urlExists) {
            var Url = Parse.Object.extend("Url");
            var url = new Url();

            url.set("url", textUrl);
            url.set("textId", textId);
            url.set("text", textToBeParsed);
            url.set("headline", textHeadline);
            url.set("relevanceTags", urlRelevanceTags);

            promise = url.save();
          }
          else {
            // Create a promise that immedideately succeeds, just to ensure the
            // code flow works as above.
            promise = new Parse.Promise.as();
          }
          return promise;
    }).then(function () {
      // Return the result tag objects to the requester
      response.success(relevanceTags);
    }, function (error) {
      response.error("Finding demokratiappen tags failed");
    });
  } // textIdSuccess

  // We have access to Saplo, try to find the text in our database
  // if we have it, get the ID to get the tags from Saplo
  // if not, add it to Saplo, get the ID and add the url to our database
  function accessSuccess(httpResponse) {
    if (httpResponse.status != 200) {
      console.log("accessSuccess: Saplo returned status: " + httpResponse.status);
      response.error("Access request failed");
      return;
    }

    var requestObject = JSON.parse(httpResponse.text).result;
    var accessToken = requestObject.access_token;

    saploUrlWithToken = saploUrlWithToken + accessToken;
    
    if (textUrl) {
      // with or without params?
      textIdCreate.params.url = textUrl;
    }
    if (textHeadline) {
      textIdCreate.params.headline = textHeadline;
    }

    // Start a thread to find the url in our database, and get the tags
    var query = new Parse.Query("Url");
    query.equalTo("url", textUrl);
    query.find().then(function(urls) {
      if (urls.length == 0) {
        // If we _don't_ have the url, add it:
        Parse.Cloud.httpRequest({
          url: saploUrlWithToken,
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(textIdCreate),
          success: textIdSuccess,
          error: function(httpResponse) { 
            console.error('SaploUrlWithToken request failed with response code ' + httpResponse.status);
            response.error("Failed to get url with token.");
          }
        });
      }
      else {
        var url = urls[0];
        var textId = url.get("textId");
        if (!textId) {
          response.error("No textId in returned parse object");
          return;
        }

        textIdGet.params.text_id = textId;
        urlExists = true;

        console.log("Get tags from saplo:");
        console.log(textIdGet);
        console.log(JSON.stringify(textIdGet));

        // Get the tags from Saplo or from Parse?
        // Now from Saplo (=> we must have the Saplo accessToken)
        // If we change this, we _could_ move the saplo login from the main request.
        Parse.Cloud.httpRequest({
          url: saploUrlWithToken,
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(textIdGet),
          success: textIdSuccess,
          error: function(httpResponse) {
            console.error('SaploUrlWithToken failed with response code ' + httpResponse.status);
            response.error("Failed to get url with token");
          }
        });
      }
    }, function (error) {
      response.error("Finding parse URL object failed.");
    }); 
  }  // accessSuccess

  // Main request, sends the others as "result functions" to the httpResult's success function.
  Parse.Cloud.httpRequest({
    // First connect to Saplo (we need an access token to get the tags)
    url: 'http://api.saplo.com/rpc/json',
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(accessTokenRequest),
    success: accessSuccess,
    error: function(httpResponse){
      console.error('SaploTokenRequest failed with response code ' + httpResponse.status);
      response.error("TokenRequest failed.");
    }
  });  // Main request
} // extractTags
exports.extractTags = extractTags;


function listCollections(request, response) {
  var collectionList = {
    'method': 'collection.list',
    'params': {},
    'id': 0
  };

  connectToSaplo().then(function(saploUrlWithToken) {
    return Parse.Cloud.httpRequest({
      url: saploUrlWithToken,
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(collectionList)
    });
  }).then(function(httpResponse) {
    if (httpResponse.status != 200) {
      response.error("saplo: collection.list failed.");
      return;
    }

    console.log(httpResponse.data);
    // var responseData = JSON.parse(httpResponse);
    response.success(httpResponse.data);
  },
  function(error) {
    console.log('saplo.listCollections failed: ' + error);
    response.error('listCollections failed.');
  });
}
exports.listCollections = listCollections;

