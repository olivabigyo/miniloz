<?php
// TODO: atnevezni ezt a fajlt

require_once 'prefs/config.php';
require_once 'class/DB.class.php';

$db = new DB(DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT, DB_CHARSET);
