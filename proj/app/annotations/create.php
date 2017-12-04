<?php

// This file saves an annotation posted
// from the client in the database.

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "annotations";


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
     die("Connection failed: " . $conn->connect_error);
 }

$url = $_POST["url"]; // Will be replaced with $_POST["url"] in future

$text = $_POST["text"]; // Don't JSON encode text as it is currently in string form

$highlights = json_encode($_POST["highlights"]); // Encode highlights as json string

$quote = $_POST["quote"]; // Quote is already a string

$ranges = json_encode($_POST["ranges"]); // Encode ranges as json string

$sql = "INSERT INTO `annotation`(`url`, `text`, `highlights`, `quote`,`ranges`) VALUES ('".$url."','".$text."','".$highlights."','".$quote."','".$ranges."')";

if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;
} else {
    //echo "Error: " . $sql . "<br>" . $conn->error;
}

echo $last_id;

$conn->close();
?> 