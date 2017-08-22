let amountOfSharesOwned = 0;
let amountMoney = 10000;

let canvas = document.getElementById('stockMarket');
canvas = canvas.getContext('2d');
canvas.lineJoin = "round";
canvas.beginPath();
canvas.moveTo(0, 3404);


$(document).ready(function() {

    currentTime();

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

function startGame(username) {

    if (username) {
        document.getElementById("startGame").disabled = true;
        let runtime = 0;
        runningGame = setInterval(function() {
            runtime = runtime + 1;
            sharesCourseChange($("#aktienCours").text());
            drawSharesValueGraph($("#aktienCours").text(), runtime);
        }, 1000);
        setTimeout(stopGame, 15 * 60 * 1000) // cancel after 15 min

        $('#noUserName').text("");

    } else {
        $('#noUserName').text("Sie müssen einen Spielernamen eingeben befor Sie das Spiel starten können!");
    }

}

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
}

function calculateCourseChange(likeliness) {
    let changeAmount = (Math.random() * (0.15 - 0.01) + 0.01).toFixed(2); // number between 0.01 and 0.015
    let riseOrFall = ((Math.random() * 100) + 1);

    if (riseOrFall <= 100 * likeliness) {
        return changeAmount;
    } else {
        return changeAmount * -1;
    }
}

function buyShares(amount) {

    if (!amount == 0) {
        if ((amount * parseFloat($("#aktienCours").text()) - (-1) * calculateFee(amount)) > amountMoney) {
            $('#sellOrBuyError').text("Sie besitzen nicht genügend Geld um die Aktien zu kaufen!");
        } else {
            $('#sellOrBuyError').text("");

            amountMoney = (amountMoney - calculateFee(amount) - amount * parseFloat($("#aktienCours").text())).toFixed(2);
            amountOfSharesOwned = amountOfSharesOwned + amount;

            $('#amountAktien').text(amountOfSharesOwned);
            $('#capital').text(parseFloat(amountMoney));
        }
    }

}

function sellShares(amount) {
    if (!amount == 0) {
        if (amount > parseInt($('#amountAktien').text())) {
            $('#sellOrBuyError').text("Sie können nicht mehr Aktien verkaufen als Sie besitzen!");
        } else {
            $('#sellOrBuyError').text("");
            amountMoney = (amountMoney - calculateFee(amount) - (-amount) * parseFloat($("#aktienCours").text())).toFixed(2);
            amountOfSharesOwned = amountOfSharesOwned - amount;
            $('#amountAktien').text(amountOfSharesOwned);
            $('#capital').text(parseFloat(amountMoney));
        }
    }
}

function calculateFee(amount) {

    if ((5 - (-1) * 0.05 * amount * parseFloat($("#aktienCours").text()) > 60)) {
        return 60;
    } else {
        return (5 - (-1) * 0.05 * amount * parseFloat($("#aktienCours").text()));
    }
}


function currentTime() {

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
    setTimeout(currentTime, 1000);
}

function updateSharesBuyAndSellAmount() {
    $('#aktienBuyingCost').text(calculateFee(parseInt($("#aktienCount").val())) - (-parseInt($("#aktienCount").val())) * parseFloat($("#aktienCours").text()) || 0);
    $('#aktienSellingCost').text((parseInt($("#aktienCount").val())) * parseFloat($("#aktienCours").text()) - calculateFee(parseInt($("#aktienCount").val())) || 0);
}

function drawSharesValueGraph(newAktienCourse, time) {

    /* let modiviedAktienCOurseForDrawing = parseInt((newAktienCourse - 100) / 10) * 10;

     if (modiviedAktienCOurseForDrawing < 0) {
         modiviedAktienCOurseForDrawing = modiviedAktienCOurseForDrawing * -1;
     } else {
         modiviedAktienCOurseForDrawing = modiviedAktienCOurseForDrawing + 10;
     }

     modiviedAktienCOurseForDrawing = modiviedAktienCOurseForDrawing + 1;

     modiviedAktienCOurseForDrawing = (modiviedAktienCOurseForDrawing) * (400 / 20);*/


    let height = document.getElementById('stockMarket').scrollHeight;

    let modiviedAktienCOurseForDrawing = newAktienCourse * (height / 235);

    canvas.lineTo(time * (10 / 15), modiviedAktienCOurseForDrawing);
    canvas.stroke();
    console.log(height);
}