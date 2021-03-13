<?php
header('Content-Type: application/json');
// header('Content-Type: text/plain');  // at developing and testing with print_r

// We use this templates to define the room tiles from the random generated wall connections
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
    // First we decide which walls are connected in the room
    // We use an array for vertical walls and an array for the horizontal walls
    $vWalls = array();
    // Make a h x (w+1) array filled with zeros
    for ($r = 0; $r < $h; $r++) {
        $vWalls[] = array_fill(0, $w + 1, 0);
    }
    // Randomize the values only of the inner walls
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
    // Randomize the values only of the inner walls
    for ($r = 1; $r < $h; $r++) {
        for ($c = 0; $c < $w; $c++) {
            $hWalls[$r][$c] = rand(0, 1);
        }
    }
    // Create tiles
    $tiles = array();
    for ($r = 0; $r < $h; $r++) {
        $row = array();
        for ($c = 0; $c < $w; $c++) {
            // The tile connections-string comes from the vertical and horizontal collection of walls
            $t = '';
            $t .= $hWalls[$r][$c];
            $t .= $vWalls[$r][$c + 1];
            $t .= $hWalls[$r + 1][$c];
            $t .= $vWalls[$r][$c];
            // peek from template the default image and default connection using the tile connections-string
            global $templates;
            $image = $templates[$t]['image'];
            $connections = $templates[$t]['connections'];
            // define random rotation to the tiles
            $rotation = rand(0,3);
            // fill the tiles in the row array
            $row[] = array('image' => $image, 'connections' => $connections, 'rotation' => $rotation);
        }
        // fill the rows in the tiles array
        $tiles[] = $row;
    }
    // print_r($tiles);
    return $tiles;
}

$w = 4;
$h = 4;

// Our server response
echo json_encode(array(
    'ok' => true,
    'room' => array('id' => 1, 'name' => 'main', 'w' => $w, 'h' => $h, 'tiles' => createRoom($w, $h))
));
