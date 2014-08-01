var torrentData = require('../model/torrentRequests');

exports.index = function (req, res) {
	torrentData.torrentRequestList(function (err, data) {
		res.render('index', {
			title: 'Test web page on node.js using Express and Mongoose',
			pagetitle: 'Hello there',
			torrents: data
		});
	});
};
