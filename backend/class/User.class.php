<?php

class User implements JsonSerializable
{
    private $id;
    private $name;

    private function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function jsonSerialize() {
        return [ 'id' => $this->id, 'name' => $this->name ];
    }

    public static function createUser($payload)
    {
        // TODO: validate!
        $password = password_hash($payload->password, PASSWORD_DEFAULT);
        $id = globalDB()->insert(
            'user',
            ['username' => $payload->name, 'password' => $password]
        );
        return ['id' => $id];
    }

    public static function login($payload)
    {
        $stmt = globalDB()->executeQuery(
            'SELECT * FROM user WHERE username = ?',
            [$payload->name]
        );
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception('No such user');
        }
        if (!password_verify($payload->password, $row->password)) {
            throw new Exception('Incorrect password');
        }

        $_SESSION['user'] = $row->username;
        $_SESSION['userId'] = $row->id;

        return new User($row->id, $row->username);
    }

    public static function logout() {
        // Destroy the cookie
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 3600, $params['path'], $params['domain'], $params['secure'], isset($params['httponly']));
        // Terminate the session
        session_destroy();
        session_write_close();
    }

    public static function requireLogin()
    {
        if (!isset($_SESSION['user']) || !isset($_SESSION['userId'])) {
            throw new Exception('Login required');
        }
        return new User($_SESSION['userId'], $_SESSION['user']);
    }

    // public static function byId($id) {
    //     // from DB...
    // }
}
