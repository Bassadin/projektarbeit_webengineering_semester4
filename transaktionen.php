<?php
$servername="localhost";
$user="root";
$password="";
$database="project";

$conn=mysql_connect($servername,$user,$password,$database) or die("Fehler: ". mysql_error($conn));


$shareValue =  $_POST['postShareValue'];
$username =  $_POST['postUsername'];
$amount =  $_POST['postAmount'];
$kind =  $_POST['postKind'];

function calculateFee($amountForCalc) {
    
        if ((5 - (-1) * 0.05 * $amountForCalc * $shareValue > 60)) {
            return 60;
        } else {
            return (5 - (-1) * 0.05 * $amountForCalc * $shareValue);
        }
    }

    function buyShares($amountBuy) {
          
        $fee = calculateFee($amountBuy);
           
        if (!$amountBuy == 0) {
                if (($amountBuy * $shareValue - (-1) * $fee) >   $amountMoney) {
                    echo "Sie besitzen nicht genügend Geld um die Aktien zu kaufen!";
                } else {
                    echo "";
                    
                    $amountMoney = round(  $amountMoney -  $fee - $amountBuy * $shareValue,2);
                    $amountOfSharesOwned = $amountOfSharesOwned + $amountBuy;
                }
            }
        
        }

        function sellShares($amountSell) {

            if (!$amountSell == 0) {
                if ($amountSell > $amountOfSharesOwned ) {
                    echo "Sie können nicht mehr Aktien verkaufen als Sie besitzen!";
                } else {
                    echo "";

                    $amountMoney = round($amountMoney - calculateFee($amountSell) - (-$amountSell) * $shareValue,2);
                    $amountOfSharesOwned  = $amountOfSharesOwned  - $amountSell;
                }
            }
        }




        $amountMoney = "SELECT moneyAmount FROM transaktions ORDER BY id DESC LIMIT 1";
        $amountOfSharesOwned = "SELECT amountShares FROM transaktions ORDER BY id DESC LIMIT 1";     

if ($kind == "sell" || $kind == "buy") {

    if ($kind == "sell") {
        sellShares($amountSell);
    }else if($kind == "buy"){
        buyShares($amountBuy);
    }
    
    $sql= "INSERT INTO transaktions (kindOfTransaktion, shareValue ,amount ,fee,username,moneyAmount,amountShares) 
    VALUES ($kind,$shareValue,$amountBuy, $fee,$username,$amountMoney,$amountOfSharesOwned )";
}

>



