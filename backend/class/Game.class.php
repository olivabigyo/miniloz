<?php
require_once 'Tile.class.php';

class Game implements JsonSerializable
{
    private $w;
    private $h;
    private $tiles;

    private function __construct($w, $h, $tiles)
    {
        $this->w = $w;
        $this->h = $h;
        $this->tiles = $tiles;
    }

    public static function generate($w, $h, $density)
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
                $vWalls[$r][$c] = intval(rand(0, 100) <= $density);
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
                $hWalls[$r][$c] = intval(rand(0, 100) <= $density);
            }
        }
        // Create tiles
        $tiles = array();
        for ($r = 0; $r < $h; $r++) {
            $row = array();
            for ($c = 0; $c < $w; $c++) {
                // The tile connections-string comes from the vertical and horizontal collection of walls
                // It represents the connection of the tile in top-right-bottom-left order
                $t = '';
                $t .= $hWalls[$r][$c];
                $t .= $vWalls[$r][$c + 1];
                $t .= $hWalls[$r + 1][$c];
                $t .= $vWalls[$r][$c];

                $tile = new Tile($t);
                $tile->randomizeRotation();
                // fill the tiles in the row array
                $row[] = $tile;
            }
            // fill the rows in the tiles array
            $tiles[] = $row;
        }
        return new Game($w, $h, $tiles);
    }

    public function jsonSerialize()
    {
        $tiles = array();
        foreach ($this->tiles as $tilesRow) {
            $row = array();
            foreach ($tilesRow as $tile) {
                $row[] = $tile->jsonSerialize();
            }
            $tiles[] = $row;
        }
        return array(
            'w' => $this->w,
            'h' => $this->h,
            'tiles' => $tiles
        );
    }

    // Validates the parameters
    public function makeMove($r, $c, $rot)
    {
        if (
            $r < 0 || $r >= $this->h ||
            $c < 0 || $c >= $this->w ||
            $rot < -3 || $rot > 3
        ) {
            exitWithError('Invalid move');
        }

        $this->tiles[$r][$c]->rotate($rot);
    }
}
