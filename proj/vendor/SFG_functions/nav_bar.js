captureSFG = function() {
  var c = document.getElementById('tree-0');
  var t = c.getContext('2d');
  window.open('', document.getElementById('tree-0').toDataURL());
}

$(function() {
  $("#captureSFG").click(function() {
    html2canvas($("#tree-0"), {
      onrendered: function(canvas) {
        theCanvas = canvas;
        document.body.appendChild(canvas);

        // Convert and download as image
        Canvas2Image.saveAsPNG(canvas);
        //$("#img-out").append(canvas);
        // Clean up
        //document.body.removeChild(canvas);
      }
    });
  });
});

$(function() {
  $("#gradeSFG").click(function() {
    redraw_grade();
  });
});

var adjust = false;
$(function() {
  $("#adjustSFG").click(async function() {
    if (!adjust)
      return adjust = true
    else
      return adjust = false

  });
});