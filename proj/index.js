// index.js
var diff = require('deep-diff').diff;
 
var JSONTree = {"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{},"THIS":{}},"Participant 2":{"None":{}}}};
var JSONTree2 = {"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{},"None":{}},"Participant":{}}};
var JSONTree3 = {"tree1":{"Participant 1":{"This Little Piggy":{}},"Process":{"Had":{},"THIS":{}},"Participant 2":{"None":{}}}};

differnces = diff(JSONTree,JSONTree2);

console.log(differnces)

for(cos in differnces)
	console.log(differnces[cos].kind + " | " +differnces[cos].path)

difff = diff(JSONTree,JSONTree3)
console.log(difff)

//example comparator
var compareJSON = function(obj1, obj2) { 
  var ret = {}; 
  for(var i in obj2) { 
    if(!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) { 
      ret[i] = obj2[i]; 
    } 
  } 
  return ret; 
}; 

console.log(JSON.stringify(compareJSON(JSONTree, JSONTree)));
