var clientViewModel = {
	torrents: new ko.observableArray()
};
ko.applyBindings(clientViewModel);

function UpdateList() {
	// Request torrents list
	$.ajax({
		url: "api/get",
		data: { start: 0, limit: 20 }
	}).done(function (res) {
		clientViewModel.torrents.removeAll();
		for (var index = 0; index < res.length; index++) {
			var torrent = res[index];
			clientViewModel.torrents.push(torrent);
		}
	});
}

$(document).ready(function () {
	$("#submitLink").click(function() {
		var magnet = $("#submitLinkValue").val();

		$.ajax({
			url: "api/submit",
			data: { link: magnet }
		}).done(function (res) {
			UpdateList();
		});
	});

	UpdateList();
});