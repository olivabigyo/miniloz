<?php
// we handle requests from anyone
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
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

// Parse the client request.
$request = json_decode(file_get_contents('php://input'));
$action = $request->action;
$payload = $request->payload;

$validActions = array(
    // user handling
    'login',
    'checkLogin',
    'logout',
    'createUser',
    'changePassword',
    // chat
    'getMessages',
    'addMessage',
    // game
    'listRooms',
    'getNewRoom',
    'getIntoRoom',
);

if (!in_array($action, $validActions)) {
    exitWithError('Unrecognized action');
}

session_set_cookie_params([
    // Necessary for cross-origin cookie setting
    'samesite' => 'None',
    'secure' => true,
    'httponly' => true,
]);
session_start([
    // use different cookie from the default PHPSESSID
    'name' => 'LOOPSSESSID',
]);
