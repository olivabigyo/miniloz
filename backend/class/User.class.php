<?php
class User
{
    public function __construct()
    {
    }

    public static function createUser($payload)
    {
        // TODO: validate!
        global $db;
        $id = $db->insert(
            'user',
            ['username' => $payload->name, 'password' => $payload->password]
        );
        return ['id' => $id];
    }
}
