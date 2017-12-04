<?php

// This file loads annotations from a 
// mysql database and send them to the 
// client for display or tree generation

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

$url = $_POST["url"]; // Dictates which document is bein annotated

$return = array(); // Array to hold annotations

$sql = "SELECT * FROM annotation WHERE url='".$url."'"; // Return all annotations with matching url
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    	$annotation = new stdClass(); // Annotation object to hold information about each annotation
    	$annotation->ranges     = json_decode($row["ranges"]); // Decode ranges into object form
    	$annotation->quote      = $row["quote"];
    	$annotation->highlights = json_decode($row["highlights"]); // Decode highlights into object form
    	$annotation->text       = json_decode($row["text"]); // Decode (taggle) text into object (will have to be converted back to string client side)
    	$annotation->id         = $row["id"];

    	$return[] = $annotation; // Add annotation to return array
    }
} else {
    //Nothing
}

echo json_encode($return); //Turn array to JSON string and send to client

$conn->close();
?> 