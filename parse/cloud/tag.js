function getTags(request, response) {
  // request.params.url
  // request.params.body
  // request.params.title

  // TODO: Check if we already have this article in our database

  // These are the tags we expect to get back from saplo
  stringTags = [ "Feministiskt initiativ", "Piratpartiet", "Socialdemokraterna", "Miljöpartiet", "Moderaterna", "Kristdemokraterna", "Folkpartiet", "Centerpartiet", "Vänsterpartiet", "Sverigedemokraterna" ];

  // Get the id's for our tags
  var tagQuery = new Parse.Query("Tag");
  tagQuery.containedIn("name", stringTags);
  tagQuery.find({
    success: function(tags) {
      response.success(tags);
    },
    error: function() {
      response.error("Tag lookup failed.");
    }
  });
}

exports.getTags = getTags
