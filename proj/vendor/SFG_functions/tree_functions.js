//save the tree structure as JSON
saveTree = function() {
  JSONData = JSON.stringify(tree.nodes);
}

tree.addFromJSON = function(parent, child, pos, depth) {
  tree.size++;
  var node = parent;

  function addLeaf(node) {
    var draw = true;
    if (node.id == parent.id) {
      if (node.kids != null) {
        for (x in node.kids) {
          if (node.kids[x].text == child) {
            draw = false;
          }
        }
      }
      if (draw) {
        node.kids.push({
          id: 'id' + (tree.size - .5),
          text: child,
          x: node.x,
          y: node.y,
          parent: parent.text,
          isLeaf: true,
          tWidth: 0,
          depth: depth,
          kids: []
        });
        node.isLeaf = false;
        refresh();
        reposition(tree.nodes[0], SFL_node_pos);
        redraw();
        return;
      }
    }
    node.kids.forEach(addLeaf);
  }
  addLeaf(node);
  return node.kids[pos];
}

//add a new leaf - have to look into refactoring this code
tree.addLeaf = function(parent) {
  tree.size++;

  function addLeaf(node) {
    if (node.id == parent) {
      node.kids.push({
        id: 'id' + (tree.size),
        text: 'Node' + (tree.size),
        x: node.x,
        y: node.y,
        kids: [],
        isLeaf: true,
        tWidth: 0
      });
      node.isLeaf = false;
      refresh();
      reposition(tree.nodes[0], SFL_node_pos);
      redraw();
      return;
    }
    node.kids.forEach(addLeaf);
  }
  addLeaf(tree.nodes[0]);
}