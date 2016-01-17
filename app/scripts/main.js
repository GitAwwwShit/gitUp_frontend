var appVars = {
  host: "http://git-up.herokuapp.com"
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
    $.ajax(appVars.host + '/api/entry/'+cGoalID+'/'+addAmount, {             // what's our api route for update goal?
      data: goalUpdate,
      type: 'POST'
    })
    .done(function(goalUpdateData){
      console.log(goalUpdateData);
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
  console.log(cGoalID);
  var goalRemove = {cGoalID: cGoalID};
  e.preventDefault();
  $.ajax(appVars.host + '/api/deletegoal/'+cGoalID, {         // what's our api route for delete goal?
    data: goalRemove,
    type: 'DELETE'
  })
  .done(function(goalRemoveData){
    console.log(goalRemoveData);
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
      var newKidID = Object.keys(apiData.children).pop()
      var newKid = apiData.children[newKidID];
      newKid.titles = {
            one: 'Little Shit',
            two: 'SOB',
            three: 'Mistake 1',
            four: 'Love Child'
          }
      console.log(newKid);
      insertTemplate($('#children-holder'), 'newChild', newKid);
    })
  })
})

// ajax to delete child
$(document).on('click', '.remove-child', function(e) {
  console.log(this);
  var childID = $(this).attr("data-childIDremove");
  console.log(childID);
  e.preventDefault();
  $.ajax(appVars.host + '/api/delete/'+childID, {
    data: {},
    type: 'DELETE'
  })
  .done(function(removedKid){
    console.log(removedKid);
  })
  $('div[data-RemoveChild='+childID+']').remove();
  console.log($('div[data-RemoveChild='+childID+']').remove())
})

// ajax to add cGoal
$(document).on('click', '.add-cGoal', function(e) {
  var childId = $(this).attr("data-childID-for-cGoal")
  var cGoalAdd = {
    child_id: childId,
    activity_id: $('select[data-childID-activity='+childId+']').val(),
    amount: $('input[data-gAmount='+childId+']').val(),
    reward: $('input[data-gReward='+childId+']').val()
  };
  console.log(cGoalAdd);
  e.preventDefault();
  $.ajax(appVars.host + '/api/makeGoal', {
    data: cGoalAdd,
    type: 'POST'
  })
  .done(function(results){
    console.log(results);
    // $.ajax(appVars.host + '/api')
    // .done(function(apiData){
    //   var newKidID = Object.keys(apiData.children).pop()
    //
    // })
  })
})
