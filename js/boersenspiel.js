//Declare globals
let amountOfSharesOwned = 0;
let amountMoney = 10000;
let maxGameTimeSec = 900;
let shareValue = 100;

let canvas = document.getElementById('stockMarket');
canvas = canvas.getContext('2d');
canvas.lineJoin = "round";
canvas.beginPath();
canvas.moveTo(0, 3404);

//Define all events
$(document).ready(function() {

    setCurrentTime();

    $('#endGame').click(function() {
        stopGame();
    });

    $('#startGame').click(function() {
        startGame($('#username').val());
    });

    $('#buyAktien').click(function() {
        buyShares(parseInt($("#aktienCount").val()));
    });

    $('#sellAktien').click(function() {
        sellShares(parseInt($("#aktienCount").val()));
    });

    $('#aktienCount').on("input", function() {
        updateSharesBuyAndSellAmount();
    });
});

let numberOfRise;
let numberOfFall;
let runningGame = null;

//Start the game with the given username
function startGame(username) {
    if (username) {
        document.getElementById("startGame").disabled = true;
        document.getElementById("username").disabled = true;
        let runtime = 0;
        runningGame = setInterval(function() {
            runtime = runtime + 1;
            sharesCourseChange(shareValue);
            drawSharesValueGraph(shareValue, runtime);
        }, 1000);
        setTimeout(stopGame, 15 * 60 * 1000) // cancel after 15 min

        $('#noUserName').text("");

    } else {
        $('#noUserName').text("Sie müssen einen Spielernamen eingeben befor Sie das Spiel starten können!");
    }
}

//Stop the game and clear the running interval
function stopGame() {
    clearInterval(runningGame);
}

function sharesCourseChange(sharesValue) {

    let courseChange;

    if (numberOfRise >= 3 || numberOfFall >= 3) {

        if (numberOfRise >= 3) {
            courseChange = calculateCourseChange(0.75);
        } else {
            courseChange = calculateCourseChange(0.25);
        }

    } else {
        courseChange = calculateCourseChange(0.5);
    }

    if (sharesValue < sharesValue + courseChange) {
        numberOfRise = 0;
        numberOfFall = numberOfFall + 1;
    } else {
        numberOfRise = numberOfRise + 1;
        numberOfFall = 0;
    }

    let newAktienPrice = (parseFloat(sharesValue) + parseFloat(courseChange)).toFixed(2);
    if (newAktienPrice < 1) { newAktienPrice = 1; }
    $("#aktienCours").text(newAktienPrice);
    shareValue = newAktienPrice;
}

//Calculate the shares value change based on the given likelihood
function calculateCourseChange(likelihood) {
    let changeAmount = (Math.random() * (0.15 - 0.01) + 0.01).toFixed(2); // number between 0.01 and 0.015
    let riseOrFall = ((Math.random() * 100) + 1);

    if (riseOrFall <= 100 * likelihood) {
        return changeAmount;
    } else {
        return changeAmount * -1;
    }
}

//Buy the given amount of shares for the user
function buyShares(amount) {
    if (!amount == 0) {
        if ((amount * shareValue - (-1) * calculateFee(amount)) > amountMoney) {
            $('#sellOrBuyError').text("Sie besitzen nicht genügend Geld um die Aktien zu kaufen!");
        } else {
            $('#sellOrBuyError').text("");

            amountMoney = (amountMoney - calculateFee(amount) - amount * shareValue).toFixed(2);
            amountOfSharesOwned = amountOfSharesOwned + amount;

            $('#amountAktien').text(amountOfSharesOwned);
            $('#capital').text(parseFloat(amountMoney));
        }
    }
}

//Sell the given amount of shares for the user
function sellShares(amount) {
    if (!amount == 0) {
        if (amount > parseInt($('#amountAktien').text())) {
            $('#sellOrBuyError').text("Sie können nicht mehr Aktien verkaufen als Sie besitzen!");
        } else {
            $('#sellOrBuyError').text("");
            amountMoney = (amountMoney - calculateFee(amount) - (-amount) * shareValue).toFixed(2);
            amountOfSharesOwned = amountOfSharesOwned - amount;
            $('#amountAktien').text(amountOfSharesOwned);
            $('#capital').text(parseFloat(amountMoney));
        }
    }
}

//Calculate the fee for the given amount
function calculateFee(amount) {

    if ((5 - (-1) * 0.05 * amount * shareValue > 60)) {
        return 60;
    } else {
        return (5 - (-1) * 0.05 * amount * shareValue);
    }
}

//Update the date time label with the current values
function setCurrentTime() {

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
    setTimeout(setCurrentTime, 1000);
}

//Update the shares labels
function updateSharesBuyAndSellAmount() {
    $('#aktienBuyingCost').text((calculateFee(parseInt($("#aktienCount").val())) - (-parseInt($("#aktienCount").val())) * shareValue || 0).toFixed(2));
    $('#aktienSellingCost').text(((parseInt($("#aktienCount").val())) * shareValue - calculateFee(parseInt($("#aktienCount").val())) || 0).toFixed(2));
}

//Draw the shares graph
function drawSharesValueGraph(newAktienCourse, time) {
    let height = document.getElementById('stockMarket').scrollHeight;
    let width = document.getElementById('stockMarket').scrollWidth;

    let modiviedAktienCOurseForDrawing = newAktienCourse * (height / 235);

    canvas.lineTo(time * (width / maxGameTimeSec), modiviedAktienCOurseForDrawing);
    canvas.stroke();
}