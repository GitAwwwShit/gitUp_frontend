var appVars = {
  host: "http://127.0.0.1:3000"
}

function promisifyPartial(partial) {
  return new Promise(function(success, failure) {
    $.get(partial.file).done(function(tempOutput) {
      Handlebars.registerPartial(partial.name, tempOutput);
      success(true);
    }).fail(function(err) {
      failure(err);
    });
  });
}

function promiseToLoad() {
  return new Promise(function(success) {
    $(document).ready(function() {
      success();
    });
  });
}

function displayTemplate(selector, partial, context) {
  console.log(context);
  var template = Handlebars.compile(Handlebars.partials[partial]);
  $(selector).html(template(context));
}

var apiCall;

Promise.all([
  // first ajax request
  $.ajax({
    url: appVars.host + '/api',
    method: 'get'
  }),
  // partial
  promisifyPartial({ name: 'test', file: '/templates/test.hbs' }),
  // Document Ready?
  // promiseToLoad()
]).then(function(data) {
  apiCall = data[0];
  console.log(apiCall);
  displayTemplate("#test", 'test', apiCall);
});




// Handlebars.registerHelper('compare', function(val1, val2, options) {
//   if (val1 == val2) return options.fn(this);
//   else return options.inverse(this);
// });
