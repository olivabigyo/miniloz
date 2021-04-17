<?php
require_once 'request_init.php';

require_once 'load.php';
require_once 'class/Game.class.php';
require_once 'class/User.class.php';
require_once 'class/Chat.class.php';

// User stuff
if ($action === 'createUser') {
    try {
        echo json_encode(array(
            'ok' => true,
            'result' => User::createUser($payload)
        ));
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}

if ($action === 'login') {
    try {
        echo json_encode(array(
            'ok' => true,
            'user' => User::login($payload)
        ));
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}

if ($action === 'logout') {
    try {
        User::logout();
        echo json_encode(array(
            'ok' => true
        ));
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}

// Game stuff
if ($action === 'getNewRoom') {
    try {
        $user = User::requireLogin();

        $w = $payload->size;
        $h = $w;
        $density = $payload->density;

        $game = Game::generate($w, $h, $density);

        // Our server response
        echo json_encode(array(
            'ok' => true,
            'room' => array(
                'id' => 1,
                'name' => 'main',
                'game' => $game
            )
        ));
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}

// Chat stuff
if ($action === 'getMessages') {
    try {
        echo json_encode([
            'ok' => true,
            'messages' => Chat::getMessages()
        ]);
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}

if ($action === 'addMessage') {
    try {
        echo json_encode([
            'ok' => true,
            'id' => Chat::addMessage($payload)
        ]);
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}
