/**
 *This function sets up the SVG
 *It creates all nescesary elements for the tree in the SVG
 *Creates the initial tree element
 *
 */

initialise = function(num) {
  //add the root node
  tree.nodes.push({
    id: '00',
    text: '', //sentence
    x: 0,
    y: 0,
    parent: 'none',
    isLeaf: false,
    tWidth: 0,
    depth: 0,
    kids: []
  });

  //create the svg
  d3.select("#tree-" + num).style().append('svg').attr('width', 1440).attr('height', 1440 / 2).attr('id', 'svgTree-' + num);

  //create group of nodes
  d3.select('#svgTree-' + num).append('g').attr('id', 'nodes').selectAll('text').data(tree.getNodes()).enter().append('text').attr('id', function(node) {
    return node.id;
  }).attr('x', function(node) {
    return node.x;
  }).attr('y', function(node) {
    return node.y + 5;
  }).text(function(node) {
    return node.text;
  }).attr('tWidth', function(node) {
    var n = tree.getNode(node);
    n.tWidth = this.getBBox().width;
    return this.getBBox().width; /*return tree.getTextWidth(node);*/
  }).style({
    'text-anchor': 'middle',
    'cursor': 'pointer'
  })

  d3.select('#svgTree-' + num).append('g').attr('id', 'nodes_2').selectAll('text').data(tree.getNodes()).enter().append('text').attr('id', function(node) {
    return node.id;
  }).attr('x', function(node) {
    return node.x;
  }).attr('y', function(node) {
    return node.y + 5;
  }).text(function(node) {
    return node.text;
  }).attr('tWidth', function(node) {
    var n = tree.getNode(node);
    n.tWidth = this.getBBox().width;
    return this.getBBox().width; /*return tree.getTextWidth(node);*/
  }).style({
    'text-anchor': 'middle',
    'cursor': 'pointer'
  })

  d3.select('#svgTree-' + num).append('g').attr('id', 'nodes_3').selectAll('text').data(tree.getNodes()).enter().append('text').attr('id', function(node) {
    return node.id;
  }).attr('x', function(node) {
    return node.x;
  }).attr('y', function(node) {
    return node.y + 5;
  }).text(function(node) {
    return node.text;
  }).attr('tWidth', function(node) {
    var n = tree.getNode(node);
    n.tWidth = this.getBBox().width;
    return this.getBBox().width; /*return tree.getTextWidth(node);*/
  }).style({
    'text-anchor': 'middle',
    'cursor': 'pointer'
  })
  //.on('click', function (node) { return addLeaf(node.id); }); create group of links
  d3.select('#svgTree-' + num).append('g').attr('id', 'links').selectAll('line').data(tree.getLinks()).enter().append('line').attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY;
  });

  d3.select('#svgTree-' + num).append('g').attr('id', 'links_2').selectAll('line').data(tree.getLinks()).enter().append('line').attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY;
  });

  d3.select('#svgTree-' + num).append('g').attr('id', 'links').selectAll('line').data(tree.getLinks()).enter().append('line').attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY;
  });

  d3.select('#svgTree-' + num).append('g').attr('id', 'links_3').selectAll('line').data(tree.getLinks()).enter().append('line').attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY;
  });

  //create group of triangles
  d3.select('#svgTree-' + num).append('g').attr('id', 'triangles').selectAll('polygon').data(tree.getTriangles()).enter().append('polygon').attr('points', function(triangle) {
    return (triangle.topX + ',' + triangle.topY + ' ' + triangle.leftX + ',' + triangle.leftY + ' ' + triangle.rightX + ',' + triangle.rightY)
  });

  d3.select('#svgTree-' + num).append('g').attr('id', 'triangles_2').selectAll('polygon').data(tree.getTriangles()).enter().append('polygon').attr('points', function(triangle) {
    return (triangle.topX + ',' + triangle.topY + ' ' + triangle.leftX + ',' + triangle.leftY + ' ' + triangle.rightX + ',' + triangle.rightY)
  });

  d3.select('#svgTree-' + num).append('g').attr('id', 'triangles_3').selectAll('polygon').data(tree.getTriangles()).enter().append('polygon').attr('points', function(triangle) {
    return (triangle.topX + ',' + triangle.topY + ' ' + triangle.leftX + ',' + triangle.leftY + ' ' + triangle.rightX + ',' + triangle.rightY)
  });

  //Show the legend in top left corner
  var controlsInfo = [
    // { id: 'c1', action: 'Add Leaf : ', buttons: ' Click on a Node', x: 5, y: 15 }, { id: 'c2', action: 'Remove Leaf : ', buttons: ' Hold Ctrl & Click on a Leaf', x: 5, y: 30 }, { id: 'c3', action: 'Change Node Text : ', buttons: ' Hold Shift & Click
    // on a Node', x: 5, y: 45 }
  ];
  d3.select('#svgTree-' + num).append('g').attr('id', 'legend').selectAll('text').data(controlsInfo).enter().append('text').attr('id', function(c) {
    return c.id;
  }).attr('x', function(c) {
    return c.x;
  }).attr('y', function(c) {
    return c.y;
  }).text(function(c) {
    return c.action;
  }).attr('style', 'font-size:6; fill:black;').append('tspan').attr('x', 100).attr('y', function(c) {
    return c.y;
  }).text(function(c) {
    return c.buttons;
  });
  redraw();
}