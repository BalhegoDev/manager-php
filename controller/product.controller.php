<?php 
use model\ProductMethods;

require_once("../model/products.php");

$methods = new ProductMethods();
$request_method = $_SERVER['REQUEST_METHOD'];

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

if($request_method == "GET"){
    echo $methods->getProduts();
}else if($request_method == "POST"){
    $input = json_decode(file_get_contents('php://input'), true);
    $methods->postProduct($input['product_name'],$input['price'],$input['quantity']);
    header("Location: ../");
}else if($request_method == "DELETE"){
    echo $methods->deleteProduct($_GET['product_id']);
}else if($request_method == "PATCH"){
    $data = json_decode(file_get_contents("php://input"),true);
    echo $methods->updateProduct($data["product_id"],$data["new_product_name"],$data["price_per_item"],$data["quantity"]);
}