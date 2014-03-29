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

// Require paths are relative to root path of parse (but only code in cloud
// can be used).

var saplo = require('cloud/saplo');
Parse.Cloud.define('tagga', saplo.extractTags);
// Parse.Cloud.define('listCollections', saplo.listCollections);

// var setup = require('cloud/setup');
// Parse.Cloud.define('createDefaultUsers', setup.createDefaultUsers);

// var tag = require('cloud/tag');
// Parse.Cloud.define("getTags", tag.getTags);

