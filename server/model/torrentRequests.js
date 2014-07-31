var mongoose = require('mongoose');

exports.torrentRequestList = function torrentRequestList(callback) {
	var Requests = mongoose.model('TorrentRequest');
	Requests.find(function (err, teams) {
		if (err) {
			console.log(err);
		} else {
			console.log(teams);
			callback("", teams);
		}
	}); // end Team.find
}; // end exports.teamlist
