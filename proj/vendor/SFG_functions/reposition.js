var uniformDepth = true;
var previous_x = 0;
var node_length = 0;


getLeafCount = function(node) {
  if (node.kids.length == 0) {
    return 1;
  } else {
    return node.kids.map(getLeafCount).reduce(function(a, b) {
      return a + b;
    });
  }
}

getNodeLength = function(node) {
  node.kids.forEach(function(kid) {
    getNodeLength(kid);
    if ((kid.kids).length == 0) {
      node_length++;
    }
  });

}

nodeDepth = function() {
  var leafs = [];
  var depth = 0;

  //check if nodes are leafs
  function nodeDepth(n) {
    n.kids.forEach(function(kid) {
      if (kid.isLeaf) {
        leafs.push({
          id: kid.id
        });
        if (kid.y > depth) {
          depth = kid.y;
        }
      }
    });
    n.kids.forEach(nodeDepth);
  }
  nodeDepth(tree.nodes[0]);

  function changeDepth(n) {
    n.kids.forEach(function(kid) {
      leafs.forEach(function(leaf) {
        if (kid.id == leaf.id) {
          kid.y = depth;
        }
      })

    });
    n.kids.forEach(changeDepth);
  }
  changeDepth(tree.nodes[0]);
  tree.leafDepth = depth;
}

reposition_adjust = function(node, SFL_node_pos) {

  if (uniformDepth) {
    nodeDepth();
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
    reposition_adjust(kid, SFL_node_pos);
    //redraw();
  });
  //console.log(tree.w);
}

resetTree = function() {
  tree.nodes = [];
  tree.nodes.push({
    id: '00',
    text: '',
    x: tree.cx,
    y: tree.cy,
    isLeaf: false,
    tWidth: 0,
    depth: 0,
    kids: []
  });
  refresh();
  reposition(tree.nodes[0]);
  redraw();
}


reposition = function(node) {

  if (uniformDepth) {
    nodeDepth();
  }

  var leafCount = getLeafCount(node),
    left = node.x - tree.w * (leafCount - 1) / 2;
  node.kids.forEach(function(kid) {
    var w = tree.w * getLeafCount(kid);
    left += w;
    kid.x = left - (w + tree.w) / 2;
    kid.y = node.y + tree.h;
    reposition(kid);
    redraw();
  });

}