What to do to get started
=========================
1. Create an account at parse.com
2. Download parse.com deploy script (https://parse.com/apps/quickstart#cloud_code)
3. Upload initial data into parse, e.g. data/tag-parties.json into a class called ``Tag`` via ``DataBrowser - Import``.
4. Copy ``config/global.json.template`` to ``config/global.json`` and set the API keys
   for your Parse app.
5. Make a copy of ``public/js/initialize_parse.js.template`` to ``public/js/initialize_parse.js``
   and change its content accordingly.
6. Depoly html to parse cloud (cd parse; parse deploy)
7. Goto the web page
8. Create an initial user
9. Tag an page _with both positive and negative tag_. (This is needed to get the types in the database-classes correct).

