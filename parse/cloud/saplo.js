var saploKeys = require('cloud/saplo_parameters').saploKeys; // relative to root path of parse

// Supported parameters in request object:
// text:     The text to be tagged
// url:      The url for the text (uesd for cache:ing)
// headline: The text's headline
function extractTags(request, response){
  var requestJSON = JSON.parse(request.body);

  // console.log("ERMAN:::REQUEST" + JSON.stringify(request));

  var textToBeParsed = requestJSON.text;
  var textUrl = requestJSON.url;
  var textHeadline = requestJSON.title;
  // var textDate = requestJSON.date;
  var urlExists = false;

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

    if (!urlExists) {
      addUrl(textUrl, textId, textToBeParsed, textHeadline);
    }
    
    Parse.Cloud.httpRequest( 
    {
      url: saploUrlWithToken,
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(tagRequest),
      success: function(httpResponse) {
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
        var saploTags = JSON.parse(httpResponse.text).result;

        // Search for tags in the parse database, prepare our query
        var tagNames = [];
        for (var i = 0; i < saploTags.tags.length; i++) {
          tagNames = tagNames.concat(saploTags.tags[i].tag);
        }
        var resultTags = [];

        var Tag = Parse.Object.extend("Tag");
        var query = new Parse.Query("Tag");
        query.containedIn("name", tagNames);
        query.find().then(function (parseTags) {
          // Make copy of result set from query (we want to modify it later
          // and got error when modifying the parameter directly
          for (var i = 0; i < parseTags.length; i++) {
            resultTags = resultTags.concat(parseTags[i]);
          }

          // Check if we have found any new tags that don't have a post in
          // the parse database.
          var newTagPromises = [];
          for (var i = 0; i < saploTags.tags.length; i++) {
            var foundTag = false;
            for (var j = 0; j < parseTags.length; j++) {
              if (parseTags[j].get("name") == saploTags.tags[i].tag
                  && parseTags[j].get("type") == saploTags.tags[i].category) {
                foundTag = true;
                break;
              }
            }

            if (!foundTag) {
              // Create parse object
              var tag = new Tag();
              tag.set("name", saploTags.tags[i].tag);
              tag.set("type", saploTags.tags[i].category);

              // Add save operation to promise
              newTagPromises.push(tag.save());

              // Add tag to our resultset
              resultTags = resultTags.concat(tag);
            }
          }

          // Return promise that is triggered when all tags have been saved.
          return Parse.Promise.when(newTagPromises);
        }).then(function () {
          // TODO: Save the tags on the Url object

          // Return the result tag objects to the requester
          response.success(resultTags);
        }, function (error) {
          response.error("Finding demokratiappen tags failed");
        });
      },
      error: function(httpResponse){
        console.error('SaploUrlWithToken request failed with response code ' + httpResponse.status);
        response.error("Retrieving tags failed.");
      }
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

function addUrl(textUrl, textId, textToBeParsed, textHeadline){
  var Url = Parse.Object.extend("Url");
  var url = new Url();

  url.set("url", textUrl);
  url.set("textId", textId);
  url.set("text", textToBeParsed);
  url.set("headline", textHeadline);

  url.save();
} // addUrl

exports.extractTags = extractTags;
