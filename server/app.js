var application_root = __dirname;

//
// Requires
//
var express = require('express');
var path = require("path");
var mongoose = require('mongoose');
var stylus = require('stylus');
var nib = require('nib');
var torrentRequests = require('./model/torrentRequests');
var magnet = require('magnet-uri');

//
// Database
//
mongoose.connect('mongodb://localhost/blueworker_database');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("Connection opened...");

	torrentRequests.CompileScheme();
});

//
// Express Config
//
var app = express();

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib());
}

app.configure(function () {
	app.set('views', application_root + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger('dev'));
	app.use(stylus.middleware(
		{
			src: application_root + '/public',
			compile: compile
		}
	));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//
// Express request registration
//
app.get('/', function(req, res) {
	torrentRequests.GetTorrentList(0, 20, function (error, data) {
		res.render('index',
		{
			title: 'Home'
		});
	});
});

// 
// Express API request registration
//
app.get('/api/seeding', function(req, res) {
	/// <summary>
	/// Marks torrent request with seeder. This is called when 
	/// seed-box downloads torrent and starts only seeding.
	/// </summary>
	/// <param name="req">
	/// POST `link` - magnet link that is being seeded
	/// </param>
	/// <param name="res">
	/// Responds with `status: ok` when there is no error
	/// Responds with `status` as message and error `code`
	/// 
	/// Error codes
	/// API1201 - Couldn'try find torrent request with given magnet link
	/// </param>

	var magnetLink = req.param("link");

	torrentRequests.GetTorrentByMagnetLink(magnetLink, function(error, torrent) {
		if (error || !torrent) {
			res.send({ status: "no matching torrent request found " + magnetLink, code: "API1201" });
		} else {
			torrent.SeedersFull++;
			torrentRequests.UpdateTorrentRequest(torrent, function() {
				res.send({ status: "ok" });
			});
		}
	});
});

app.get('/api/get', function (req, res) {
	/// <summary>
	/// Returns list of active torrent requests
	/// </summary>
	/// <param name="req">
	/// [Optional] POST `start` - number of torrents to skip, zero-indexed
	/// [Optional] POST `limit` - limit number of torrents to return
	/// [Optional] POST `seeder` - value `true` signals that these torrents are being seeded by seed-box
	/// </param>
	/// <param name="res">
	/// Responds with array of torrents in given range when there is no error.
	/// Responds with `status` as message and error `code`
	/// 
	/// Error codes
	/// API1001 - Error retrieving data from database
	/// </param>

	var startIndex = req.param("start");
	var numberOfItems = req.param("limit");
	var isSeedBox = req.param("seeder") == "true";

	torrentRequests.GetTorrentList(startIndex, numberOfItems, function (error, torrents) {
		if (error) {
			res.send({ status: "unable to retrueve torrents. " + error, code: "API1001" });
		} else {
			if (isSeedBox) {
				// Increment seeders count if this request came from seeder-bix
				for (var index = 0; index < torrents.length; index++) {
					torrents[index].Seeders++;
					torrentRequests.UpdateTorrentRequest(torrents[index], function() {});
				}
			}

			res.send(torrents);
		}
	});
});

app.get('/api/submit', function (req, res) {
	/// <summary>
	/// Accepts torrent requests
	/// </summary>
	/// <param name="req">
	/// POST `link` - requested magnet link
	/// 
	/// Valid magnet link must contain at least `xt` argument
	/// </param>
	/// <param name="res">
	/// Responds with `status: created` or `status: updated` when there is no error.
	/// Responds with `status` as message and error `code`
	/// 
	/// Error codes
	/// API1101 - Magnet link doedn'try contain `xt` argument
	/// </param>

	var magnetLink = req.param("link");
	var parsed = magnet(magnetLink);

	if (!parsed["xt"]) {
		res.send({ status: "invalid magnet link. xt must be provided", code: "API1101" });
	}

	torrentRequests.GetTorrentByMagnetLink(magnetLink, function(error, torrent) {
		// Create if none matched, update otherwise
		if (error || !torrent) {
			torrentRequests.CreateTorrentRequest(magnetLink, parsed["dn"], function() {
				res.send({ status: "created" });
			});
		} else {
			torrent.PriorityCounter++;
			torrentRequests.UpdateTorrentRequest(torrent, function() {
				res.send({ status: "updated" });
			});
		}
	});
});

//
// Launch server
//
var server = app.listen(3000, function () {
	console.log('Listening on port %d', server.address().port);
});
