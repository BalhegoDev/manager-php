<?php
require_once("../model/excel.php");

use model\Excel;

$request_method = $_SERVER['REQUEST_METHOD'];
$excel = new Excel();


if($request_method == "POST"){
    $fileName = $_FILES['csvFile']['name'];
    $file = $_FILES['csvFile']["tmp_name"];
    echo $excel->uploadFile($fileName,$file);
}