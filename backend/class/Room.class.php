<?php

require_once 'User.class.php';
require_once 'Game.class.php';
require_once 'Move.class.php';

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

    public static function getRoom($id)
    {
        $stmt = globalDB()->prepare(
            'SELECT *, user.username FROM rooms JOIN user ON rooms.creator = user.id WHERE rooms.id = :id'
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception("Room #$id not found");
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

    public static function createRoom($user, $payload)
    {
        // Validate input
        $name = validate($payload->name, 'name');
        $w = validate($payload->size, 'roomsize');
        $h = $w;
        $density = validate($payload->density, 'density');
        $game = Game::generate($w, $h, $density);

        // check if roomname exists
        if (globalDB()->simpleQuery(
            'SELECT id FROM rooms WHERE name = ?',
            [$name]
        )) {
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

        return $id;
    }

    public static function listRooms()
    {
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

    public static function makeMove($user, $payload)
    {
        $db = globalDB();
        $db->beginTransaction();

        $roomId = $payload->roomId;

        $stmt = globalDB()->prepare(
            'SELECT * FROM rooms WHERE rooms.id = :id FOR UPDATE'
        );
        $stmt->bindValue(':id', $roomId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        if (!$row) {
            exitWithError("Room #$roomId not found");
        }

        $game = unserialize($row->game);
        $moveCount = $row->moveCount;

        $r = $payload->r;
        $c = $payload->c;
        $rot = $payload->rot;
        // This also validates the parameters:
        $game->makeMove($r, $c, $rot);

        // INSERT the move into the moves table
        $move = new Move($r, $c, $rot);
        $stmt = $db->prepare('INSERT INTO moves (room, user, moveNumber, move)
                              VALUES (:room, :user, :moveNumber, :move)');
        $stmt->bindValue(':room', $roomId, PDO::PARAM_INT);
        $stmt->bindValue(':user', $user->getId(), PDO::PARAM_INT);
        $stmt->bindValue(':moveNumber', $moveCount, PDO::PARAM_INT);
        $stmt->bindValue(':move', serialize($move), PDO::PARAM_LOB);
        $stmt->execute();

        // UPDATE the game state
        $stmt = $db->prepare('UPDATE rooms SET modified = :modified, moveCount = :moveCount, game = :game
                              WHERE id = :id');
        $stmt->bindValue(':modified', time(), PDO::PARAM_INT);
        $stmt->bindValue(':moveCount', $moveCount+1, PDO::PARAM_INT);
        $stmt->bindValue(':game', serialize($game), PDO::PARAM_LOB);
        $stmt->bindValue(':id', $roomId, PDO::PARAM_INT);
        $stmt->execute();

        $db->commit();
    }

    public static function getMoves($payload) {
        $stmt = globalDB()->prepare('SELECT move FROM moves
                                     WHERE room = :room AND moveNumber >= :moveNumber
                                     ORDER BY moveNumber ASC LIMIT 20');
        $stmt->bindValue(':room', $payload->roomId, PDO::PARAM_INT);
        $stmt->bindValue(':moveNumber', $payload->fromMove, PDO::PARAM_INT);
        $stmt->execute();
        $moves = [];
        while ($move = $stmt->fetchColumn()) {
            $moves[] = unserialize($move);
        }
        return $moves;
    }
}
