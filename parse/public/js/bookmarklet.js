javascript:function dar1() {
  var d = document, z, b = d.body, l = d.location;

  try {
    if (!b) throw(0);
    d.title='(Saving...) ' + d.title;

    z = d.createElement('script');
    z.setAttribute('src', l.protocol + '//demokratiappen.se/scripts/Scrape.js');
    b.appendChild(z);
  }
  catch(e) {
    alert('Please wait until the page has loaded.');
  }
} dar1(); void(0)
