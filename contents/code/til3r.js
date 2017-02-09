var clients = workspace.clientList();
var activeClient;

for (var i=0; i<clients.length; i++) {
    if (clients[i].active) {
      activeClient = clients[i];      
    }
}

workspace.clientActivated.connect(function(client){
  activeClient = client;
});

// function to check for valid clients taken from the tiling-kwin-script
// Copyright (C) 2012 Mathias Gottschlag <mgottschlag@gmail.com>
// Copyright (C) 2013-2014 Fabian Homborg <FHomborg@gmail.com>
var isIgnored = function(client) {
	// TODO: Add regex and more options (by title/caption, override a floater, maybe even a complete scripting language / code)
	// Application workarounds should be put here
	// HACK: Qt gives us a method-less QVariant(QStringList) if we ask for an array
	// Ask for a string instead (which can and should still be a StringList for the UI)
	var fl = "yakuake,krunner,plasma,plasma-desktop,plugin-container,Wine,klipper";
	// TODO: This could break if an entry contains whitespace or a comma - it needs to be validated on the qt side
	var floaters = String(readConfig("floaters", fl)).replace(/ /g,"").split(",");
	if (floaters.indexOf(client.resourceClass.toString()) > -1) {
		return true;
	}
	// HACK: Steam doesn't set the windowtype properly
	// Everything that isn't captioned "Steam" should be a dialog - these resize worse than the main window does
	// With the exception of course of the class-less update/start dialog with the caption "Steam" (*Sigh*)
	if (client.resourceClass.toString() == "steam" && client.caption != "Steam") {
		return true;
	} else if (client.resourceClass.toString() != "steam" && client.caption == "Steam") {
		return true;
	}
	if (client.specialWindow == true) {
		return true;
	}
	if (client.desktopWindow == true) {
		return true;
	}
	if (client.dock == true) {
		return true;
	}
	if (client.toolbar == true) {
		return true;
	}
	if (client.menu == true) {
		return true;
	}
	if (client.dialog == true) {
		return true;
	}
	if (client.splash == true) {
		return true;
	}
	if (client.utility == true) {
		return true;
	}
	if (client.dropdownMenu == true) {
		return true;
	}
	if (client.popupMenu == true) {
		return true;
	}
	if (client.tooltip == true) {
		return true;
	}
	if (client.notification == true) {
		return true;
	}
	if (client.comboBox == true) {
		return true;
	}
	if (client.dndIcon == true) {
		return true;
	}

    return false;
};

var resizeAndMove = function(choice){
  if (isIgnored(activeClient)) {
    print("client ignored, no resize and move");
    return;
  }
  wide = Math.floor(choice / 10);
  choice = choice % 10;
  print("TIL3R called with wide: " + wide + ", choice " + choice);
  var workGeo = workspace.clientArea(KWin.PlacementArea, activeClient.screen, 1);
  var geo = activeClient.geometry;
  
  if (workGeo.width > workGeo.height) // landscape mode
  {
    geo.x = workGeo.x + (choice - 1) % 3 * workGeo.width / 3;      
    geo.width = wide * workGeo.width / 3;
    geo.y = workGeo.y;
    if (choice>6) {
      geo.y = workGeo.y + workGeo.height / 2;
    }
    geo.height = workGeo.height;
    if (choice>3) {
      geo.height = workGeo.height/2;
    }
  }
  else
  {
    geo.y = workGeo.y + (choice - 1) % 3 * workGeo.height / 3;      
    geo.height = wide * workGeo.height / 3;
    geo.x = workGeo.x;
    if (choice>6) {
      geo.x = workGeo.x + workGeo.width / 2;
    }
    geo.width = workGeo.width;
    if (choice>3) {
      geo.width = workGeo.width/2;
    }
  }
  
  
  print("new geometry, x: " + geo.x + " y: " + geo.y + " width: " + geo.width + " height: " + geo.height);
  activeClient.geometry = geo;
}

var reposition = function(wu, hu, fx, fy, w, h) {
  if (isIgnored(activeClient)) {
    print("client ignored, no resize and move");
    return;
  }
  var workGeo = workspace.clientArea(KWin.PlacementArea, activeClient.screen, 1);
  var geo = activeClient.geometry;
  geo.x = workGeo.x + fx * workGeo.width / wu;
  geo.y = workGeo.y + fy * workGeo.height / hu;
  geo.width = w * workGeo.width / wu;
  geo.height = h * workGeo.height / hu;
  print("new geometry, x: " + geo.x + " y: " + geo.y + " width: " + geo.width + " height: " + geo.height);
  activeClient.geometry = geo;
}


print("TIL3R active");

registerShortcut("TIL3R: 1", "TIL3R: 1", "Meta+1", function () {reposition(8,8,2,4,4,4)});
registerShortcut("TIL3R: 2", "TIL3R: 2", "Meta+2", function () {reposition(8,8,2,0,4,4)});
registerShortcut("TIL3R: 3", "TIL3R: 3", "Meta+3", function () {reposition(8,8,6,0,2,4)});
registerShortcut("TIL3R: 4", "TIL3R: 4", "Meta+4", function () {reposition(8,8,6,4,2,4)});
registerShortcut("TIL3R: 5", "TIL3R: 5", "Meta+5", function () {reposition(8,8,0,0,2,4)});
registerShortcut("TIL3R: 6", "TIL3R: 6", "Meta+6", function () {reposition(8,8,0,4,2,4)});
