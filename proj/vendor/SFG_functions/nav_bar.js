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
var grading = false;
$(function() {
  $("#gradeSFG").click(function() {
    if (!grading) {
      //document.getElementById('gradeSFG').innerHTML = "Grade (On)"
      $("#gradeSFG").html("Grade (On)");
      return grading = true
    } else {
      //document.getElementById('gradeSFG').innerHTML = "Grade (Off)"
      $("#gradeSFG").html("Grade (Off)");
      return grading = false
    }
  });
});

var adjust = false;
$(function() {
  $("#adjustSFG").click(async function() {
    if (!adjust) {
      $("#adjustSFG").html("Adjust (On)");
      return adjust = true
    } else {
      $("#adjustSFG").html("Adjust (Off)");
      return adjust = false
    }

  });
});

var teacher = false;
$(function() {
  $("#genTeacherSFL").click(async function() {
    if (!teacher) {
      $("#genTeacherSFL").html("Teacher (On)");
      return teacher = true
    } else {
      $("#genTeacherSFL").html("Teacher (Off)");
      return teacher = false
    }
  });
});

$(function() {
  $("#storeSFL").click(async function() {
    var result = await storeSFL(assignment_content);
    console.log(result);
  });
});