<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require  '../src/config/Db.php';

$app = new \Slim\App;

require '../src/routes/vehicles.php';

// Run app
$app->run();