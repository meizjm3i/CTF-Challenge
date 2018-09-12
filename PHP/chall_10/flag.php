<?php
$FLAG = file_get_contents("./flag");

function getFlag(){
    global $FLAG;
    echo $FLAG;
}