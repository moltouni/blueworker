var mongoose = require('mongoose');

exports.torrentRequestList = function torrentRequestList(callback) {
	var Requests = mongoose.model('TorrentRequest');
	Requests.find(undefined, undefined, {
		skip: 0, // Starting Row
		limit: 50, // Ending Row
		sort: {
			PriorityCounter: -1 //Sort by Date Added DESC
		}
	}, function(err, teams) {
		if (err) {
			console.log(err);
		} else {
			console.log(teams);
			callback("", teams);
		}
	}); // end Team.find
}; // end exports.teamlist
