var appVars = {
  host: "https://git-up.herokuapp.com"
}
var activities = {}
Handlebars.registerHelper("activities_name", function(id) {
  console.log("activities_name", id)
  return id ? activities[id].activity_name : "Goal";
});

Handlebars.registerHelper("activities_img", function(id) {
  return id ? activities[id].activity_image: '/img/activities/volleyball.png';
});


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
      one: 'Our favorite',
      two: 'Actually our favorite',
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

  $.ajax({
    url: appVars.host + '/api/activities',
    method: 'get'
  }).done(function(result){
      activities = {}
      for (var i = 0; i < result.length; i++) {
        activities[result[i].id]= result[i];
      }
      //data.activityObj = activities;
    displayTemplate("#dashboard", 'dashboard', data);
    var activitySelect = $('.activitySelect')
    for (var i = 0; i < result.length; i++) {
      activitySelect.append("<option value='"+result[i].id+"'>"+result[i].activity_name+"</option>")
    }
  })
});


// Handlebars.registerHelper('compare', function(val1, val2, options) {
//   if (val1 == val2) return options.fn(this);
//   else return options.inverse(this);
// });
