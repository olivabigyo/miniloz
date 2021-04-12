<?php
require_once 'load.php';
require_once 'class/Game.class.php';

// we handle requests from anyone
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    // We have set all the necessary CORS headers, just return.
    exit;
}

if ($method !== 'POST') {
    echo json_encode(array('ok' => false, 'error' => 'Only POST requests allowed'));
    exit;
}

$request = json_decode(file_get_contents('php://input'));
$action = $request->action;
$payload = $request->payload;

if ($action !== 'getNewRoom') {
    echo json_encode(array(
        'error' => 'Unrecognized action'
    ));
    exit;
}

$w = $payload->size;
$h = $w;
$density = $payload->density;

$game = Game::generate($w, $h, $density);

// Our server response
echo json_encode(array(
    'ok' => true,
    // 'error' => 'valami',
    'room' => array(
        'id' => 1,
        'name' => 'main',
        'game' => $game
    )
));
