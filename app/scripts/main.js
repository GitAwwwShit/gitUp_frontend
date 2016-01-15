var appVars = {
  host: "http://127.0.0.1:3000"
}

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

function insertTemplate(selector, partial, context) {
  var template = Handlebars.compile(Handlebars.partials[partial]);
  $(selector).append(template(context));
}

// ajax goal update
$(document).on('keypress', '.update-goal', function(e) {  // finish putting IDs in dashboard template and filling in two variables below
  console.log(this);
  var cGoalID = $(this).attr("data-cGoalIDupdate");
  var removePB = $('div[data-progressUpdate='+cGoalID+']');
  var removePB2 = $('div[data-progressUpdate2='+cGoalID+']');
  var insertPB = $('div[data-progressInsert='+cGoalID+']');
  var insertPB2 = $('div[data-progressInsert2='+cGoalID+']');
  var currentAmount = parseFloat(removePB.attr("aria-valuenow"));
  var goalAmount = removePB.attr("aria-valuemax");
  var currentPercent = removePB.attr('style');
  if (e.which == 13) {
    e.preventDefault();
    var addAmount = parseFloat($(this).val());
    var newAmount = (currentAmount + addAmount);
    var newPercent = (newAmount / goalAmount)*100;
    var goalUpdate = {
      cGoalID: cGoalID,
      currentAmount: currentAmount,
      goalAmount: goalAmount,
      newAmount: newAmount,
      newPercent: Math.trunc(newPercent)
    };
    $.ajax(appVars.host + '/api', {             // what's our api route for update goal?
      data: goalUpdate,
      type: 'POST'
    })
    .done(function(goalUpdateData){

    })
    // console.log('this: '+this);
    console.log(removePB);
    console.log(insertPB[0]);
    console.log('currentAmount: '+currentAmount);
    console.log('addAmount: '+addAmount);
    console.log(goalUpdate);
    console.log('currentPercent: '+currentPercent);
    removePB.remove();
    displayTemplate(insertPB[0], 'goalUpdate', goalUpdate);
    displayTemplate(insertPB2[0], 'goalUpdate', goalUpdate);
  }
})

// ajax to delete goal
$(document).on('click', '.remove-goal', function(e) {
  var cGoalID = $(this).attr("data-cGoalIDremove");
  var goalRemove = {cGoalID: cGoalID};
  e.preventDefault();
  $.ajax(appVars.host + '/api', {         // what's ourt api route for delete goal?
    data: goalRemove,
    type: 'DELTE'
  })
  .done(function(goalRemoveData){

  })
  $('div[data-RemoveGoal='+cGoalID+']').remove();
  $('div[data-RemoveGoalSummary='+cGoalID+']').remove();
})

// ajax to insert child
$(document).on('click', '#addChild', function(e) {
  var childAdd = {};
  childAdd.first_name = $('input[type=childName]').val();
  childAdd.gender = 'unisex';
  childAdd.dob = $('input[type=childDOB]').val();
  childAdd.user_id = $('img[id=profile-pic]').attr("data-user-id");
  console.log(childAdd);
  e.preventDefault();
  $.ajax(appVars.host + '/api/child', {
    data: childAdd,
    type: 'POST'
  })
  .done(function(){
    $.ajax(appVars.host + '/api')
    .done(function(apiData){
      var newKid = Object.keys(apiData.children).pop()
      console.log(apiData.children[newKid]);
      insertTemplate($('#children-holder'), 'newChild', apiData.children[newKid]);
    })
  })
})
