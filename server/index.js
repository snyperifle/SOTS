const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const port = 3999
app.listen(port, () => console.log(`Express server is running on localhost: ${port}`))
//=============================================================
let servers = ['ms212rdctx06', 'ms212rdctx07', 'ms212rdctx08', 'ms212rdctx11', 'ms212rdctx12', 'ms212rdctx14', 'ms212rdctx15', 'ms212rdctx16'];
let filePath = `//${servers[0]}/routing/UserConfigCalvinTest.txt`;

app.get('/getFiles', (req, res) => {
  let fs = require('fs');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data))
  })
})

app.post('/updateUserConfigs', (req, res) => {
  let fs = require('fs');
  servers.forEach((item) => {
    fs.writeFile(`//${item}/routing/UserConfigCalvinTest.txt`, req.body.data, function (err, res) {
      if (err) throw err;
    });
  })
  res.send('test');
})
