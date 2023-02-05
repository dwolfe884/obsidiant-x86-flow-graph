/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => MyPlugin
});
module.exports = __toCommonJS(src_exports);
var import_obsidian = require("obsidian");
var nodeid = 1;
var edgeid = 5555;
var workingx = 0;
var workingy = 0;
var nodes = [];
var edges = [];
var lines = [];
var fromnode = -1;
var locations = {};
var visitslocs = {};
var MyPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.addCommand({
      id: "x86-create-flow-diagram",
      name: "Convert x86 assembly into a flow diagram on a canvas",
      editorCallback: (editor, view) => {
        lines = [];
        nodes = [];
        nodes = [];
        edges = [];
        visitslocs = {};
        locations = {};
        nodeid = 1;
        edgeid = 5555;
        workingx = 0;
        workingy = 0;
        var tmp = editor.getSelection().split("\n");
        tmp.forEach((element) => {
          if (element != "" && !element.contains("```")) {
            lines.push(element);
          }
        });
        lines.forEach((line, linenum) => {
          if (line.split("")[0] != "	" && line.split("")[0] != " ") {
            var newkey = line.trim().split("#")[0].trim();
            if (!locations[newkey]) {
              locations[newkey] = linenum;
              visitslocs[newkey] = 0;
            }
          }
        });
        generatenodes(0, lines, fromnode, "");
        var outfile = "";
        var currfile = this.app.workspace.getActiveFile();
        const d = new Date();
        if (currfile) {
          var outfile = currfile.parent.path + "/" + d.getTime() + ".canvas";
        }
        this.app.vault.create(outfile, '{ "nodes":' + JSON.stringify(nodes) + ',"edges":' + JSON.stringify(edges) + "}");
      }
    });
  }
};
function generatenodes(linenum, text, fromnode2, edgelabel) {
  var retarray = MakeNodeFromLineToNextJump(linenum, text, fromnode2, edgelabel);
  var newnode = retarray[0];
  var whereto = retarray[1];
  if (newnode != null) {
    fromnode2 = newnode["id"];
    var wegood = nodeAlredyAdded(newnode);
    if (wegood) {
      return;
    } else {
      nodes.push(newnode);
    }
  }
  if (whereto == "fin") {
    return;
  }
  var edgelabel = "";
  if (whereto.length != 1) {
    edgelabel = "true";
  }
  generatenodes(locations[whereto[0]], text, fromnode2, edgelabel);
  if (whereto.length == 2) {
    generatenodes(whereto[1], text, fromnode2, "false");
  }
  return;
}
function nodeAlredyAdded(checknode) {
  var retval = false;
  nodes.forEach((node) => {
    if (checknode["startline"] == node["startline"] && checknode["endline"] == node["endline"]) {
      retval = true;
    }
  });
  return retval;
}
function MakeNodeFromLineToNextJump(linenum, text, fromnode2, edgelabel) {
  var currnode = "```\n";
  var i = linenum;
  var newnode;
  var jmploc;
  var newedge = {};
  var edgecolor = "";
  var side = 1;
  if (edgelabel == "false") {
    edgecolor = "1";
    side = -1;
  } else if (edgelabel == "true") {
    edgecolor = "4";
    side = 1;
  }
  while (i < text.length) {
    var line = text[i];
    if (line.split("")[0] == "	" || line.split("")[0] == " ") {
      if (line.trim().split("")[0] == "j") {
        currnode = currnode + line + "\n```";
        newnode = { "id": nodeid, "x": workingx * side, "y": workingy, "width": 550, "height": 25 * currnode.split("\n").length, "type": "text", "text": currnode, "startline": linenum, "endline": i };
        nodeid = nodeid + 1;
        workingy = workingy + 300;
        workingx = workingx + 50 * nodeid;
        if (fromnode2 != -1) {
          newedge = { "id": edgeid, "fromNode": fromnode2, "fromSide": "bottom", "toNode": newnode["id"], "toSide": "top", "label": edgelabel, "color": edgecolor };
          edges.push(newedge);
          edgeid = edgeid + 1;
        }
        if (line.trim().slice(0, 3) == "jmp") {
          jmploc = [line.trim().slice(line.trim().indexOf(" ") + 1, line.length).split("#")[0].trim()];
        } else {
          jmploc = [line.trim().slice(line.trim().indexOf(" ") + 1, line.length).split("#")[0].trim(), i + 1];
        }
        i = text.length + 20;
      } else {
        currnode = currnode + line + "\n";
      }
    } else {
      if (visitslocs[line.trim()] == 0 && i != linenum) {
        currnode = currnode + "```";
        newnode = { "id": nodeid, "x": workingx * side, "y": workingy, "width": 550, "height": 25 * currnode.split("\n").length, "type": "text", "text": currnode, "startline": linenum, "endline": i };
        workingy = workingy + 300;
        workingx = workingx + 50 * nodeid;
        nodeid = nodeid + 1;
        jmploc = [line.trim().slice(line.trim().indexOf(" ") + 1, line.length).split("#")[0].trim()];
        if (fromnode2 != -1) {
          newedge = { "id": edgeid, "fromNode": fromnode2, "fromSide": "bottom", "toNode": newnode["id"], "toSide": "top", "label": edgelabel, "color": edgecolor };
          edges.push(newedge);
          edgeid = edgeid + 1;
        } else {
          i = text.length + 20;
        }
      } else if (visitslocs[line.trim()] == 0 && i == linenum) {
        currnode = currnode + line + "\n";
        visitslocs[line.trim()] = nodeid;
      } else {
        if (currnode == "```\n") {
          newedge = { "id": edgeid, "fromNode": fromnode2, "fromSide": "bottom", "toNode": visitslocs[line.trim()], "toSide": "top", "label": edgelabel, "color": edgecolor };
          edges.push(newedge);
          edgeid = edgeid + 1;
        } else {
          currnode = currnode + "\n```";
          newnode = { "id": nodeid, "x": workingx * side, "y": workingy, "width": 550, "height": 25 * currnode.split("\n").length, "type": "text", "text": currnode, "startline": linenum, "endline": i };
          workingy = workingy + 300;
          workingx = workingx + 50 * nodeid;
          if (fromnode2 != -1) {
            newedge = { "id": edgeid, "fromNode": fromnode2, "fromSide": "bottom", "toNode": newnode["id"], "toSide": "top", "label": edgelabel, "color": edgecolor };
            edges.push(newedge);
            edgeid = edgeid + 1;
            newedge = { "id": edgeid, "fromNode": nodeid, "fromSide": "bottom", "toNode": visitslocs[line.trim()], "toSide": "top", "label": "" };
            edges.push(newedge);
            edgeid = edgeid + 1;
          }
          nodeid = nodeid + 1;
        }
        i = text.length + 20;
        jmploc = "fin";
      }
    }
    i = i + 1;
  }
  if (i != text.length + 21) {
    if (currnode == "```\n") {
      currnode = currnode + "End of assembly\n```";
    } else {
      currnode = currnode + "```";
    }
    newnode = { "id": nodeid, "x": workingx, "y": workingy, "width": 550, "height": 25 * currnode.split("\n").length, "type": "text", "text": currnode, "startline": linenum, "endline": i };
    jmploc = "fin";
    nodeid = nodeid + 1;
    workingy = workingy + 350;
    if (fromnode2 != -1) {
      newedge = { "id": edgeid, "fromNode": fromnode2, "fromSide": "bottom", "toNode": newnode["id"], "toSide": "top", "label": edgelabel, "color": edgecolor };
      edges.push(newedge);
      edgeid = edgeid + 1;
    }
  }
  return [newnode, jmploc];
}
