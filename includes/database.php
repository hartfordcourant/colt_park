<?php

require_once('config.php');

class MySQLDatabase 
{
	private $connection;
	public $last_query;
	private $magic_quotes_active;
	private $real_escape_string_exists;
	
	function __construct()
	{
		$this->open_connection();
	}
	
	public function open_connection()
	{
		$this->connection=mysql_connect(DB_SERVER, DB_USER, DB_PASS);
		if(!$this->connection)
		{
			die("Database connection failed: " . mysql_error());
		}
		else 
		{
			$db_select = mysql_select_db(DB_NAME, $this->connection);
			if (!$db_select)
			{
				die("Database selection failed: " . mysql_error());
			}
		}
	}
	
	public function close_connection()
	{
		if(isset($this->connection))
		{
			mysql_close($this->connection);
			unset($this->connection);
		}
	}
	
	public function query($sql)
	{
		$result = mysql_query($sql, $this->connection);
		$this->confirm_query($result);
		return $result;
	}
	public function get_facet($sql)
	{
		$result = mysql_query($sql, $this->connection);
		$this->confirm_query($result);
		return $result;
	}
	public function mysql_prep($value) 
	{
		if( $this->real_escape_string_exists ) 
		{
			// undo any magic quote effects so mysql_real_escape_string can do the work
			if( $this->magic_quotes_active ) 
			{
				$value = stripslashes($value); 
			}
			$value = mysql_real_escape_string($value);
		} 
		else
		{
			// if magic quotes aren't already on then add slashes manually
			if( !$this->magic_quotes_active ) 
			{
				$value = addslashes($value);
			}
			// if magic quotes are active, then the slashes already exist
		}
		return $value;
	}
	private function confirm_query($result)
	{
		if(!$result)
		{
			die("Database query failed: " . mysql_error());
		}
	}
}

$database= new MySQLDatabase();

?>
