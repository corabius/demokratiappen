exports.tagsPerDate = function(request, response) {
  // Return tags for user per date.
  // Format:
  // date, tagid, tagname
  response.error("not implemented");
}

/**
 * Format:
 * date, tagid, tagname, score
 */
exports.positiveTagsPerDate = function(request, response) {
  response.error("not implemented");
}


/**
 * Format:
 * date, tagid, tagname, score
 */
exports.negativeTagsPerDate = function(request, response) {
  response.error("not implemented");
}


/**
 * Format:
 * tagid, tagname, score
 */
exports.positiveTags = function(request, response) {
  response.error("not implemented");
}


/**
 * Format:
 * tagid, tagname, score
 */
exports.negativeTags = function(request, response) {
  var userTagQuery = new Parse.Query("UserTag");
  userTagQuery.equals("user", request.user);
  userTagQuery.sortBy("negativeCount");
  userTagQuery.find().then(function(userTags) {
    var result = [];
    for (var i = 0; i < userTags.length; i++) {
      var resultTag = {
        id: userTags[i].id,
        name: userTags[i].name,
        score: userTags[i].negativeCount
      };

      resultTag.sort(function(a, b) { return b.score - a.score; });
      result[result.length] = resultTag;
    }
    response.success(result);
  }, function (error) {
    response.error("Request failed");
  });
}


/**
 * Format:
 * tagid, tagname, score
 */
exports.accumulatedTags = function(request, response) {
  var userTagQuery = new Parse.Query("UserTag");
  userTagQuery.equals("user", request.user);
  userTagQuery.find().then(function(userTags) {
    var result = [];
    for (var i = 0; i < userTags.length; i++) {
      var resultTag = {
        id: userTags[i].id,
        name: userTags[i].name,
        score: userTags[i].negativeCount + userTags[i].positiveCount
      };

      resultTag.sort(function(a, b) { return b.score - a.score; });
      result[result.length] = resultTag;
    }
    response.success(result);
  }, function (error) {
    response.error("Request failed");
  });
}
