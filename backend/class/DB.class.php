<?php
class DB extends PDO
{
    public function __construct($db_user, $db_pass, $db_name, $db_host, $db_port, $db_charset)
    {
        $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=$db_charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            parent::__construct($dsn, $db_user, $db_pass, $options);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    // CRUD

    // Returns the executed sql query with given values
    function executeQuery($query, $params = null)
    {
        $stmt = $this->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }

    // Returns the result of a simple (result is one row, one column) query
    function simpleQuery($query, $params = null)
    {
        $stmt = $this->executeQuery($query, $params);
        return $stmt->fetchColumn();
    }

    // Insert into table
    // $data should be an associative array with keys being valid column names
    // Only string values are supported (non-strings will be converted to strings with the default string conversion)
    public function insert($table, $data)
    {
        // Parse data for column and placeholder names
        $columns = implode(',', array_keys($data));
        $placeholders = implode(',', array_map(fn($k) => ":$k", array_keys($data)));

        // Execute the query
        $stmt = $this->executeQuery("INSERT INTO $table ($columns) VALUES ($placeholders)", $data);

        // Return the `id` of the inserted row
        return $this->lastInsertId();
    }
}
