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
// Express
//
var app = express();

// Database
mongoose.connect('mongodb://localhost/blueworker_database');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("Connection opened...");

	// Create scheme
	var torrentRequestSchema = new mongoose.Schema({
		MagnetLink: String,
		Name: String,
		PriorityCounter: Number,
		Seeders: Number
	});

	// Compile scheme
	mongoose.model('TorrentRequest', torrentRequestSchema);

	console.log("Scheme applyed.");
});

// Config
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

app.get('/', function(req, res) {
	torrentRequests.GetTorrentList(0, 20, function (error, data) {
		res.render('index',
		{
			title: 'Home'
		});
	});
});

app.get('/api/get', function(req, res) {
	var startIndex = req.param("start");
	var numberOfItems = req.param("limit");

	torrentRequests.GetTorrentList(startIndex, numberOfItems, function(error, torrents) {
		res.send(torrents);
	});
});

app.get('/api/submit', function (req, res) {
	var magnetLink = req.param("link");
	var parsed = magnet(magnetLink);

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

// Launch server
var server = app.listen(3000, function () {
	console.log('Listening on port %d', server.address().port);
});



/**************************/
/* CREATE INSTANCE        */
/**************************/
/*
var Torrent = mongoose.model('TorrentRequest');
var instance1 = new Torrent({
	MagnetLink: "magnet:?xt=urn:btih:aecb9c886f67d6c36af4563152d143fefd3a1fff&dn=Dawn.Of.The.Planet.Of.The.Apes.2014.TS.XviD.MP3-RARBG&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
	Name: "Dawn.Of.The.Planet.Of.The.Apes.2014.TS.XviD.MP3-RARBG",
	PriorityCounter: 3,
	Seeders: 1
});
*/
