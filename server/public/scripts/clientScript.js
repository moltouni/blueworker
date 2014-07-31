$(document).ready(function() {
	$("#submitLink").click(function() {
		var magnet = $("#submitLinkValue").val();

		$.ajax({
			url: "api/submit",
			data: { link: magnet }
		}).done(function (res) {
			console.log(res);
		});
	});
});