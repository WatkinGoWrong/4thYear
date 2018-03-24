var svgWidth = (document.getElementById('TreeArea').offsetWidth), // * .985,
  svgHeight = svgWidth / 2,
  devide = 1.2;

var fontsize = (svgWidth / 120) / devide,
  linkSpace = (fontsize) / devide,
  trainglepadding = (fontsize) / devide,
  stroke_width = (fontsize / 15) / devide;

refresh = function() {
  d3.select('#nodes').selectAll('text').data(tree.getNodes()).exit().remove();
  d3.select('#links').selectAll('line').data(tree.getLinks()).exit().remove();
  d3.select('#triangles').selectAll('polygon').data(tree.getTriangles()).exit().remove();
}
refresh_grade = function() {
  d3.select('#nodes_2').selectAll('text').data(tree.getincorrectNodes()).exit().remove();
  d3.select('#links_2').selectAll('line').data(tree.getincorrectLinks()).exit().remove();
  d3.select('#triangles_2').selectAll('polygon').data(tree.getincorrectTriangles()).exit().remove();

  d3.select('#nodes_3').selectAll('text').data(tree.getcorrectNodes()).exit().remove();
  d3.select('#links_3').selectAll('line').data(tree.getcorrectLinks()).exit().remove();
  d3.select('#triangles_3').selectAll('polygon').data(tree.getcorrectTriangles()).exit().remove();
}

redraw = function() {
  console.log(devide);
  refresh();
  refresh_grade();

  var nodes = d3.select('#nodes').selectAll('text').data(tree.getNodes());

  nodes.text(function(node) {
      return node.text
    }) /*.transition().duration(500)*/
    .attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    }) //5
    .attr('fill', function(node) {
      if (node.isLeaf) {
        return 'black';
      } else {
        return 'black';
      }
    }); //red|blue

  nodes.enter().append('text').attr('id', function(node) { /*/ ///console.log.log('id = ' + node.id);*/
      return node.id;
    })
    .attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    })
    .text(function(node) {
      return ((node.text).replace("\\", ""));
    })
    .attr('tWidth', function(node) {
      var n = tree.getNode(node);
      //n.width = 40;
      n.tWidth = this.getBBox().width;
      return this.getBBox().width;
      //return tree.getTextWidth(node);
      //return 40;
    })
    //Change font below
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px'
    })
    //.on('click', function (node) { if (d3.event.shiftKey) { return tree.changeText(node); } else if (d3.event.ctrlKey) { return tree.removeLeaf(node); } else { return tree.addLeaf(node.id); } })
    //.transition().duration(500) * /
    .attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    });


  var links = d3.select('#links').selectAll('line').data(tree.getLinks());

  links /*.transition().duration(500)*/
    .attr('x1', function(link) {
      return link.fromX;
    }).attr('y1', function(link) {
      return link.fromY + linkSpace;
    }) //10
    .attr('x2', function(link) {
      return link.toX;
    }).attr('y2', function(link) {
      return link.toY - linkSpace;
    });

  links.enter().append('line')
    .attr('x1', function(link) {
      return link.fromX;
    }).attr('y1', function(link) {
      return link.fromY + linkSpace;
    })
    .attr('x2', function(link) {
      return link.toX;
    }).attr('y2', function(link) {
      return link.toY - linkSpace;
    })

    .style({
      'stroke': 'black',
      'stroke-width': stroke_width + 'px'
    }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('x2', function(link) {
      return link.toX;
    }).attr('y2', function(link) {
      return link.toY - linkSpace;
    });


  var triangles = d3.select('#triangles').selectAll('polygon').data(tree.getTriangles());

  triangles /*.transition().duration(500)*/
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX - trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX + trainglepadding) + ',' + triangle.rightY)
    });

  triangles.enter().append('polygon')
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX - trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX + trainglepadding) + ',' + triangle.rightY)
    })
    .style({
      'stroke': 'black',
      'stroke-dasharray': 0,
      'stroke-width': stroke_width + 'px',
      'fill': 'white'
    }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (triangle.leftX - trainglepadding) + ',' + triangle.leftY + ' ' + (triangle.rightX + trainglepadding) + ',' + triangle.rightY)
    });
}

redraw_grade = function() {
  refresh();
  refresh_grade();

  //console.log("-- 1");

  var nodes = d3.select('#nodes_3').selectAll('text').data(tree.getcorrectNodes());

  nodes.text(function(node) {
      return node.text
    }) /*.transition().duration(500)*/
    .attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    }). //5
  attr('fill', function(node) {
    if (node.isLeaf) {
      return 'black';
    } else {
      return 'black';
    }
  }); //red/blue

  nodes.enter().append('text').attr('id', function(node) { /*console.log('id = ' + node.id);*/
      return node.id;
    }).attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    }).text(function(node) {
      return (node.text).replace("\\", "");
    }).attr('tWidth', function(node) {
      var n = tree.getNode(node);
      n.tWidth = this.getBBox().width;
      return this.getBBox().width;
    })
    //Change font below
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px'
    }).attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    });

  var nodes = d3.select('#nodes_2').selectAll('text').data(tree.getincorrectNodes());

  nodes.text(function(node) {
      return node.text
    }) /*.transition().duration(500)*/
    .attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    }). //5
  attr('fill', function(node) {
    if (node.isLeaf) {
      return 'black';
    } else {
      return 'black';
    }
  }); //red/blue

  nodes.enter().append('text').attr('id', function(node) { /*console.log('id = ' + node.id);*/
      return node.id;
    }).attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    }).text(function(node) {
      return (node.text).replace("\\", "");
    }).attr('tWidth', function(node) {
      var n = tree.getNode(node);
      n.tWidth = this.getBBox().width;
      //console.log(n.tWidth);
      return this.getBBox().width;
    })
    //Change font below
    .style({
      'text-anchor': 'middle',
      'cursor': 'pointer',
      'font-size': fontsize + 'px',
      'font-weight': 'bold',
      'font-style': 'italic'
    }).attr('x', function(node) {
      return node.x;
    }).attr('y', function(node) {
      return node.y + 5;
    });
  //var links = [];
  var links = d3.select('#links_3').selectAll('line').data(tree.getcorrectLinks());
  //console.log("links>>", links);
  links.attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY + linkSpace;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY - linkSpace;
  });

  links.enter().append('line').attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY + linkSpace;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY - linkSpace;
  }).style({
    'stroke': 'black',
    'stroke-dasharray': 'dash',
    'stroke-width': stroke_width + 'px'
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY - linkSpace;
  });
  //var links_2 = [];
  var links_2 = d3.select('#links_2').selectAll('line').data(tree.getincorrectLinks());
  //console.log("links_incorrect>>", links_2);

  links_2.attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY + linkSpace;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY - linkSpace;
  });

  links_2.enter().append('line').attr('x1', function(link) {
    return link.fromX;
  }).attr('y1', function(link) {
    return link.fromY + linkSpace;
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY - linkSpace;
  }).style({
    'stroke': 'black',
    'stroke-dasharray': 5,
    'stroke-width': stroke_width + 'px'
  }).attr('x2', function(link) {
    return link.toX;
  }).attr('y2', function(link) {
    return link.toY - linkSpace;
  });

  //console.log("diff >> ", diff_array);
  var triangles = d3.select('#triangles_3').selectAll('polygon').data(tree.getcorrectTriangles());

  triangles /*.transition().duration(500)*/
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (
        triangle.leftX - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
        triangle.rightX + trainglepadding
      ) + ',' + triangle.rightY)
    });

  triangles.enter().append('polygon').attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (
        triangle.leftX - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
        triangle.rightX + trainglepadding
      ) + ',' + triangle.rightY)
    }).style({
      'stroke': 'black',
      'stroke-dasharray': 'dash',
      'stroke-width': stroke_width + 'px',
      'fill': 'white'
    }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (
        triangle.leftX - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
        triangle.rightX + trainglepadding
      ) + ',' + triangle.rightY)
    });

  var triangles = d3.select('#triangles_2').selectAll('polygon').data(tree.getincorrectTriangles());

  triangles /*.transition().duration(500)*/
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (
        triangle.leftX - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
        triangle.rightX + trainglepadding
      ) + ',' + triangle.rightY)
    });

  triangles.enter().append('polygon').attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (
        triangle.leftX - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
        triangle.rightX + trainglepadding
      ) + ',' + triangle.rightY)
    }).style({
      'stroke': 'black',
      'stroke-dasharray': 5,
      'stroke-width': stroke_width + 'px',
      'fill': 'white'
    }) //'stroke-dasharray': 5 , -- Use for showing error in comparison
    /*.transition().duration(500)*/
    .attr('points', function(triangle) {
      return (triangle.topX + ',' + triangle.topY + ' ' + (
        triangle.leftX - trainglepadding
      ) + ',' + triangle.leftY + ' ' + (
        triangle.rightX + trainglepadding
      ) + ',' + triangle.rightY)
    });
}