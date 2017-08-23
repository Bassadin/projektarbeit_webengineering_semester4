<?php

$servername="localhost";
$user="root";
$password="";
$database="project";

$conn=mysql_connect($servername,$user,$password,$database) or die("Fehler: ". mysql_error($conn));


$numberOfRise;
$numberOfFall;


function calculateCourseChange($likeliness) {
    
    $changeAmount = rand(1, 15) / 100; // number between 0.01 and 0.015
     $riseOrFall = rand(0, 100);

    if ($riseOrFall <= 100 * $likeliness) {
        return $changeAmount;
    } else {
        return $changeAmount * -1;
    }
}


function sharesCourseChange($sharesValue) {
    
        $courseChange;
    
        if ($numberOfRise > 2 || $numberOfFall > 2) {
    
            if ($numberOfRise > 2) {
                $courseChange = calculateCourseChange(0.75);
            } else {
                $courseChange = calculateCourseChange(0.25);
            }
    
        } else {
            $courseChange = calculateCourseChange(0.5);
        }
    
        if ($sharesValue < ($sharesValue + $courseChange)) {
            $numberOfRise = 0;
            $numberOfFall = $numberOfFall + 1;
        } else {
            $numberOfRise = $numberOfRise + 1;
            $numberOfFall = 0;
        }
    
        $newAktienPrice = ($sharesValue+ $courseChange);
        if ($newAktienPrice < 1) { $newAktienPrice = 1; }
        return $newAktienPrice;
    }








$sql = "SELECT count(*) from sharevalue";
$result = mysql_query($sql,$conn);
$row = mysql_fetch_row($result);

if (is_null($row[0])) {
    $sql= "INSERT INTO sharevalue (share) VALUES (100)";
}else {
    
$kindOfAction =  $_POST['postShareCourse'];



if (kindOfAction==2) {
    $sql = "SELECT share FROM sharevalue ORDER BY id DESC LIMIT 1";
    $result = mysql_query($sql,$conn);
    $row = mysql_fetch_row($result);
    echo $row[0];

}elseif (kindOfAction==1) {
    
    $sql = "SELECT share FROM sharevalue ORDER BY id DESC LIMIT 1";
    $result = mysql_query($sql,$conn);
    $row = mysql_fetch_row($result);

    $shareValue = sharesCourseChange($row[0])

    $username =  $_POST['postUsername'];

    $sql= "INSERT INTO sharevalue (share,username) VALUES ($shareValue,$username)";
    
    $sql = "SELECT share FROM sharevalue ORDER BY id DESC LIMIT 1";
    $result = mysql_query($sql,$conn);
    $row = mysql_fetch_row($result);
    echo $row[0];
}

}
>



