var magnet = require('magnet-uri')

// "Leaves of Grass" by Walt Whitman
var uri = 'magnet:?xt=urn:btih:aecb9c886f67d6c36af4563152d143fefd3a1fff&dn=Dawn.Of.The.Planet.Of.The.Apes.2014.TS.XviD.MP3-RARBG&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337'

var parsed = magnet(uri)
console.log(parsed.dn) 
console.log(parsed.infoHash) 