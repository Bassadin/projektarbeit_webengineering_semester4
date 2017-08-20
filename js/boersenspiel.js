let amountAktienOwned = 0;
let amountMoney = $('#capital').text;

$(document).ready(function() {

    $('#endGame').click(function(){
        stopGame();
    });

    $('#startGame').click(function(){
        startGame($('#startGame').text);
    });
    
    $('#buyAktien').click(function(){
       buyAktien(('#aktienCount'.text));
    });

    $('#sellAktien').click(function(){
        sellAktien(('#aktienCount').text);
    });

});

let courseRise; // boelaen 
let numberOfRise;
let numberOfFall;

function startGame(username) {
   
    if (username ==="") {
 
        //TODO fehlermeldung das Name fehlt

    } else {
            
    let runningGame = setInterval(function(){
        aktienCourseChange($("#aktienCours").text);
       }, 1000);
       setTimeout(stopGame, 15 * 60 * 1000)// cancel after 15 min  
    }
}
    

function stopGame() {
    clearInterval(runningGame);
}

function aktienCourseChange(aktienWorth) {
  
    let courseChange;

    if (numberOfRise >= 3 || numberOfFall >=3 ) {
        
        if (numberOfRise >= 3) {
            courseChange= calcCourseChange(0.75);
        } else {
            courseChange= calcCourseChange(0.25);
        }

    } else {
        courseChange= calcCourseChange(0.5);
    }
    
    if (aktienWorth < aktienWorth+courseChange) {
        numberOfRise=0;
        numberOfFall=numberOfFall+1;
    } else {
        numberOfRise=numberOfRise+1;
        numberOfFall=0;
    }

    $("#aktienCours").text(aktienWorth+courseChange);
}

function calcCourseChange(liklyness) {
   let changeAmount= (Math.random() * (0.15 - 0.01) + 0.01).toFixed(2); // number between 0.01 and 0.015
   let riseOrFall= ((Math.random()*100)+1);

   if (riseOrFall <= 100*liklyness) {
       return changeAmount;
   } else {
       return changeAmount*-1;
   }
}

function buyAktien(amount) {
   
    if (amount*($("#aktienCours").text) > amountMoney) {
        // TODO Fehlermeldung nicht genügend kapital verhanden
    } else {
        amountMoney = amountMoney -amount*($("#aktienCours").text);
        amountAktienOwned = amountAktienOwned +amount;
       
        $('#amountAktien').text(amountAktienOwned);
        $('#capital').text(amountMoney);
    }
}

function sellAktien(amount) {
    
    if (amount > amountAktienOwned) {
        //TODO fehler meldung, man kann nicht  mehr Aktien verkaufen als besitzen
    } else {
        amountMoney = amountMoney+ amount*($("#aktienCours").text);
        amountAktienOwned = amountAktienOwned -amount;

        $('#amountAktien').text(amountAktienOwned);
        $('#capital').text(amountMoney);
    }
}