/* Cleo De Rocco
*/


//global variables for dice, dice tags, scores, values, disabled status, totals, rolls left, name
var dice_tags=[
  '<img src="images/one.svg"  width="70"/>',
  '<img src="images/two.svg"  width="70"/>',
  '<img src="images/three.svg"  width="70"/>',
  '<img src="images/four.svg"  width="70"/>',
  '<img src="images/five.svg"  width="70"/>',
  '<img src="images/six.svg"  width="70"/>',
]
var dice = [document.getElementById('die_0'),
            document.getElementById('die_1'),
            document.getElementById('die_2'),
            document.getElementById('die_3'),
            document.getElementById('die_4')];

var scores = [document.getElementById('one'),
  document.getElementById("two"),
  document.getElementById("three"),
  document.getElementById("four"),
  document.getElementById("five"),
  document.getElementById('six'),
  document.getElementById('three count'),
  document.getElementById('fourfourfour'),
  document.getElementById("full count"),
  document.getElementById("sm count"),
  document.getElementById("lg count"),
  document.getElementById("yahtzee count"),
  document.getElementById("chance count")];

var valueArray = [scores[0].value,
scores[1].value,
scores[2].value,
scores[3].value,
scores[4].value,
scores[5].value,
scores[6].value,
scores[7].value,
scores[8].value,
scores[9].value,
scores[10].value,
scores[11].value,
scores[12].value];

var disabledArray = [scores[0].disabled,
scores[1].disabled,
scores[2].disabled,
scores[3].disabled,
scores[4].disabled,
scores[5].disabled,
scores[6].disabled,
scores[7].disabled,
scores[8].disabled,
scores[9].disabled,
scores[10].disabled,
scores[11].disabled,
scores[12].disabled];

var yahtzeeBonus = 0;

var totalUpperScore = 0, totalLowerScore = 0;
var grandTotalvalue = "";

var rollsLeft = 3;
var name = "";

var user = {
  users_name: name,
  total_rolls: rollsLeft,
  differentCategories: scores,
  differentValues: valueArray,
  disabled: disabledArray,
  diceIdentified: dice,
}

//save game
var save_game = document.getElementById("save_game");

save_game.addEventListener('click', function() {
  if(name == "") {
    provideFeedback("Provide a name to be able to save your game and load it later. You will be given option to load later if you enter the same name after pressing play again.")
    document.getElementById("msg").setAttribute("class", "badFeedback");
  }
  else {
  var diceValues = [document.getElementById('die_0').innerHTML,
              document.getElementById('die_1').innerHTML,
              document.getElementById('die_2').innerHTML,
              document.getElementById('die_3').innerHTML,
              document.getElementById('die_4').innerHTML];

  var indexes = [];
    dice.forEach(function(element, index) {
        if (element.className === "no") {
          indexes.push(index);
        }
    });


  var user = {
    users_name: name,
    rolls: rollsLeft,
    yahtzee: yahtzeeBonus,
    differentValues: valueArray,
    diceReserved: indexes,
    disabled: disabledArray,
    diceIdentified: diceValues,
  }
  localStorage.setItem("oldGame" + name, JSON.stringify(user));
}
});

//load game
function loadGame() {
  var gameArray = JSON.parse(localStorage.getItem("oldGame" + name));

  dice.forEach(function(element, index) {
    element.innerHTML = gameArray["diceIdentified"][index];
    element.setAttribute("class", "dieRollable");
  });

  var indexArray = [];
  indexArray = gameArray["diceReserved"];
  var f = 0;
  for (f; f < indexArray.length; f++) {
    document.getElementById("die_" + indexArray[f]).setAttribute("class", "no");
  }

  rollsLeft = gameArray["rolls"];
  document.getElementById("lmk").innerHTML = "Rolls left: " + rollsLeft + ".";

  yahtzeeBonus = gameArray["yahtzee"];

  var i = 0;
  for(i; i<valueArray.length; i++) {
    valueArray[i] = gameArray["differentValues"][i];
  }

  grandTotalvalue = "";
  scores.forEach(function(element, index) {
          element.disabled = gameArray["disabled"][index];
        });

  name = gameArray["users_name"];

  updateScores();
}

//play again
var play_again = document.getElementById("play_again");
play_again.addEventListener('click', function() {
  document.getElementById('die_0').innerHTML = '<img src="images/blank.svg" width="70">';
  document.getElementById('die_1').innerHTML = '<img src="images/blank.svg" width="70">';
  document.getElementById('die_2').innerHTML = '<img src="images/blank.svg" width="70">';
  document.getElementById('die_3').innerHTML = '<img src="images/blank.svg" width="70">';
  document.getElementById('die_4').innerHTML = '<img src="images/blank.svg" width="70">';
  scores.forEach(function(element, index) {
          element.disabled = false;
          disabledArray[index] = false;
          element.innerHTML = "";
        });
  valueArray = ["",  "","",  "",  "",  "",  "",  "",  "",  "",  "","",""];
  yahtzeeBonus = 0;
  document.getElementById("yahtzeeB").innerHTML = "";
  totalUpperScore = 0, totalLowerScore = 0;
  grandTotalvalue = "";
  rollsLeft = 3;
  name = "";
  updateRolls();
  newTurn();
  updateScores();
  document.getElementById("name").disabled = false;
  document.getElementById("msg").setAttribute("class", "goodFeedback");
  provideFeedback("This is a new game. Please enter a name for this game. You can still see the old scores that were inputted, but they are not set (and won't be accepted if you by accidentally hit enter because they will be invalid)- Just delete them and enter a new value!");
  document.getElementById("lmk").innerHTML = "Rolls left: " + rollsLeft + ".";
});


//press roll button
var roll_button = document.getElementById('roll_button');

roll_button.addEventListener('click', function() {
  if(rollsLeft > 0) {
  var myNodeList = document.getElementsByClassName("dieRollable");
  var i;
  for (i = 0; i < myNodeList.length; i++) {
    var replace = dice_tags[getRndInteger(0,6)];
    myNodeList[i].setAttribute("class", "dieRollable");
    myNodeList[i].innerHTML = replace;
}
rollsLeft -= 1;
updateRolls();
}
else {
  provideFeedback("You have no rolls left. Please enter a value into a category. You can choose to enter zero into a category.")
  document.getElementById("msg").setAttribute("class", "badFeedback");
}
}); //click event - roll button

//if dice clicked, allows reserve
dice.forEach(function(element, index) {
  element.addEventListener('click', function() {
    if(rollsLeft<3) {
    if (this.className === "dieRollable") {
      this.setAttribute("class", "no");
    }
    else {
      this.setAttribute("class", "dieRollable");
    }
  }
  else {
    provideFeedback("Please roll once, before you reserve.");
    document.getElementById("msg").setAttribute("class", "badFeedback");
  }
  });
}); //click event - reserved die

//random
function getRndInteger(min, max) {
  var r = Math.floor(Math.random() * (max - min) ) + min;
  return r;
} //random

//when value is entered for a category
scores.forEach(function(element, index) {
  element.addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
    if (key=== 13) {
    var value = this.value;
    if(rollsLeft<3) {
    if(value == 0) {
      provideFeedback("Looks like you chose to enter 0! Better luck next time.");
      document.getElementById("msg").setAttribute("class", "goodFeedback");
      this.disabled = true;
      disabledArray[index] = true;
      valueArray[index] = value;
      updateScores();
      newTurn();
    }
    else if(score_Validation(this, value, index)){
      document.getElementById("msg").setAttribute("class", "goodFeedback");
      this.disabled = true;
      disabledArray[index] = true;
      valueArray[index] = value;
      updateScores();
      newTurn();
    }//valid score
    else{
      document.getElementById("msg").setAttribute("class", "badFeedback");
    }//invalid score
  }
  else {
    provideFeedback("You need to roll once before you can enter a new score entry.");
    document.getElementById("msg").setAttribute("class", "badFeedback");
  }
}
  });
});

//adking for person's name
var getName = document.getElementById('name');

getName.addEventListener('keypress', function(e) {
  var key = e.which || e.keyCode;
  if (key=== 13) {
    name = this.value;
    document.getElementById("playerName").innerHTML = "Player: " + name;
    if(isNaN(name)) {
      checkName(name);
      this.disabled = true;
      provideFeedback("Welcome to my yahtzee game, " + name+ "! Begin your game by rolling the dice. You have three rolls each turn. Click the dice to reserve it. Click again to unreserve! You can enter zero for any category if you wish. Note: If you enter zero for yahtzee, you can not use the yahtzee bonus.");
      document.getElementById("msg").setAttribute("class", "goodFeedback");
      document.getElementById("nameMessage").innerHTML = "Name: ";
    }
    else {
      provideFeedback("Please enter a string for a name.");
      document.getElementById("msg").setAttribute("class", "badFeedback");
    }
  }
});

//validate name
function checkName(name) {
  if (localStorage.getItem("oldGame" + name) === null) {
    return true;
}
  else {
  var txt;
  if (confirm("Click Ok to load your old game! Press cancel if you want to play a new game.")) {
    loadGame();
  } else {
  }
  }
}

//yahtzee button
var yahtzeeButton = document.getElementById("yahtzeeButton");

yahtzeeButton.addEventListener('click', function() {
  if((document.getElementById("yahtzee count").disabled) && (valueArray[11] == 50)) {
    var i = 0;
    var count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0, count6= 0;
    for(i; i<dice.length; i++) {
      if(dice[i].innerHTML == '<img src="images/one.svg" width="70">') {
        count1++;
      }
      else if(dice[i].innerHTML == '<img src="images/two.svg" width="70">') {
        count2++;
      }
      else if(dice[i].innerHTML == '<img src="images/three.svg" width="70">') {
        count3++;
      }
      else if(dice[i].innerHTML == '<img src="images/four.svg" width="70">') {
        count4++;
      }
      else if(dice[i].innerHTML == '<img src="images/five.svg" width="70">') {
        count5++;
      }
      else if(dice[i].innerHTML == '<img src="images/six.svg" width="70">') {
        count6++;
      }
    }
    var countArray = [count1,
                count2,
                count3,
                count4,
                count5,
                count6];
    countArray.sort().reverse();
    if(countArray[0] > 4) {
    yahtzeeBonus += 1;
    provideFeedback("Yahtzee bonus!");
    document.getElementById("msg").setAttribute("class", "goodFeedback");
    updateScores();
    newTurn();
  }
  else {
  provideFeedback("Not yahtzee.");
  document.getElementById("msg").setAttribute("class", "badFeedback");
}
}
else {
provideFeedback("You haven't entered a yahtzee yet.");
document.getElementById("msg").setAttribute("class", "badFeedback");
}
});

//update scores
function updateScores() {
  var us = 0, ls = 0, bonus = 0;
  for(var j = 0; j < 6; j++) {
    us += Number(valueArray[j]);
}
  for(var k = 6; k < 13; k++) {
    ls += Number(valueArray[k]);
  }
  if(us>63) {
    bonus = 35;
  }
document.getElementById("totalUpperScorePrint").innerHTML = us;
document.getElementById("bonus").innerHTML = bonus;
document.getElementById("grandUpper1").innerHTML = Number(us + bonus);
document.getElementById("grandUpper2").innerHTML = Number(us + bonus);


var yaht = Number((yahtzeeBonus)*100);
grandTotalvalue = Number(us + bonus + ls + yaht);
document.getElementById("totalLowerScorePrint").innerHTML = ls+yaht;
countDis = 0;
for(var k = 0; k < 13; k++) {
  if(scores[k].disabled === true) {
    countDis++;
  }
}
if(countDis > 12) {
document.getElementById("grandTotal").innerHTML = grandTotalvalue;
provideFeedback("All categories have been filled out! Look at grand total to see your score.");
}

document.getElementById("yahtzeeB").innerHTML = yaht;

}

//update roll count message
function updateRolls() {
  document.getElementById("lmk").innerHTML = "Rolls left: " + rollsLeft + ".";
}

//new turn
function newTurn() {
  dice.forEach(function(element, index) {
    element.setAttribute("class", "dieRollable");
    element.innerHTML = '<img src="images/blank.svg"  width="70"/>'
  });
  rollsLeft = 3;
  document.getElementById("lmk").innerHTML = "Rolls left: " + rollsLeft + ".";
}

//score validation
function score_Validation(element, value, index) {
  let isValid = false;
  let msg='';
  let type='bad';

  if(isNaN(value)) {
    msg="Score is not a number. Not valid.";
    provideFeedback(msg);
  }
  else if(value>= 0 || value <= 50) {
    if(element.parentNode.parentNode.parentNode.parentNode.parentNode.id =="upper"){
      var category_score = element.id;
      var i = 0;
      var count = 0;
      for(i; i<dice.length; i++) {
        if(dice[i].innerHTML == '<img src="images/' + category_score + '.svg" width="70">') {
          count++;
        }
      }
      if(value == count*(index+1)) {
        msg+="Valid!";
        provideFeedback(msg);
        isValid = true;
        return isValid;
      }
      msg= "Looks like your calculations are wrong. Calculate highest possible score for category you selected.";
      provideFeedback(msg);
    }
    else if (element.parentNode.parentNode.parentNode.parentNode.parentNode.id =="lower"){
      var i = 0;
      var count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0, count6= 0;
      for(i; i<dice.length; i++) {
        if(dice[i].innerHTML == '<img src="images/one.svg" width="70">') {
          count1++;
        }
        else if(dice[i].innerHTML == '<img src="images/two.svg" width="70">') {
          count2++;
        }
        else if(dice[i].innerHTML == '<img src="images/three.svg" width="70">') {
          count3++;
        }
        else if(dice[i].innerHTML == '<img src="images/four.svg" width="70">') {
          count4++;
        }
        else if(dice[i].innerHTML == '<img src="images/five.svg" width="70">') {
          count5++;
        }
        else if(dice[i].innerHTML == '<img src="images/six.svg" width="70">') {
          count6++;
        }
      }
      var expectedTotal = (count1*1) + (count2 * 2) + (count3 * 3) + (count4 *4) + (count5 *5) + (count6 * 6);
      var countArray = [count1,
                  count2,
                  count3,
                  count4,
                  count5,
                  count6];
      countArray.sort().reverse();
      if(element.id == "yahtzee count" || element.id == "fourfourfour" || element.id == "three count") {
        var threshold = 100;
        if(element.id == "yahtzee count") {
          threshold = 4;
          expectedTotal = 50;
        }
        if(element.id == "fourfourfour") {
          threshold = 3;
        }
        if(element.id == "three count") {
          threshold = 2;
        }
        if(countArray[0] > threshold) {
          if(value == expectedTotal) {
            provideFeedback("You calculated the correct total and " + (threshold + 1) + " dice have same value.");
            return true;
          }
        provideFeedback("You calculated the wrong total, but " + (threshold + 1) + " dice have same value.");
        }
        else {
          provideFeedback((threshold + 1) + " dice do not have the same value.");
        }
      }

      if(element.id == "chance count") {
        if(value == expectedTotal) {
            provideFeedback("You calculated the correct total.");
            return true;
          }
        provideFeedback("You calculated the wrong total.");
        }

      if(element.id == "full count") {
        if(countArray[0] == 3 & countArray[1] == 2) {
          if(value == 25) {
              provideFeedback("You have a full house & you calculated the correct total.");
              return true;
            }
          provideFeedback("You have a full house, but the wrong value.");
        }
        else {
          provideFeedback("You do not have a full house.");
        }
      }
      if(element.id == "sm count") {
        if(countArray[1] > 0 & countArray[2] > 0 & countArray[3] > 0 & ((countArray[0] == 0 & countArray[4] > 1) || (countArray[0] > 1 & countArray[4] == 0) || (countArray[0] == 1 & countArray[4] == 1))) {
          if(value == 30) {
              provideFeedback("You have a small straight & you calculated the correct total.");
              return true;
            }
          provideFeedback("You have a small straight, but the wrong value.");
        }
        else {
          provideFeedback("You do not have a small straight.");
        }
      }
      if(element.id == "lg count") {
        if(countArray[0] == 1 & countArray[1] == 1 & countArray[2] == 1 & countArray[3] == 1 & countArray[4] == 1) {
          if(value == 40) {
              provideFeedback("You have a large straight & you calculated the correct total.");
              return true;
            }
          provideFeedback("You have a large straight, but the wrong value.");
        }
        else {
          provideFeedback("You do not have a large straight.");
        }
      }
    }
  }
  else {
    msg="Score is not valid.";
    provideFeedback(msg);
  }
  return isValid;
};

function provideFeedback(msg) {
  document.getElementById("msg").innerHTML = msg;
}
