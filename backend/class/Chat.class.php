<?php
// TODO: why? how? wtf?
require_once 'functions.php';

class Chat
{

    public static function getMessages()
    {
        $messages = [];
        $stmt = globalDB()->query('SELECT * FROM messages ORDER BY id DESC LIMIT 10');

        while ($row = $stmt->fetch()) {
            // we want to save the fetched rows in reverse order
            // so it is easy to display the newest chat message last at the bottom of the chat app
            // Option: we could have handle this clientside reversing the response array
            // in that case it would be here a simple: $messages[]=$row; without unshift
            array_unshift($messages, $row);
        }
        return $messages;
    }

    public static function addMessage($user, $data)
    {
        // TODO: validate!

        $id = globalDB()->insert('messages', ['name' => $user->getName(), 'content' => $data->content]);
        return $id;
    }
}
