var DHT = require('bittorrent-dht')
var dht = new DHT({ bootstrap: false })
var hash = Buffer(process.argv[2], 'hex')

dht.addNode('127.0.0.1:5001')
dht.once('node', function () {
  dht.get(hash, function (err, node) {
    if (err) console.error(err)
    else console.log(node.v.toString())
  })
})
