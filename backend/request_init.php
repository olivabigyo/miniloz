<?php
// we handle requests from anyone
// TODO: This doesn't work with credentials: include
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    // We have set all the necessary CORS headers, just return.
    exit;
}

function exitWithError($errorMessage)
{
    echo json_encode(array('ok' => false, 'error' => $errorMessage));
    exit;
}

if ($method !== 'POST') {
    exitWithError('Only POST requests allowed');
}

$request = json_decode(file_get_contents('php://input'));
$action = $request->action;
$payload = $request->payload;

$validActions = array(
    // user handling
    'login',
    'createUser',
    // chat
    'getMessages',
    'addMessage',
    // game
    'getNewRoom',
);

if (!in_array($action, $validActions)) {
    exitWithError('Unrecognized action');
}

session_start(array(
    // use different cookie from the default PHPSESSID
    'name' => 'LOOPSSESSID',
    // JS should not access the session cookie
    'cookie_httponly' => true,
));
