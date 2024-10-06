<?php
namespace model;
require '../vendor/autoload.php';

use GuzzleHttp\Client;

class ProductMethods{
    
    public function getProduts(){
        $client = new Client();
        $response = $client->request('GET', 'http://localhost:3000/products');
        $body = $response->getBody();  // Verifica se a resposta não está vazia
        if (empty($body)) {
            return ['error' => 'Resposta vazia'];
        }
        $decodedBody = json_decode($body, true);

        return json_encode($decodedBody);
    }

    public function postProduct(string $product_name, float $price_per_item, int $quantity){
        $client = new Client();

        $post_data = [
            "product_name" => $product_name,
            "quantity" => $quantity,
            "price_per_item" => $price_per_item,
            "time_submited" => date("Y-m-d H:i:s"),
            "total_value" => $price_per_item * $quantity
        ];
        
        $client->post("localhost:3000/products",[
            'json' => $post_data
        ]);
    }

    public function deleteProduct(string $product_id):bool{
        $client = new Client();
        $response = $client->delete("http://localhost:3000/products/$product_id");
        if($response->getStatusCode() != 200) return false;
        return true;
    }

    public function updateProduct(string $product_id, string $new_product_name, float $price_per_item, int $quantity){
        $client = new Client();

        $data = [
            "product_name" => $new_product_name,
            "price_per_item" => $price_per_item,
            "quantity" => $quantity,
            "total_value" => $price_per_item * $quantity
        ];

        $client->patch("http://localhost:3000/products/$product_id", [
            'json' => $data
        ]);
    }
}
