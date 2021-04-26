<?php

function keys_are($data, $keys)
{
    if (!is_array($data) || !is_array($keys)) return false;
    if (count($data) != count($keys)) return false;
    foreach ($keys as $key) {
        if (!isset($data[$key])) return false;
    }
    return true;
}

// Validation of user input

function validate($input, $kind)
{
    // if empty
    if ($input == '') {
        exitWithError('Please fill out all fields.');
    }
    // sanitize input
    $trimmedInput = trim($input);
    $cleanInput = filter_var($trimmedInput, FILTER_SANITIZE_STRING);
    $cleanInput = strip_tags($cleanInput);
    htmlspecialchars($cleanInput);

    // validate length or size
    if ($kind == 'name') {
        if (strlen($cleanInput) < 3) {
            exitWithError('Name too short (min. 3)');
        } else if (strlen($cleanInput) > 50) {
            exitWithError('Name too long (max. 50)');
        } else {
            return $cleanInput;
        }
    }
    if ($kind == 'password') {
        if (strlen($cleanInput) < 4) {
            exitWithError('Password too short (min 4).');
        } else {
            return $cleanInput;
        }
    }
    if ($kind == 'message') {
        if (strlen($cleanInput) > 500) {
            exitWithError('Message too long (max 500).');
        } else {
            return $cleanInput;
        }
    }
    if ($kind == 'roomsize') {
        if ($cleanInput >= 2 && $cleanInput <= 30) {
            return $cleanInput;
        } else {
            exitWithError('Roomsize should be between 2 and 30');
        }
    }
    if ($kind == 'density') {
        if ($cleanInput >= 0 && $cleanInput <= 100) {
            return $cleanInput;
        } else {
            exitWithError('Density should be between 0 and 100');
        }
    }
}
