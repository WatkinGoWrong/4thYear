var uniformDepth = true;

reposition = function(node, SFL_node_pos) {

  if (uniformDepth) {
    tree.nodeDepth();
  }

  var leafCount = getLeafCount(node),
    left = node.x - tree.w * (leafCount - 1) / 2;
  node.kids.forEach(function(kid) {
    var alter = 0;
    var w = tree.w * getLeafCount(kid);
    left += w;

    if ((kid.kids[0]) != undefined && ((kid.kids[0]).kids).length == 0) {

      var cur = (kid.kids[0].text).split(' ').join('');

      //Check if bottom most node is next in the sentence
      //If it is it will check and see if its needs to be moved to ensure its in its correct position
      if (cur.toLowerCase() == sentence.substring(0, cur.length)) {
        sentence = sentence.substring(cur.length, sentence.length);
        for (x in SFL_node_pos) {
          var pos_test = Math.abs(SFL_node_pos[x] - (left - (w + tree.w) / 2))
          //console.log(pos_test);
          if (pos_test >= 0 && pos_test <= (tree.w) / 2)
            alter = -(tree.w);
        }
        kid.x = left - (w + tree.w) / 2 + alter;
        SFL_node_pos.push(kid.x);
      } else { // else if its part of the sentence but isnt next it will move it across to fit into place
        alter = tree.w;
        for (x in SFL_node_pos) {
          var pos_test = Math.abs(SFL_node_pos[x] - (left - (w + tree.w) / 2))
          if (pos_test >= 0 && pos_test <= (tree.w) / 2)
            alter += tree.w;
        }
        kid.x = left - (w + tree.w) / 2 + alter;
        SFL_node_pos.push(kid.x);
      }
    } else {
      kid.x = left - (w + tree.w) / 2;
    }
    //kid.x = left - (w + tree.w) / 2 + alter;
    kid.y = node.y + tree.h;
    //SFL_node_pos.push(kid.x);
    reposition(kid);
    //redraw();
  });
  //console.log(tree.w);
}