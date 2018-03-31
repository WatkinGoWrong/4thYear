/*file uploading function - taken from Colm Mathews code
 *Code given to me by Colm - previous student of Maynooth University
 *
 *Allows the uploading and diplaying of text files to be annotated
 */

$("#inputText").change(function(e) {
  onTextChange(e);
});

function onTextChange(event) {
  var textReader = new FileReader();
  textReader.onload = onReaderLoad;
  textReader.readAsText(event.target.files[0]);
}

var obj; // Holds Annotation Instance

function onReaderLoad(event) {
  var text = event.target.result;
  $("#content").html(text);

  obj = new Array();
  var ann2 = $("#content2").annotator();
  var ann = $("#content").annotator(); //Assign container to hold annotator content

  ann.annotator('addPlugin', 'fileStorage'); // Add Storage Plugin
  ann2.annotator('addPlugin', 'fileStorage');

  ann.annotator('loadAnnotations', obj);
  ann2.annotator('loadAnnotations', obj);

  $("#inputText").css('display', 'none');

}