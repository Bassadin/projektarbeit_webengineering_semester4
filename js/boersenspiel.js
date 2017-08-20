let amountAktienOwned = 0;
let amountMoney = 10000;


$(document).ready(function() {

    $('#endGame').click(function() {
        stopGame();
    });

    $('#startGame').click(function() {
        startGame($('#username').val());
    });

    $('#buyAktien').click(function() {
        buyAktien(parseInt($("#aktienCount").val()));
    });

    $('#sellAktien').click(function() {
        sellAktien(parseInt($("#aktienCount").val()));
    });

});

let courseRise; // boelaen 
let numberOfRise;
let numberOfFall;
let runningGame = null;

function startGame(username) {

    if (username) {
        runningGame = setInterval(function() {
            aktienCourseChange($("#aktienCours").text());
        }, 1000);
        setTimeout(stopGame, 15 * 60 * 1000) // cancel after 15 min

    } else {
        //TODO fehlermeldung das Name fehlt

    }

}

function stopGame() {
    clearInterval(runningGame);
}

function aktienCourseChange(aktienWorth) {

    let courseChange;

    if (numberOfRise >= 3 || numberOfFall >= 3) {

        if (numberOfRise >= 3) {
            courseChange = calcCourseChange(0.75);
        } else {
            courseChange = calcCourseChange(0.25);
        }

    } else {
        courseChange = calcCourseChange(0.5);
    }

    if (aktienWorth < aktienWorth + courseChange) {
        numberOfRise = 0;
        numberOfFall = numberOfFall + 1;
    } else {
        numberOfRise = numberOfRise + 1;
        numberOfFall = 0;
    }

    let newAktienPrice = (parseFloat(aktienWorth) + parseFloat(courseChange)).toFixed(2);
    $("#aktienCours").text(newAktienPrice);
}

function calcCourseChange(liklyness) {
    let changeAmount = (Math.random() * (0.15 - 0.01) + 0.01).toFixed(2); // number between 0.01 and 0.015
    let riseOrFall = ((Math.random() * 100) + 1);

    if (riseOrFall <= 100 * liklyness) {
        return changeAmount;
    } else {
        return changeAmount * -1;
    }
}

function buyAktien(amount) {


    if (amount * parseFloat($("#aktienCours").text()) > amountMoney) {
        // TODO Fehlermeldung nicht genügend kapital verhanden
    } else {
        amountMoney = (amountMoney - amount * parseFloat($("#aktienCours").text())).toFixed(2);
        amountAktienOwned = amountAktienOwned + amount;

        $('#amountAktien').text(amountAktienOwned);
        $('#capital').text(parseFloat(amountMoney));
    }
}

function sellAktien(amount) {

    if (amount > parseInt($('#amountAktien').text())) {
        //TODO fehler meldung, man kann nicht  mehr Aktien verkaufen als besitzen
    } else {
        amountMoney = (amountMoney - (-amount) * parseFloat($("#aktienCours").text())).toFixed(2);
        amountAktienOwned = amountAktienOwned - amount;
        $('#amountAktien').text(amountAktienOwned);
        $('#capital').text(parseFloat(amountMoney));
    }
}