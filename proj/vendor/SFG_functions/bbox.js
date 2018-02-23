function getBoundingBox(ctx, left, top, width, height) {
  var ret = {};

  // Get the pixel data from the canvas
  var data = ctx.getImageData(left, top, width, height).data;
  console.log(data);
  var first = false;
  var last = false;
  var right = false;
  var left = false;
  var r = height;
  var w = 0;
  var c = 0;
  var d = 0;

  // 1. get bottom
  while (!last && r) {
    r--;
    for (c = 0; c < width; c++) {
      if (data[r * width * 4 + c * 4 + 3]) {
        console.log('last', r);
        last = r + 1;
        ret.bottom = r + 1;
        break;
      }
    }
  }

  // 2. get top
  r = 0;
  var checks = [];
  while (!first && r < last) {

    for (c = 0; c < width; c++) {
      if (data[r * width * 4 + c * 4 + 3]) {
        console.log('first', r);
        first = r - 1;
        ret.top = r - 1;
        ret.height = last - first - 1;
        break;
      }
    }
    r++;
  }

  // 3. get right
  c = width;
  while (!right && c) {
    c--;
    for (r = 0; r < height; r++) {
      if (data[r * width * 4 + c * 4 + 3]) {
        console.log('last', r);
        right = c + 1;
        ret.right = c + 1;
        break;
      }
    }
  }

  // 4. get left
  c = 0;
  while (!left && c < right) {

    for (r = 0; r < height; r++) {
      if (data[r * width * 4 + c * 4 + 3]) {
        console.log('left', c - 1);
        left = c;
        ret.left = c;
        ret.width = right - left - 1;
        break;
      }
    }
    c++;

    // If we've got it then return the height
    if (left) {
      return ret;
    }
  }

  // We screwed something up...  What do you expect from free code?
  return false;
}