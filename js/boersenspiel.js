let amountAktienOwned = 0;
let amountMoney = 10000;


$(document).ready(function() {

    actualTime();

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

    $('#aktienCount').on("input", function() {
        updateAktienBuyAndSellAmount();
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
            drawAktienCourse($("#aktienCours").text());
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
    if (newAktienPrice < 1) { newAktienPrice = 1; }
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


    if ((amount * parseFloat($("#aktienCours").text()) - (-1) * fee(amount)) > amountMoney) {
        // TODO Fehlermeldung nicht genügend kapital verhanden
    } else {
        amountMoney = (amountMoney - fee(amount) - amount * parseFloat($("#aktienCours").text())).toFixed(2);
        amountAktienOwned = amountAktienOwned + amount;

        $('#amountAktien').text(amountAktienOwned);
        $('#capital').text(parseFloat(amountMoney));
    }
}

function sellAktien(amount) {

    if (amount > parseInt($('#amountAktien').text())) {
        //TODO fehler meldung, man kann nicht  mehr Aktien verkaufen als besitzen
    } else {
        amountMoney = (amountMoney - fee(amount) - (-amount) * parseFloat($("#aktienCours").text())).toFixed(2);
        amountAktienOwned = amountAktienOwned - amount;
        $('#amountAktien').text(amountAktienOwned);
        $('#capital').text(parseFloat(amountMoney));
    }
}

function fee(amount) {

    if ((5 - (-1) * 0.05 * amount * parseFloat($("#aktienCours").text()) > 60)) {
        return 60;
    } else {
        return (5 - (-1) * 0.05 * amount * parseFloat($("#aktienCours").text()));
    }
}


function actualTime() {

    date = new Date;
    let hour = date.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    result = hour + ':' + minutes + ':' + seconds;
    $('#time').text(result);
    setTimeout(actualTime, 1000);
}

function updateAktienBuyAndSellAmount() {
    $('#aktienBuyingCost').text(fee(parseInt($("#aktienCount").val())) - (-parseInt($("#aktienCount").val())) * parseFloat($("#aktienCours").text()));
    $('#aktienSellingCost').text((parseInt($("#aktienCount").val())) * parseFloat($("#aktienCours").text()) - fee(parseInt($("#aktienCount").val())));
}

function drawAktienCourse(newAktienCourse) {
    var canvas = document.getElementById('stockMarket');
    /* Kästchen */
    canvas = canvas.getContext('2d');
    canvas.fillStyle = "rgb(200,0,0)";
    canvas.fillRect(10, 10, 55, 55);
}