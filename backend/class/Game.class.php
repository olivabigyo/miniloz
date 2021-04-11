<?php
require_once 'Tile.class.php';

class Game
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
        // TODO: hasznalni a $densityt

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

    public function export()
    {
        $tiles = array();
        foreach ($this->tiles as $tilesRow) {
            $row = array();
            foreach ($tilesRow as $tile) {
                $row[] = $tile->export();
            }
            $tiles[] = $row;
        }
        return array(
            'w' => $this->w,
            'h' => $this->h,
            'tiles' => $tiles
        );
    }
}
