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

/**
 * Setup default users and roles we need in the system
 *
 * You can trigger this code using:
 * curl -X POST \
 * -H "X-Parse-Application-Id: p7Nu6RZkIlnGUfofyOvms99yDnehPjzHg18OuFra" \
 * -H "X-Parse-REST-API-Key: W3seCkw5eOmPU3UhBM0zlzbSJ6W7fgAEGRtMpTzH" \
 * -H "Content-Type: application/json" \
 * -d '{}' \
 * https://api.parse.com/1/functions/createDefaultUsers
 */
function createDefaultUsers(request, response) {
  // First we create all default users
  var userPromises = [];

  /* var rootUser = new Parse.User();
  rootUser.set('username', 'rootUser');
  rootUser.set('password', 'root');
  userPromises[userPromises.length]
    = rootUser.signUp({ ACL: new Parse.ACL() }); */

  // Create a guest user
  var guestUser = new Parse.User();
  guestUser.set('username', 'Sandra');
  guestUser.set('password', 'guest');
  userPromises[userPromises.length]
    = guestUser.signUp({ ACL: new Parse.ACL() });

  var setupPromise = Parse.Promise.when(userPromises).then(function() {
    // Create roles in sequence since some roles need access are set to
    // administer other roles
    var rootRoleACL = new Parse.ACL();
    rootRoleACL.setPublicReadAccess(true);
    var rootRole = new Parse.Role('root', rootRoleACL);
    var rolePromises = rootRole.save().then(function() {
      // Create guest group
      var guestRoleACL = new Parse.ACL();
      guestRoleACL.setPublicReadAccess(true);
      guestRoleACL.setRoleWriteAccess(rootRole, true);
      var guestRole = new Parse.Role('guest', guestRoleACL);
      guestRole.getUsers().add(guestUser);
      return guestRole.save();
    });
    return rolePromises;
  });

  setupPromise.then(function () {
    response.success("createDefaultUsers: Completed successfully!");
  },
  function (error) {
    console.error('createDefaultUsers: Failed: ' + JSON.stringify(error));
    response.error(error);
  });
}

exports.createDefaultUsers = createDefaultUsers;
