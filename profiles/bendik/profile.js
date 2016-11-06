document.getElementById("age").innerHTML = getAge(27, 5, 1997) + " år";
document.getElementById("image").onclick = function() {
	alert("Vennligst hold fingrene unna fatet.");
}

function getAge(birthday, birthmonth, birthyear) {
	var now = new Date();
	var age = now.getFullYear() - birthyear; // Calculates year
	if (birthmonth === now.getMonth() + 1) { // Checks if it is the current month
		if (birthday < now.getDate()) { // If so, and date is a future date,
			age--; // age is subtracted by one
		}
	} else if (birthmonth > now.getMonth()) { // If month is a future month
		age--; // subtract age by one
	}
	return age;
}
