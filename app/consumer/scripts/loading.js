window.onload = function() {
	var topButton = document.getElementById("topNavButton");
	window.addEventListener("scroll", function (oEvent) {
		// var mydivpos = document.getElementById("allMessages").offsetTop;
		var height = window.innerHeight;
		if(window.pageYOffset > height) {
			topButton.style.display = "block";
		} else {
			topButton.style.display = "none";
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