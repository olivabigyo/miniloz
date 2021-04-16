<?php
require_once 'request_init.php';

require_once 'load.php';
require_once 'class/Game.class.php';
require_once 'class/User.class.php';

if ($action === 'getNewRoom') {
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
}
if ($action === 'createUser') {
    try {
        echo json_encode(array(
            'ok'=> true,
            'result' => User::createUser($payload)
        ));
    } catch (Exception $e) {
        exitWithError($e->getMessage());
    }
}

if ($action === 'getMessages') {
    $messages = array();

    try {
        // this is a query without client side parameters, we don't need to make prepared statement
        // a simple query is enough
        $stmt = $db->query('SELECT * FROM messages ORDER BY id DESC LIMIT 10');
        // note that we ask for the last 10 entry in descending order
        // we will get the last(and newest) 'id' first

        while ($row = $stmt->fetch()) {
            // we want to save the fetched rows in reverse order
            // so it is easy to display the newest chat message last at the bottom of the chat app
            // Option: we could have handle this clientside in the code.js reversing the response array
            // in that case it would be here a simple: $messages[]=$row; without unshift
            array_unshift($messages, $row);
        }
    } catch (PDOException $e) {
        // error handling: return with feedback
        exitWithError("SELECT failed: " . $e->getMessage());
    }

    // our response is a JSON object with fields 'ok' and the fetched array as 'messages'
    // tricky Q: which does what  echo, echo and exit or return  ???
    echo json_encode(array('ok' => true, 'messages' => $messages));
    exit;
}

if ($action === 'addMessage') {
    try {
        // we have client side parameters in this query, we need to use prepared statement
        // we use :placeholders at preparing the query
        // it could be made the short way with VALUES (?,?)
        $stmt = $db->prepare('INSERT INTO messages (name, content) VALUES (:name, :content)');

        // Option A:
        // because we know that the payload has a name key and a content key
        // by executing the prepared statement we present an array to populate the placeholders
        // again: -> is like . in JS
        // we convert the json object to array
        $parametersToBind = (array) $request->payload;
        $stmt->execute($parametersToBind);

        // Option B: Alternatively
        // $payload = $request->payload;
        // $stmt->bindValue(':name', $payload->name);
        // $stmt->bindValue(':content', $payload->content);
        // $stmt->execute();
    } catch (PDOException $e) {
        exitWithError("INSERT failed: " . $e->getMessage());
    }
    // We only return an ok
    // we could have return the new id but let's keep it simple...
    echo json_encode(array('ok' => true));
    exit;
}
