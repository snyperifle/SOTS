const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const port = 3999
app.listen(port, () => console.log(`Express server is running on localhost: ${port}`))
//=============================================================
let servers = ['ms212rdctx06', 'ms212rdctx07', 'ms212rdctx08', 'ms212rdctx11', 'ms212rdctx12', 'ms212rdctx14', 'ms212rdctx15', 'ms212rdctx16'];
// let filePath = `//${servers[0]}/routing/UserConfigCalvinTest.txt`;
let filePath = `//${servers[0]}/routing/UserConfig.txt`;

app.get('/getFiles', (req, res) => {
  console.log('Getting OpCo Info');
  let fs = require('fs');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data))
  })
})
//=============================================================
app.post('/updateUserConfigs', (req, res) => {
  console.log('Updating User Configs');
  let fs = require('fs');
  servers.forEach((item) => {
    // fs.writeFile(`//${item}/routing/UserConfigCalvinTest.txt`, req.body.data, (err, res) => {
    fs.writeFile(`//${item}/routing/UserConfig.txt`, req.body.data, (err, res) => {
      if (err) throw err;
    });
  })
  res.send('User Configs updated');
})
//=============================================================
app.post('/routesNotFlowing', (req, res) => {
  let fs = require('fs');
  let found = {
    sendable: true,
    result: 'Route Not Found',
    path: '',
  };
  let dlroutes = [];
  let ulroutes = [];

  function sendRoutes(path, file) {
    res.json(found)
  }

  console.log(`Searching for route ${req.body.data.route} for ${req.body.data.userOpCo}`);

  servers.forEach((item) => {
    let path = `//${item}/routing/${req.body.data.userOpCo}/RTRDL`;
    fs.readdir(path, (err, res) => {
      if (err) throw err;
      res.forEach((item2) => {
        fs.readFile(`${path}/${item2}`, 'utf8', (err, data) => {
          if (err) throw err
          let content = data.split('\n')
          content.forEach((item3) => {
            if (item3.slice(16, 20) === req.body.data.route && found.sendable === true) {
              console.log('Download found');
              found.sendable = false
              found.result = 'Route Found'
              found.path = `${path}/${item2}`
              sendRoutes();
            };
          })
        })
      })
    })
  })
  let serverCounter = 0;
  servers.forEach((item) => {
    serverCounter++;
    let path = `//${item}/routing/${req.body.data.userOpCo}/RTRUL`;
    fs.readdir(path, (err, res) => {
      if (err) throw err;
      let fileCounter = 0;
      let fileCount = res.length
      res.forEach((item2) => {
        fileCounter++;
        fs.readFile(`${path}/${item2}`, 'utf8', (err, data) => {
          if (err) throw err
          let content = data.split('\n')
          let orderCounter = 0;
          content.forEach((item3) => {
            orderCounter++;
            if (item3.slice(20, 24) === req.body.data.route && found.sendable === true) {
              console.log('Upload found');
              found.sendable = false
              found.result = 'Route Found'
              found.path = `${path}/${item2}`
              sendRoutes();
            };
          })
        })
      })
    })
  })

  setTimeout(() => {
    if(found.sendable === true){
      sendRoutes();
    }
  },10000)

})
//=============================================================
let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME
};

sql.connect(config, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Connected to DB');
  // app.use(opcoObjData);
  // app.use(homeRoute);
  // app.use(dispatchRoute);
  // app.use(processRoute);
  // app.use(equipmentRoute);
});

app.get('/gasboyEquipment', (req, res) => {


  let db = new sql.Request();

  db.query("select Equipment.EquipmentIdentifier, Equipment.Description, EquipmentExtended.ConstructionYear, Equipment.Manufacturer, Equipment.ModelNumber, Equipment.SerialNumber" +
    "from ((Equipment INNER JOIN EquipmentExtended on Equipment.EquipmentID = EquipmentExtended.EquipmentID)" +
    "INNER JOIN Company on Equipment.SiteCodeID = Company.SiteCodeID) where Company.Name = '" +
    req.selectedOpCoNumber + "' and (Equipment.EquipmentIdentifier = " +
    req.queryString + ")",
    (err, result) => {
      if (err) {
        console.log(err)
      }
    })

})