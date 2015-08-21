var DHT = require('bittorrent-dht')
var dht = new DHT({ bootstrap: false })
var hash = Buffer(process.argv[2], 'hex')

dht.addNode('127.0.0.1:5001')
dht.once('node', function () {
  dht.get(hash, function onget (err, node) {
    var body = node.v.toString()
    console.log(body)
    console.log('------------------------')
    var hash = body.split('\n')[0]
    if (hash !== 'null') dht.get(Buffer(hash, 'hex'), onget)
  })
})
