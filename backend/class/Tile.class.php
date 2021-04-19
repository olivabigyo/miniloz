<?php
class Tile implements JsonSerializable
{
    // We use this templates to define the room tiles from the random generated wall connections
    // The connection string represents the connection of the tile in top-right-bottom-left order
    static private $templates = array(
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
    private $image;
    private $conns;
    private $rot;

    public function __construct($connections)
    {
        $template = Tile::$templates[$connections];
        $this->image = $template['image'];
        $this->conns = $template['connections'];
        // TODO: add rotation to templates
        $this->rot = 0;
    }

    public function randomizeRotation()
    {
        $this->rot = rand(0, 3);
    }

    public function jsonSerialize()
    {
        return array(
            'image' => $this->image,
            'connections' => $this->conns,
            'rotation' => $this->rot
        );
    }
}
