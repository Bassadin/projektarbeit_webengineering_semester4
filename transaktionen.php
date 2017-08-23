<?php

$link=mysql_connect("host","user","password","datenbank") or die("Fehler: ". mysql_error($link));
htmlspecialchars($string, ENT_NOQUOTES|ENT_QUOTES);//Verhindert html code attacken  
>


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

function calculateFee(amount) {

    if ((5 - (-1) * 0.05 * amount * shareValue > 60)) {
        return 60;
    } else {
        return (5 - (-1) * 0.05 * amount * shareValue);
    }
}