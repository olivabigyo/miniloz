<?php
require_once 'load.php';
require_once 'class/Game.class.php';

header('Content-Type: application/json');
// header('Content-Type: text/plain');  // at developing and testing with print_r

$w = 5;
$h = 5;

$game = Game::generate($w, $h, 0.5);

// Our server response
echo json_encode(array(
    'ok' => true,
    'room' => array(
        'id' => 1,
        'name' => 'main',
        'game' => $game->export()
    )
));
