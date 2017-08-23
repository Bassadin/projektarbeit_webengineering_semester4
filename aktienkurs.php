<?php
$link=mysql_connect("host","user","password","datenbank") or die("Fehler: ". mysql_error($link));
htmlspecialchars($string, ENT_NOQUOTES|ENT_QUOTES);//Verhindert html code attacken  

>



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
    shareValue = newAktienPrice;
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