<?php

/**
 * Handles the user registration
 * @author Panique
 * @link http://www.php-login.net
 * @link https://github.com/panique/php-login-advanced/
 * @license http://opensource.org/licenses/MIT MIT License
 */
class Database
{
    /**
     * @var object $db_connection The database connection
     */
    private $db_connection            = null;
    /**
     * @var bool success state of registration
     */
    public  $registration_successful  = false;
    /**
     * @var bool success state of verification
     */
    public  $verification_successful  = false;
    /**
     * @var array collection of error messages
     */
    public  $errors                   = array();
    /**
     * @var array collection of success / neutral messages
     */
    public  $messages                 = array();
    
    /**
     * the function "__construct()" automatically starts whenever an object of this class is created,
     * you know, when you do "$login = new Login();"
     */
    public function __construct()
    {
        //session_start();

        // if we have such a POST request, call the registerNewUser() method
        if (isset($_POST["insert_snowfall"])) {
            $this->inputSnowfall($_POST['num_inches'],$_POST['lat'],$_POST['lng'],$_POST['town']);   
        }
    }

    /**
     * Checks if database connection is opened and open it if not
     */
    private function databaseConnection()
    {
        // connection already opened
        if ($this->db_connection != null) {
            return true;
        } else {
            // create a database connection, using the constants from config/config.php
            try {
                // Generate a database connection, using the PDO connector
                $this->db_connection = new PDO('mysql:host='. DB_HOST .';dbname='. DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
                return true;
            // If an error is catched, database connection failed
            } catch (PDOException $e) {
                $this->errors[] = MESSAGE_DATABASE_ERROR;
                return false;
            }
        }
    }

    /**
     * handles the entire registration process. checks all error possibilities, and creates a new user in the database if
     * everything is fine
     */
    private function inputSnowfall($num_inches, $lat, $lng, $town)
    {
        if ($this->databaseConnection()) {
            // write new snowfall into db
            $query_new_insert = $this->db_connection->prepare('INSERT INTO snowfall_14_15 (num_inches, lat, lng, time, day, town) VALUES(:num_inches, :lat, :lng, now(), now(), :town)');
            $query_new_insert->bindValue(':num_inches', $num_inches, PDO::PARAM_INT);
            $query_new_insert->bindValue(':lat', $lat, PDO::PARAM_STR);
            $query_new_insert->bindValue(':lng', $lng, PDO::PARAM_STR);
            $query_new_insert->bindValue(':town', $town, PDO::PARAM_STR);

            $query_new_insert->execute();

            if($query_new_insert){
                $this->messages[] = "Thank you. Your snowfall total was successfully submitted.";
            }
            else{
                $this->errors[] = "There was a problem with your submission, please try again.";
            } 
        }
    }
    /**
     * Get all of the snowfall totals
     * @return $object_array all of the snowfall totals
     */
    public function getSnowfall($sql){
        if($this->databaseConnection()) {
            // database query, getting all the info of the selected user
            $query_get_snowfall = $this->db_connection->prepare($sql);
            $query_get_snowfall->execute();
            // get result row (as an object)
            $object_array = $query_get_snowfall->fetchAll();
        }
        return $object_array;
    }
}
