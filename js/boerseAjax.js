let request = new XMLHttpRequest();
let shareValue;
let amountOfSharesOwned;
let amountMoney;

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

function stopGame() {
    clearInterval(runningGame);
}



function buyShares(amount) {

    $.buyShares('aktienkurs.php', { postShareCourse: 2 }, function(shareValue) {
        $.buyShares('transaktion.php', { postShareValue: shareValue, postUsername: username, postAmount: amount, postKind: "buy" }, function() {});
    });

    getAmountOfShares()
    $('#amountAktien').text(amountOfSharesOwned);
    getAmountOfMoneyOwned()
    $('#capital').text(parseFloat(amountMoney));
}

function sellShares(amount) {

    $.sellShares('aktienkurs.php', { postShareCourse: 2 }, function(shareValue) {
        $.sellShares('transaktion.php', { postShareValue: shareValue, postUsername: username, postAmount: amount, postKind: "sell" }, function() {});
    });

    getAmountOfShares()
    $('#amountAktien').text(amountOfSharesOwned);
    getAmountOfMoneyOwned()
    $('#capital').text(parseFloat(amountMoney));

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
    $('#aktienBuyingCost').text((calculateFee(parseInt($("#aktienCount").val())) - (-parseInt($("#aktienCount").val())) * shareValue || 0).toFixed(2));
    $('#aktienSellingCost').text(((parseInt($("#aktienCount").val())) * shareValue - calculateFee(parseInt($("#aktienCount").val())) || 0).toFixed(2));
}

function drawSharesValueGraph(newAktienCourse, time) {

    let height = document.getElementById('stockMarket').scrollHeight;
    let width = document.getElementById('stockMarket').scrollWidth;

    let modiviedAktienCOurseForDrawing = newAktienCourse * (height / 235);

    canvas.lineTo(time * (width / maxGameTimeSec), modiviedAktienCOurseForDrawing);
    canvas.stroke();
    console.log(height);
}

function getNewShareValue() {
    let username = document.getElementById("username").val();
    $.getNewShareValue('aktienkurs.php', { postShareCourse: 1, postUsername: username }, function(newShareValue) {
        shareValue = newShareValue;
    });
}

function getAmountOfShares() {
    $.getAmountOfShares('transaktionen.php', { postGetShares: 1 }, function(newShareAmount) {
        amountOfSharesOwned = newShareAmount;
    });
}

function getAmountOfMoneyOwned() {
    $.getAmountOfMoneyOwned('transaktionen.php', { postGetMoney: 1 }, function(newMoneyAmount) {
        amountMoney = newMoneyAmount;
    });
}

/* request.onload = getNewShareValue;
request.open('GET', 'aktienkurs.php');
request.send(); */