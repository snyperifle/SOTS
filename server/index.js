const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.listen(3001, () => console.log('Express server is running on localhost: 3001'))
//=============================================================
let servers = [1, 2, 3];
app.get('/getFiles', (req, res) => {
  let fs = require('fs');
  let filePath = `../Test/Test${1}/UserConfig.txt`;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data))
  })
})

app.post('/updateUserConfigs', (req, res) => {
  let fs = require('fs');
  servers.forEach((item) => {
    fs.writeFile(`../Test/Test${item}/UserConfig.txt`, req.body.data);
  })
})
