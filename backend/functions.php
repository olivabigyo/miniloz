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
