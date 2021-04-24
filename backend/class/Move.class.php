<?php
class Move {
    public $r;
    public $c;
    public $rot;

    public function __construct($r, $c, $rot)
    {
        $this->r = $r;
        $this->c = $c;
        $this->rot = $rot;
    }
}
