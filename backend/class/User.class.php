<?php
require_once 'DB.class.php';

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

        // check if username exists
        if (globalDB()->simpleQuery(
            'SELECT id FROM user WHERE username = ?',
            [$name])) {
            throw new Exception('Username exists.');
        }

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

    public static function changePassword($payload, $user)
    {
        // Validate input
        $password = validate($payload->password, 'password');
        $newpassword = validate($payload->newpassword, 'password');

        // Check password
        $oldHash = globalDB()->simpleQuery(
            'SELECT password FROM user WHERE username = ?',
            [$user->getName()]
        );

        if (!password_verify($password, $oldHash)) {
            throw new Exception('Incorrect password');
        }

        // Update DB
        $passwordHash = password_hash($newpassword, PASSWORD_DEFAULT);
        globalDB()->executeQuery(
            'UPDATE user SET password = ? WHERE username = ?',
            [$passwordHash, $user->getName()]
        );
    }
}
