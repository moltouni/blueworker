var mongoose = require('mongoose');

exports.CompileScheme = function CompileScheme() {
	// Create scheme
	var torrentRequestSchema = new mongoose.Schema({
		MagnetLink: String,
		Name: String,
		PriorityCounter: Number,
		Seeders: Number,
		Score: Number
	});

	// Compile scheme
	mongoose.model('TorrentRequest', torrentRequestSchema);

	console.log("TorrentRequest Scheme compiled");
};

exports.UpdateTorrentRequest = function UpdateTorrentRequest(request, callback) {
	request.Score = request.PriorityCounter - request.Sedders;
	request.save();
	callback();
};

exports.CreateTorrentRequest = function CreateTorrentRequest(link, name, callback) {
	var Requests = mongoose.model('TorrentRequest');
	var requestInstance = new Requests({
		MagnetLink: link,
		Name: name || "Name not provided",
		PriorityCounter: 1,
		Seeders: 0,
		Score: 1
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
			Score: -1 //Sort by Score DESC
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

