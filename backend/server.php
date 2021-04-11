<?php
require_once 'load.php';
require_once 'class/Game.class.php';

header('Content-Type: application/json');
// header('Content-Type: text/plain');  // at developing and testing with print_r


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

// $w = 5;
// $h = 5;

$game = Game::generate($w, $h, $density);

// Our server response
echo json_encode(array(
    'ok' => true,
    // 'error' => 'valami',
    'room' => array(
        'id' => 1,
        'name' => 'main',
        'game' => $game->export()
    )
));
