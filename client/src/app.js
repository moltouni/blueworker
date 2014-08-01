var BitTorrentClient = require('bittorrent-client')
var util = require('util');

var client = BitTorrentClient()

// TODO Bug with large files (buffer size is too small)
client.add('magnet:?xt=urn:btih:64d9e4d4742cabe57609154410ab2ab9af8fedbe&dn=Kick+2014+Hindi+DVDSCR-Rip+Xvid+Mp3-TeamTNT+&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337')


var stateCounter = 0;
setInterval(function() {    
    util.print("\u001b[2J\u001b[0;0H");
    util.print("blueworker");

    util.print("\nSpeed\n")
    util.print("\tDownload: " + (client.downloadSpeed() / 1024) + " kB/s\n");
    util.print("\tUpload:   " + (client.uploadSpeed() / 1024) + " kB/s\n"); 

    var uploaded = client.torrents.reduce(function (total, torrent) {
      return total + torrent.uploaded
    }, 0)
    var downloaded = client.torrents.reduce(function (total, torrent) {
      return total + torrent.downloaded
    }, 0)

    util.print("\nTotal\n");
    util.print("\tDownloaded: " + (downloaded / 1024) + " kB\n");
    util.print("\tUploaded:   " + (uploaded / 1024) + " kB\n"); 

    if (stateCounter == 0) util.print(" |\n");
    else if (stateCounter == 1) util.print(" /\n");
    else if (stateCounter == 2) util.print(" -\n");
    else  {
        util.print(" \\\n");
        stateCounter = 0;
    }
    stateCounter++;
    
}, 500);
