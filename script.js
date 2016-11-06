// Global variables
var toggleMenuElement, navbarElement;
var windowElement;

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
		navbarElement.show(); // Show .header-navbar if screen is a small device or greater
	} else {
		if (windowWidth < previousWindowWidth) { // Checks if window width decreases
			navbarElement.hide(); // Hide .header-navbar if screen size is lesser than small device
		}
	}

	previousWindowWidth = windowElement.width();
}

function getJoke(jokes) {
    return jokes[Math.round(Math.random() * (jokes.length - 1))];
}

function setJoke(jokes, output) {
    var joke = getJoke(jokes);
    while (output.html() === joke) {
        joke = getJoke(jokes);
    }
    output.html(joke);
}

function cacheJokes(jokes) {
    var output = $("#output");
    $("#fun-section-btn").click(function() {
        setJoke(jokes, output);
    });
}


// Events
$(document).ready(function() {
	// Assign global variables
	toggleMenuElement = $(".toggle-menu");
	navbarElement = $(".header-navbar");
	windowElement = $(window);
	previousWindowWidth = windowElement.width();

	// Assign event listener to elements
	toggleMenuElement.click(toggleMenu);
	windowElement.resize(toggleOnResize);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
		    cacheJokes(JSON.parse(this.responseText).jokes);
		}
	};
	xhttp.open("GET", 'data.json', true);
	xhttp.send();
});

