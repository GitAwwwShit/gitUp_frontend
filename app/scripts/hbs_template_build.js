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
  var template = Handlebars.compile(Handlebars.partials[partial]);
  $(selector).html(template(context));
}


Promise.all([
  // first ajax request
  $.ajax({
    url: appVars.host + '/api',
    method: 'get'
  }),
  // partial
  promisifyPartial({ name: 'dashboard', file: '/templates/dashboard.hbs' }),
  promisifyPartial({ name: 'goalUpdate', file: '/templates/goalUpdate.hbs' }),
  promisifyPartial({ name: 'newChild', file: '/templates/newChild.hbs' }),
  promisifyPartial({ name: 'goalSummary', file: '/templates/goalSummaryInsert.hbs' })
  // Document Ready?
  // promiseToLoad()
]).then(function(api) {
  var data = {};
  data.shit = {
    titles: {
      one: 'Little Shit',
      two: 'SOB',
      three: 'Mistake 1',
      four: 'Love Child'
    },
    colors: {
      red: 'bg-red',
      lblue: 'bg-lblue',
      green: 'bg-green',
      yellow: 'bg-yellow',
      purple: 'bg-purple'
    }
  };
  data.api = api[0];
  console.log(data);
  displayTemplate("#dashboard", 'dashboard', data);
});


// titles: ['Little Shit', 'SOB', 'Mistake 1', 'Love Child'],

// Handlebars.registerHelper('compare', function(val1, val2, options) {
//   if (val1 == val2) return options.fn(this);
//   else return options.inverse(this);
// });
