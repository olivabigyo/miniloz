<?php
header('Content-Type: application/json');
// header('Content-Type: text/plain');

function exitWithError($errorMessage)
{
    echo json_encode(array('ok' => false, 'error' => $errorMessage));
    exit;
}

// $request = json_decode(file_get_contents('php://input'));

$templates = array(
    '0000' => array('image' => 'null.svg', 'connections' => '0000'),
    '0001' => array('image' => 'one.svg', 'connections' => '0100'),
    '0010' => array('image' => 'one.svg', 'connections' => '0100'),
    '0100' => array('image' => 'one.svg', 'connections' => '0100'),
    '1000' => array('image' => 'one.svg', 'connections' => '0100'),
    '1100' => array('image' => 'two.svg', 'connections' => '1001'),
    '0110' => array('image' => 'two.svg', 'connections' => '1001'),
    '0011' => array('image' => 'two.svg', 'connections' => '1001'),
    '1001' => array('image' => 'two.svg', 'connections' => '1001'),
    '1010' => array('image' => 'two-straight.svg', 'connections' => '0101'),
    '0101' => array('image' => 'two-straight.svg', 'connections' => '0101'),
    '1110' => array('image' => 'three.svg', 'connections' => '1011'),
    '0111' => array('image' => 'three.svg', 'connections' => '1011'),
    '1011' => array('image' => 'three.svg', 'connections' => '1011'),
    '1101' => array('image' => 'three.svg', 'connections' => '1011'),
    '1111' => array('image' => 'four.svg', 'connections' => '1111'),
);



function createRoom($w, $h)
{
    $vWalls = array();
    // Make a h x (w+1) array filled with zeros
    for ($r = 0; $r < $h; $r++) {
        $vWalls[] = array_fill(0, $w + 1, 0);
    }
    // Randomize the values
    for ($r = 0; $r < $h; $r++) {
        for ($c = 1; $c < $w; $c++) {
            $vWalls[$r][$c] = rand(0, 1);
        }
    }
    $hWalls = array();
    // Make a (h+1) x w array filled with zeros
    for ($r = 0; $r < $h + 1; $r++) {
        $hWalls[] = array_fill(0, $w, 0);
    }
    for ($r = 1; $r < $h; $r++) {
        for ($c = 0; $c < $w; $c++) {
            $hWalls[$r][$c] = rand(0, 1);
        }
    }
    $tiles = array();
    for ($r = 0; $r < $h; $r++) {
        $row = array();
        for ($c = 0; $c < $w; $c++) {
            $t = '';
            $t .= $hWalls[$r][$c];
            $t .= $vWalls[$r][$c + 1];
            $t .= $hWalls[$r + 1][$c];
            $t .= $vWalls[$r][$c];
            global $templates;
            $image = $templates[$t]['image'];
            $connections = $templates[$t]['connections'];
            $row[] = array('image' => $image, 'connections' => $connections, 'rotation' => rand(0, 3));
        }
        $tiles[] = $row;
    }
    // print_r($tiles);
    return $tiles;
}

$w = 4;
$h = 4;
echo json_encode(array(
    'ok' => true,
    'room' => array('id' => 1, 'name' => 'main', 'w' => $w, 'h' => $h, 'tiles' => createRoom($w, $h))
));
