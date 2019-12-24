<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;


$app = new \Slim\App;

// GET
$app->get('/api/vehicles', function(Request $request, Response $response){
    $sql = "SELECT * FROM carshop.vehicles";
    try{
        $db = new Db();
        $db = $db->connectionDB();
        $result = $db->query($sql);
        if($result->rowCount() > 0):
            $vehicles = $result->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($vehicles);
        else:
                json_encode('There are no cars in the database');
        endif;

        $result = null;
        $db = null;

    }catch (PDOException $e){
        echo '{ "error": {"text":'.$e->getMessage().'}';
    }

});


// POST
$app->post('/api/vehicles/new', function(Request $request, Response $response){
    $model = $request->getParam('model');
    $brand = $request->getParam('brand');
    $yearCar = $request->getParam('yearCar');
    $price = $request->getParam('price');
    $description = $request->getParam('description');

    $sql = "INSERT INTO carshop.vehicles (model, brand, yearCar, price, description) VALUES (?, ?, ?, ?, ?)";
    try{
        $db = new Db();
        $db = $db->connectionDB();
        $result = $db->prepare($sql);

        $result->bindParam(1, $model);
        $result->bindParam(2, $brand);
        $result->bindParam(3, $yearCar);
        $result->bindParam(4, $price);
        $result->bindParam(5, $description);

        $result->execute();
        echo json_encode("New car successfully added");

        $result = null;
        $db = null;

    }catch (PDOException $e){
        echo '{ "error": {"text":'.$e->getMessage().'}';
    }

});


/*
// PUT
$app->put('/api/vehicles/modify/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    $model = $request->getParam('model');
    $brand = $request->getParam('brand');
    $yearCar = $request->getParam('yearCar');
    $price = $request->getParam('price');
    $description = $request->getParam('description');

    $sql = "UPDATE vehicles SET 
            model = :model, brand = :brand,
            yearCar = :yearCar, price = :price,
            description = :description
            WHERE id = $id
            ";


    try{
        $db = new Db();
        $db = $db->connectionDB();
        $result = $db->prepare($sql);

        $result->bindParam(':model', $model);
        $result->bindParam(':brand', $brand);
        $result->bindParam(':yearCar', $yearCar);
        $result->bindParam(':price', $price);
        $result->bindParam(':description', $description);

        $result->execute();
        echo json_encode("car information successfully modified");

        $result = null;
        $db = null;

    }catch (PDOException $e){
        echo '{ "error": {"text":'.$e->getMessage().'}';
    }
});


// DELETE
$app->delete('/api/vehicles/delete/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');

    $sql = "DELETE FROM vehicles WHERE id = $id ";

    try{
        $db = new Db();
        $db = $db->connectionDB();
        $result = $db->prepare($sql);
        $result->execute();
        if($result->rowCount() > 0):
            echo json_encode("car information successfully modified");
        else:
            echo json_encode("car information successfully modified");
        endif;

        $result = null;
        $db = null;

    }catch (PDOException $e){
        echo '{ "error": {"text":'.$e->getMessage().'}';
    }
});

*/
