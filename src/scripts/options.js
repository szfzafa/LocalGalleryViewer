// Saves options to localStorage.
function save_options() {
  var bg_color = document.getElementById("bgcolor");
  var color = bg_color.value;
  localStorage["background_color"] = color;

  var bg_pattern = pattern.children[pattern.selectedIndex].value;
  localStorage["background_pattern"] = bg_pattern;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var bg_color = localStorage["background_color"];
  if (!bg_color) {
    bg_color = "333333";
  }
  var bg_color_elem = document.getElementById("bgcolor");
  bg_color_elem.value = bg_color;
  
  var bg_pattern = localStorage["background_pattern"];
  if (!bg_pattern) {
    bg_pattern = "bg_pattern.png";
  }
  var bg_pattern_elem = document.getElementById("pattern");
  
  for (var i = 0; i < bg_pattern_elem.children.length; i++) {
    var child = bg_pattern_elem.children[i];
    if (child.value == bg_pattern) {
      child.selected = "true";
      break;
    }
  }
  update_preview();
}


function default_options() {
  var bg_color_elem = document.getElementById("bgcolor");
  bg_color_elem.value = "333333";
  
  var bg_pattern_elem = document.getElementById("pattern");
  
  for (var i = 0; i < bg_pattern_elem.children.length; i++) {
    var child = bg_pattern_elem.children[i];
    if (child.value == "bg_pattern.png") {
      child.selected = "true";
      break;
    }
  }
  update_preview();
}


function update_preview() {
  var bg_color_elem = document.getElementById("bgcolor");
  var color = bg_color_elem.value;
  var bg_pattern_elem = document.getElementById("pattern");
  var pattern = bg_pattern_elem.children[bg_pattern_elem.selectedIndex].value;
  var previewarea = document.getElementById("previewarea");
  // build update string
  var newbackground = "";
  if (pattern == ""){
    newbackground = color;
  }
  else{
    newbackground = color + " url('css/" + pattern + "') repeat";
  }
  previewarea.style.background = newbackground;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#bgcolor').addEventListener('change', update_preview);
document.querySelector('#pattern').addEventListener('change', update_preview);
document.querySelector('#defaultvalues').addEventListener('click', default_options);
