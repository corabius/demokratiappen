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
