<?php
require_once("../model/excel.php");
use model\Excel;

$request_method = $_SERVER['REQUEST_METHOD'];
$excel = new Excel();

if($request_method == "POST"){
    $data = json_decode(file_get_contents("php://input"),true);
    $excel->downloadSheet($data);
}
