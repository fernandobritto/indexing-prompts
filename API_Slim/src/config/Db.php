<?php


class Db
{
    private $dbHost = 'localhost';
    private $dbUser = 'root';
    private $dbPass = '';
    private $dbName = 'carshop';

    //Connection
    public function connectionDB()
    {
        $mysqlConn = "mysql:host=$this->dbHost;$this->dbName;";
        $dbConnection = new PDO($mysqlConn, $this->dbUser, $this->dbPass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return  $dbConnection;
    }


}