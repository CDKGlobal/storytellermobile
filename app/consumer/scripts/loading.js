function loadButton(button) {
	var navButton;
	switch(button) {
		case "index":
			navButton = document.getElementById("indexNavButton");
			break;
		case "search":
			navButton = document.getElementById("searchNavButton");
			break;
	}
	window.addEventListener("scroll", function (oEvent) {
		var height = window.innerHeight;
		if(window.pageYOffset > height) {
			navButton.style.display = "block";
		} else {
			navButton.style.display = "none";
		}
	});
}

var timeOut;
function scrollToTop() {
	if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
		window.scrollBy(0, -50);
		timeOut = setTimeout('scrollToTop()', 10);
	} else {
		clearTimeout(timeOut);
		document.getElementById("refreshButton").click();
	}
}