<?php
require_once 'request_init.php';

require_once 'load.php';
require_once 'class/Room.class.php';
require_once 'class/User.class.php';
require_once 'class/Chat.class.php';

function handleRequest($action, $payload)
{
    // User stuff
    if ($action === 'createUser') {
        return ['user' => User::createUser($payload)];
    }

    if ($action === 'login') {
        return ['user' => User::login($payload)];
    }

    if ($action === 'checkLogin') {
        $maybeUser = User::checkLogin();
        if ($maybeUser) {
            return ['loggedIn' => true, 'user' => $maybeUser];
        } else {
            return ['loggedIn' => false];
        }
    }

    if ($action === 'logout') {
        User::logout();
        return [];
    }

    // Things below here require a valid login
    $user = User::requireLogin();

    // Game stuff
    if ($action === 'getNewRoom') {
        $room = Room::createRoom($user, $payload);

        return ['room' => $room];
    }

    // Chat stuff
    if ($action === 'getMessages') {
        return ['messages' => Chat::getMessages()];
    }

    if ($action === 'addMessage') {
        return ['id' => Chat::addMessage($user, $payload)];
    }
}

try {
    $response = handleRequest($action, $payload);
    $response['ok'] = true;
    echo json_encode($response);
} catch (Exception $e) {
    exitWithError($e->getMessage());
}
