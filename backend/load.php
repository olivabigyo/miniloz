<?php
require_once 'functions.php';
require_once 'prefs/config.php';
require_once 'class/DB.class.php';

$db = new DB(DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT, DB_CHARSET);
function globalDB() {
    global $db;
    return $db;
}
