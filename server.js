var http = require('http')
var path = require('path')
var fs = require('fs')
var pubDir = path.join(__dirname, 'public')
var staticFiles = fs.readdirSync(pubDir)
headers = {}
files = {}

/* This loop was inspired by this stackoverflow post https://stackoverflow.com/questions/28822034/simple-node-js-server-that-sends-htmlcss-as-response  */

staticFiles.forEach((fileName)=>{
    var dotoffset = fileName.lastIndexOf('.')
    var fileData = fs.readFileSync(path.join(pubDir, fileName))
    files[fileName] = fileData
    var mimetype = dotoffset == -1
                            ? 'text/plain'
                            : {
                                '.html' : 'text/html',
                                '.ico' : 'image/x-icon',
                                '.jpg' : 'image/jpeg',
                                '.png' : 'image/png',
                                '.gif' : 'image/gif',
                                '.css' : 'text/css',
                                '.js' : 'text/javascript'
                                }[ fileName.substr(dotoffset) ]
            headers[fileName] = ({'Content-type' : mimetype})
})

 const port = process.env.PORT || 3000
 var server = http.createServer( (req, res) => {
    var requestedFile = req.url
    var statusCode = 200
    if(requestedFile[0] === '/'){
        requestedFile = requestedFile.substr(1)
    }
    if(requestedFile === ''){
        requestedFile = 'index.html'
    }
    if(!files[requestedFile]){
        requestedFile = '404.html'
        statusCode = 404
    }
    res.writeHead(statusCode, headers[requestedFile])
    res.write(files[requestedFile])
    res.end()
})      

server.listen(port, ()=>{
    console.log(`listening on port: ${port}`)
})