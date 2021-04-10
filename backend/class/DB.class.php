<?php
class DB extends PDO
{
    public function __construct($db_user, $db_pass, $db_name, $db_host, $db_port, $db_charset)
    {
        $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=$db_charset";
        $options = array(
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
            PDO::ATTR_EMULATE_PREPARES   => false,
        );

        try {
            parent::__construct($dsn, $db_user, $db_pass, $options);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    // CRUD


}
