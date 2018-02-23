/*exampleTree = function() {
  reply = sampleTree; //.slice(1,-1).replace(/\\/g, "");
  //////console.log.log(example);
  tree.nodes = JSON.parse(reply);
  reposition(tree.nodes[0], SFL_node_pos);
  redraw();
}

//save the tree structure as JSON
loadTree = function() {
  tree.nodes = JSON.parse(JSONData);
  ////console.log.log(tree.nodes);
  refresh();
  reposition(tree.nodes[0], SFL_node_pos);
  redraw();
}*/

//save the tree structure as JSON
saveTree = function() {
  ////console.log.log(tree.nodes);
  JSONData = JSON.stringify(tree.nodes);
  ////console.log.log(JSONData);
}

tree.addFromJSON = function(parent, child, pos, depth) {
  tree.size++;
  var node = parent;
  //////console.log.log("parent- ",parent.text);
  //////console.log.log("child- ",child);


  // /////console.log.log(parent);
  function addLeaf(node) {
    var draw = true;
    if (node.id == parent.id) {
      if (node.kids != null) {
        //////console.log.log('node : ', node , ' | kid :' , node.kids);
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
  //////console.log.log(parent);
  function addLeaf(node) {
    //////console.log.log(parent);
    //////console.log.log(node);
    if (node.id == parent) {
      //////console.log.log("addLeaf");
      ////console.log.log('id' + (tree.size - 1));
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
  //                reposition(tree.nodes[0]);
  //                redraw();
}