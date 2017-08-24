//Declare global vars
//let request = new XMLHttpRequest();
let shareValue;
let amountOfSharesOwned;
let amountMoney;
let maxGameTimeSec = 900;

let canvas = document.getElementById('stockMarket');
canvas = canvas.getContext('2d');
canvas.lineJoin = "round";
canvas.beginPath();
canvas.moveTo(0, 3404);

let numberOfRise;
let numberOfFall;
let runningGame = null;

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


//Start the game with the given username
function startGame(username) {
    if (username) {
        document.getElementById("startGame").disabled = true;
        document.getElementById("username").disabled = true;
        let runtime = 0;
        runningGame = setInterval(function() {
            runtime = runtime + 1;
            getNewShareValue();

            $("#aktienCours").text(shareValue);

            drawSharesValueGraph(shareValue, runtime);
        }, 1000);
        setTimeout(stopGame, 15 * 60 * 1000) // cancel after 15 min

        $('#noUserName').text("");

    } else {
        $('#noUserName').text("Sie müssen einen Spielernamen eingeben befor Sie das Spiel starten können!");
    }
}

//Stop the current game and clear the interval
function stopGame() {
    clearInterval(runningGame);
}

//Buy the given amount of shares for the user
function buyShares(amount) {

    $.post('aktienkurs.php', { postShareCourse: 2 }, function(shareValueNow) {
        $.post('transaktion.php', { postShareValue: shareValueNow, postUsername: username, postAmount: amount, postKind: "buy" }, function(data) {
            $('#sellOrBuyError').text(data)
        });
    });

    getAmountOfShares();
    $('#amountAktien').text(amountOfSharesOwned);
    getAmountOfMoneyOwned();
    $('#capital').text(parseFloat(amountMoney));
}

//Sell the given amount of shares for the user
function sellShares(amount) {

    $.post('aktienkurs.php', { postShareCourse: 2 }, function(shareValueNow) {
        $.post('transaktion.php', { postShareValue: shareValueNow, postUsername: username, postAmount: amount, postKind: "sell" }, function(data) {
            $('#sellOrBuyError').text(data)
        });
    });

    getAmountOfShares();
    $('#amountAktien').text(amountOfSharesOwned);
    getAmountOfMoneyOwned();
    $('#capital').text(parseFloat(amountMoney));

}

//Update the date time label with the current values
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

//Update the shares labels
function updateSharesBuyAndSellAmount() {
    $('#aktienBuyingCost').text((calculateFee(parseInt($("#aktienCount").val())) - (-parseInt($("#aktienCount").val())) * shareValue || 0).toFixed(2));
    $('#aktienSellingCost').text(((parseInt($("#aktienCount").val())) * shareValue - calculateFee(parseInt($("#aktienCount").val())) || 0).toFixed(2));
}

//Draw the shares value graph
function drawSharesValueGraph(newAktienCourse, time) {

    let height = document.getElementById('stockMarket').scrollHeight;
    let width = document.getElementById('stockMarket').scrollWidth;

    let modiviedAktienCOurseForDrawing = newAktienCourse * (height / 235);

    canvas.lineTo(time * (width / maxGameTimeSec), modiviedAktienCOurseForDrawing);
    canvas.stroke();
}

//Get the value of new shares from the database
function getNewShareValue() {
    let username = $("#username").val();
    $.post('aktienkurs.php', { postShareCourse: 1, postUsername: username }, function(data) {
        shareValue = data;
    });
}

//Get the amount of owned shares from the database
function getAmountOfShares() {
    $.post('transaktionen.php', { postGetShares: 1 }, function(newShareAmount) {
        amountOfSharesOwned = newShareAmount;
    });
}

//Get the amount of owned money from the database
function getAmountOfMoneyOwned() {
    $.post('transaktionen.php', { postGetMoney: 1 }, function(newMoneyAmount) {
        amountMoney = newMoneyAmount;
    });
}