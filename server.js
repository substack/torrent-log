var http = require('http')
var concat = require('concat-stream')
var kp = require('bittorrent-dht-store-keypair')()

var dht = new(require('bittorrent-dht'))({ bootstrap: false })
dht.listen(5001)

console.log(kp.id)
var prev = 'null'
updateHash(prev)

var server = http.createServer(function (req, res) {
  if (req.url === '/post') {
    req.pipe(concat(function (body) {
      post(body, function (err, hash) {
        res.end(hash.toString('hex') + '\n')
      })
    }))
  }
  else res.end('not found\n')
})
server.listen(5000)

function post (value, cb) {
  value = Buffer.concat([
    Buffer(prev.toString('hex') + '\n'),
    value
  ])
  dht.put({ v: value }, function (errors, hash) {
    errors.forEach(console.error)
    prev = hash
    console.log(hash.toString('hex'))
    updateHash(hash)
    cb(null, hash)
  })
}

var seq = 0
function updateHash (hash) {
  var hex = hash.toString('hex')
  dht.put(kp.store(hex), function onput(errors, hash) {
    errors.forEach(console.error)
  })
}
