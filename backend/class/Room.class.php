<?php

require_once 'User.class.php';
require_once 'Game.class.php';

class Room implements JsonSerializable
{
    private $id;
    private $name;
    private $creator;
    private $modified;
    private $moveCount;
    private $game;

    private function __construct()
    {
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'creator' => $this->creator,
            'modified' => $this->modified,
            'moveCount' => $this->moveCount,
            'game' => $this->game
        ];
    }

    public static function getRoom($id) {
        $stmt = globalDB()->prepare(
            'SELECT *, user.username FROM rooms JOIN user ON rooms.creator = user.id WHERE rooms.id = :id'
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception("Room $id not found");
        }

        $creator = new User($row->creator, $row->username);
        $game = unserialize($row->game);

        $room = new Room;
        $room->id = $id;
        $room->name = $row->name;
        $room->creator = $creator;
        $room->modified = $row->modified;
        $room->moveCount = $row->moveCount;
        $room->game = $game;
        return $room;
    }

    public static function createRoom($user, $payload) {
        // Validate input
        $name = validate($payload->name, 'name');
        $w = validate($payload->size, 'roomsize');
        $h = $w;
        $density = validate($payload->density, 'density');
        $game = Game::generate($w, $h, $density);

        // TODO: check is roomname exists
        // check if username exists
        if (globalDB()->simpleQuery(
            'SELECT id FROM rooms WHERE name = ?',
            [$name])) {
            throw new Exception('Roomname exists.');
            }

        // TODO: generate with a fix seed and store the seed in params too
        $params = ['size' => $w, 'density' => $density];
        // Insert into DB
        $stmt = globalDB()->prepare(
            'INSERT INTO rooms (name, creator, params, modified, moveCount, game)
               VALUES (:name, :creator, :params, :modified, :moveCount, :game)'
        );
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':creator', $user->getId());
        $stmt->bindValue(':params', json_encode($params));
        $stmt->bindValue(':modified', time(), PDO::PARAM_INT);
        $stmt->bindValue(':moveCount', 0, PDO::PARAM_INT);
        $stmt->bindValue(':game', serialize($game), PDO::PARAM_LOB);
        $stmt->execute();
        $id = globalDB()->lastInsertId();

        return Room::getRoom($id);
    }

    public static function listRooms() {
        $rooms = [];

        $stmt = globalDB()->executeQuery(
            'SELECT rooms.id, name, creator, params, modified, user.username
               FROM rooms JOIN user ON user.id = rooms.creator
               ORDER BY modified DESC LIMIT 10'
        );

        while ($row = $stmt->fetch()) {
            $user = new User($row->creator, $row->username);
            $params = json_decode($row->params);
            $rooms[] = [
                'id' => $row->id,
                'name' => $row->name,
                'size' => $params->size,
                'modified' => $row->modified,
                'user' => $user,
            ];
        }

        return $rooms;
    }
}
