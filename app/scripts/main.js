// fix Facebook hash
if (window.location.hash && window.location.hash === "#_=_") {
  if (window.history && history.replaceState) {
    window.history.replaceState("", document.title, window.location.pathname);
  } else {
    // Prevent scrolling by storing the page's current scroll offset
    var scroll = {
      top: document.body.scrollTop,
      left: document.body.scrollLeft
    };
    window.location.hash = "";
    // Restore the scroll offset, should be flicker free
    document.body.scrollTop = scroll.top;
    document.body.scrollLeft = scroll.left;
  }
}

function displayTemplate(selector, partial, context) {
  var template = Handlebars.compile(Handlebars.partials[partial]);
  $(selector).html(template(context));
}

// ajax goal update
$(document).on('keypress', '', function(e) {  // finish putting IDs in dashboard template and filling in two variables below
  var cGoalID =
  var goalUpdate = {};
  if (e.which == 13) {
    e.preventDefault();
    $.ajax('/', {
      data: goalUpdate,
      type: 'PUT'
    })
    .done(function(goalUpdateData){
      $('#'+cGoalID+'.process-bar').remove;
      displayTemplate('#'+cGoalID+'.progress', 'goalUpdate', goalUpdate);
    })
  }
}

// ajax to delete goal
$(document).on('click', '', function(e)
