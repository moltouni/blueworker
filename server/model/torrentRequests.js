var mongoose = require('mongoose');

exports.UpdateTorrentRequest = function UpdateTorrentRequest(request, callback) {
	request.save();
	callback();
};

exports.CreateTorrentRequest = function CreateTorrentRequest(link, name, callback) {
	var Requests = mongoose.model('TorrentRequest');
	var requestInstance = new Requests({
		MagnetLink: link,
		Name: name || "Name not provided",
		PriorityCounter: 1,
		Seeders: 0
	});
	requestInstance.save();
	callback();
};

exports.GetTorrentByMagnetLink = function GetTorrentByMagnetLink(magnetLink, callback) {
	var Requests = mongoose.model('TorrentRequest');
	Requests.find({
		"MagnetLink": magnetLink 
	},function (err, torrents) {
		if (err) {
			console.log(err);
			callback(err);
		} else if (torrents.length > 1) {
			var errorMessage = "Multiple matched torrents for " + magnetLink;
			console.log(errorMessage);
			callback(errorMessage);
		} else {
			console.log(torrents);
			callback(undefined, torrents[0]);
		}
	});
};

exports.GetTorrentList = function GetTorrentList(toSkip, limit, callback) {
	var Requests = mongoose.model('TorrentRequest');
	Requests.find(undefined, undefined, {
		skip: toSkip || 50,
		limit: limit || 50,
		sort: {
			PriorityCounter: -1 //Sort by priority DESC
		}
	}, function (err, torrents) {
		if (err) {
			console.log(err);
			callback(err);
		} else {
			callback("", torrents);
		}
	});
};

