//get the nodes
tree.getNodes = function() {
  var n = [];

  function getNodes(node) {
    n.push({
      id: node.id,
      text: node.text,
      x: node.x,
      y: node.y,
      kids: node.kids,
      isLeaf: node.isLeaf,
      tWidth: node.tWidth
    });
    node.kids.forEach(function(kid) {
      return getNodes(kid);
    });
  }
  getNodes(tree.nodes[0]);
  return n.sort(function(a, b) {
    return a.id - b.id;
  });
}

//get the links
tree.getLinks = function() {
  var l = [];

  function getLinks(node) {
    node.kids.forEach(function(kid) {
      if (!kid.isLeaf) {
        l.push({
          fromId: node.id,
          fromX: node.x,
          fromY: node.y,
          toId: kid.id,
          toX: kid.x,
          toY: kid.y
        });
      }
    });
    node.kids.forEach(getLinks);
  }
  getLinks(tree.nodes[0]);
  return l.sort(function(a, b) {
    return a.toId - b.toId
  });
}

//get the triangles -- size of the trees
tree.getTriangles = function() {
  var t = [];

  function getTriangles(node) {
    node.kids.forEach(function(kid) {
      if (kid.isLeaf) {
        t.push({
          fromId: node.id,
          toId: kid.id,
          topX: node.x,
          topY: (node.y + 10),
          leftX: (kid.x - (kid.tWidth / 3)),
          leftY: (kid.y - 10),
          rightX: (kid.x + (kid.tWidth / 3)),
          rightY: (kid.y - 10)
        });
      }
    }); //10
    node.kids.forEach(getTriangles);
  }
  getTriangles(tree.nodes[0]);
  return t.sort(function(a, b) {
    return a.toId - b.toId
  });
}

//returns node object from nodes array
tree.getNode = function(thisNode) {
  var n;
  //////console.log.log('thisNode');
  //////console.log.log(thisNode);
  function getNode(node) {
    if (node.id == thisNode.id) {
      n = node;
    }
    node.kids.forEach(getNode);
  }
  getNode(tree.nodes[0]);
  //////console.log.log('n');
  //////console.log.log(n);
  return n;
}