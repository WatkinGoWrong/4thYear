<?php

// This file updates an annotation given by 
// the id of the annotation, with the new values 
// posted to the server.

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

$id = $_POST["id"]; // Id of annotation to delete sent from client

$text = $_POST["text"];

$sql = "UPDATE annotation SET text='".$text."' WHERE id=".$id;

if ($conn->query($sql) === TRUE) {
    echo "1";
} else {
    //echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?> 