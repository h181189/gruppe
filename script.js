// Global variables

// Elements
var toggleMenuElement, navbarElement;
var windowElement;

// Variables
var previousWindowWidth;

// Functions
function isSmallDevice(width) {
	return width >= 768;
}

function toggleMenu() {
	navbarElement.toggle(200);
}

function toggleOnResize() {
	var windowWidth = windowElement.width();

	if (isSmallDevice(windowWidth)) {
		navbarElement.show();
	} else {
		navbarElement.hide();
	}

	previousWindowWidth = windowElement.width();
}


// Events
$(document).ready(function() {
	toggleMenuElement = $(".toggle-menu");
	navbarElement = $(".header-navbar");
	windowElement = $(window);

	toggleMenuElement.click(toggleMenu);

	previousWindowWidth = windowElement.width();
	windowElement.resize(toggleOnResize);
});
