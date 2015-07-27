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

function addFilter() {
	var allFilters = document.getElementById("filters");
	var newListItem = document.createElement("li");
	var newFilter = prompt("Please enter a filter", "");
	if (newFilter != null && newFilter.trim() != "") {
		newListItem.innerHTML = newFilter;
	}
	var deleteButton = document.createElement("button");
	deleteButton.className = "icon super-close-circled";
	deleteButton.onclick = function() {
		var confirmDelete = confirm("Delete filter?");
		if (confirmDelete == true) {
		    newListItem.remove();
		}
	}
	newListItem.appendChild(deleteButton);
	allFilters.appendChild(newListItem);
}