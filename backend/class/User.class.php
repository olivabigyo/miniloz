<?php

class User implements JsonSerializable
{
    private $id;
    private $name;

    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getId()
    {
        return $this->id;
    }

    public function jsonSerialize()
    {
        return ['id' => $this->id, 'name' => $this->name];
    }

    public static function createUser($payload)
    {
        // Validate input
        $name = validate($payload->name, 'name');
        $password = validate($payload->password, 'password');

        // TODO: check if username exists

        // Insert in DB
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $id = globalDB()->insert(
            'user',
            ['username' => $name, 'password' => $passwordHash]
        );
        // Write into session
        $_SESSION['user'] = $payload->name;
        $_SESSION['userId'] = $id;

        return new User($id, $payload->name);
    }

    public static function login($payload)
    {
        // Validate input
        $name = validate($payload->name, 'name');
        $password = validate($payload->password, 'password');
        // Check username
        $stmt = globalDB()->executeQuery(
            'SELECT * FROM user WHERE username = ?',
            [$name]
        );
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception('No such user');
        }
        // Check password
        if (!password_verify($password, $row->password)) {
            throw new Exception('Incorrect password');
        }
        // Write into session
        $_SESSION['user'] = $row->username;
        $_SESSION['userId'] = $row->id;

        return new User($row->id, $row->username);
    }

    public static function logout()
    {
        // Destroy the cookie
        $params = session_get_cookie_params();
        unset($params['lifetime']);
        setcookie(session_name(), '', $params);
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

    public static function checkLogin()
    {
        if (!isset($_SESSION['user']) || !isset($_SESSION['userId'])) {
            return false;
        }
        return new User($_SESSION['userId'], $_SESSION['user']);
    }

    public static function changePassword($payload)
    {
        // Validate input
        $name = validate($payload->name, 'name');
        $password = validate($payload->password, 'password');
        $newpassword = validate($payload->newpassword, 'password');
        $newpassword2 = validate($payload->newpassword2, 'password');
        // Check username
        if ($_SESSION['user'] != $name) {
            throw new Exception('Invalid user');
        }
        // Check password
        $stmt = globalDB()->executeQuery(
            'SELECT * FROM user WHERE username = ?',
            [$name]
        );
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception('No such user');
        }
        if (!password_verify($password, $row->password)) {
            throw new Exception('Incorrect password');
        }
        // Validate new passwords
        if ($newpassword != $newpassword2) {
            throw new Exception('Password and repeat password should match');
        }
        // Update DB
        $passwordHash = password_hash($newpassword, PASSWORD_DEFAULT);
        $stmt = globalDB()->executeQuery(
            'UPDATE user SET password=? WHERE username = ?',
            [$passwordHash, $name]
        );
        if (!$stmt) {
            throw new Exception('Something went wrong at updating password');
        }
        return new User($row->id, $row->username);
    }
    // public static function byId($id) {
    //     // from DB...
    // }
}
