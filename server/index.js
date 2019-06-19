const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const schedule = require('node-schedule');
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const port = 3999
app.listen(port, () => console.log(`Express server is running on localhost: ${port}`))
//=============================================================
let servers = ['ms212rdctx06', 'ms212rdctx07', 'ms212rdctx08', 'ms212rdctx11', 'ms212rdctx12', 'ms212rdctx14', 'ms212rdctx15', 'ms212rdctx16'];
let filePath = `//${servers[0]}/routing/UserConfig.txt`;
let fs = require('fs');
let fse = require('fs-extra');
//=============================================================
app.get('/getFiles', (req, res) => {
  // console.log('Getting OpCo Info');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data))
  })
})
//=============================================================
let gbconfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME
};
let gs1config = {
  user: process.env.GS1_USER,
  password: process.env.GS1_PW,
  domain: process.env.GS1_DOMAIN,
  database: process.env.GS1_DB,
  driver: process.env.GS1_DRIVER,
  server: process.env.GS1_SERVER,
}
let gbsql = new sql.ConnectionPool(gbconfig)
let gs1sql = new sql.ConnectionPool(gs1config)
//=============================================================
app.post('/updateUserConfigs', (req, res) => {
  // console.log('Updating User Configs');
  servers.forEach((item) => {
    // fs.writeFile(`//${item}/routing/UserConfigCalvinTest.txt`, req.body.data, (err, res) => {
    fs.writeFile(`//${item}/routing/UserConfig.txt`, req.body.data, (err, res) => {
      if (err) throw err;
    });
  })
  res.send(`User Configs updated!`);
})
app.post('/replaceRIConfig', (req, res) => {
  let filesReplaced = [];
  servers.forEach((server) => {
    let path = `//ms212rdctx06/ROUTING/XXX-${req.body.data.OpCo.substring(4)}`
    fs.readdir(path, (err, res) => {
      if (err) console.log(err);;
      if (res) {
        res.forEach((file) => {
          filesReplaced.push(`${server} - ${file}`);
          fs.readFile(`${path}/${file}`, 'utf8', (err, data) => {
            if (err) console.log(err);
            if (data) {
              data = data.split('XXX').join(`${req.body.data.OpCo.substring(0, 3)}`)
                .split('YYYYY').join(`${req.body.data.OpCo}`)
                .split('ZZZZZ').join(`${req.body.data.name[0].OpCoName}`.padEnd(30, ' '))
                .split('SERVER').join(`${server}`)
              fs.writeFile(`//${server}/ROUTING/${req.body.data.OpCo}/${file}`, data, (err, res) => {
                if (err) console.log(err);
              })
            }
          })
        })
      }
    })
    fs.writeFile(`//${server}/ROUTING/${req.body.data.OpCo}/LOCKOUT.TMP`, '', (err, res) => {
      if (err) console.log(err);
    })
  })
  setTimeout(() => {
    res.send(filesReplaced)
  }, 2000)
})
//=============================================================
app.post('/routesNotFlowing', (req, res) => {
  let found = {
    sendable: true,
    result: 'Route Not Found',
    path: '',
  };

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
  servers.forEach((item) => {
    let path = `//${item}/routing/${req.body.data.userOpCo}/RTRUL`;
    fs.readdir(path, (err, res) => {
      if (err) throw err;
      res.forEach((item2) => {
        fs.readFile(`${path}/${item2}`, 'utf8', (err, data) => {
          if (err) throw err
          let content = data.split('\n')
          content.forEach((item3) => {
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
    if (found.sendable === true) {
      sendRoutes();
    }
  }, 5000)

})
//=============================================================
app.post('/restoreColumns', (req, res) => {
  console.log(`Restoring Profile for ${req.body.data}`);
  let files = ['rnedrte.cps', 'tsmaint.cps', 'rnedrte.wps', 'tsmaint.wps'];
  let copied = [];
  let backupFolder = '//ms212rdfsc/ern-support/DOCs/SOTS stuff/rdclient-backup/'
  let destinationFolder = '//ms212rdfsc/rdclient$/'

  fse.pathExists(`${backupFolder}${req.body.data}`, (err, exists) => {
    if (err) throw err;
    if (exists) {
      files.forEach((item) => {
        fse.pathExists(`${backupFolder}${req.body.data}/${item}`, (err, exists) => {
          if (err) throw err;
          if (exists) {
            fse.copy(`${backupFolder}${req.body.data}/${item}`, `${destinationFolder}${req.body.data}/${item}`)
              .then(() => {
                console.log(`${item} copied from ${backupFolder} to ${destinationFolder}`)
                copied.push(item);
              })
              .catch((error) => {
                console.log(error);
              })
          } else console.log(`${item} not found in ${backupFolder}${req.body.data.fromProfile}`);
        })
      })
    } else {
      console.log(`${req.body.data} does not exist in ${backupFolder}`)
    }
  })
  setTimeout(() => {
    res.send(copied);
  }, 5000)
})
//=============================================================
app.post('/mirrorProfile', (req, res) => {
  console.log(`Mirroring Profile from ${req.body.data.fromProfile} to ${req.body.data.toProfile}`);
  let files = ['rnedrte.cps', 'tsmaint.cps', 'rnedrte.wps', 'tsmaint.wps'];
  let copied = [];
  let backupFolder = '//ms212rdfsc/ern-support/DOCs/SOTS stuff/rdclient-backup/'
  let destinationFolder = '//ms212rdfsc/rdclient$/'

  fse.pathExists(`${backupFolder}${req.body.data.fromProfile}`, (err, exists) => {
    if (err) throw err;
    if (exists) {
      files.forEach((item) => {
        fse.pathExists(`${backupFolder}${req.body.data.fromProfile}/${item}`, (err, exists) => {
          if (err) throw err;
          if (exists) {
            fse.copy(`${backupFolder}${req.body.data.fromProfile}/${item}`, `${destinationFolder}${req.body.data.toProfile}/${item}`)
              .then(() => {
                console.log(`${item} copied from ${backupFolder} to ${destinationFolder}`);
                copied.push(item);
              })
              .catch((error) => {
                console.log(error);
              })
          } else console.log(`${item} not found in ${backupFolder}${req.body.data.fromProfile}`);
        })
      })
    }
    else {
      console.log(`${req.body.data.fromProfile} does not exist in ${backupFolder}`);
    }
  })
  setTimeout(() => {
    res.send(copied);
  }, 5000)
})
//=============================================================
app.get('/connectToGBDB', (req, res) => {
})
//=============================================================
app.post('/gasboyEquipment', (req, res) => {
  let query = req.body.data.queue.reduce((result, item) => {
    if (item === req.body.data.queue[0]) return result
    else return result += ` OR EquipmentIdentifier = '${item}'`
  }, `'${req.body.data.queue[0]}'`)
  let excelData = [];
  gbsql.connect()
    .then((pool) => {
      console.log('/////////////////////////');
      console.log('Connected to GB DB');
      console.log('Fetching data from GB DB');
      pool.query(
        "select Equipment.EquipmentIdentifier, Equipment.Description, EquipmentExtended.ConstructionYear, Equipment.Manufacturer, Equipment.ModelNumber, Equipment.SerialNumber " +
        "from ((Equipment INNER JOIN EquipmentExtended on Equipment.EquipmentID = EquipmentExtended.EquipmentID) " +
        "INNER JOIN Company on Equipment.SiteCodeID = Company.SiteCodeID) where Company.Name = '" +
        req.body.data.selectedOpCoNumber + "' and (Equipment.EquipmentIdentifier = " +
        query + ")"
      )
        .then((result) => {
          gbsql.close().then(() => console.log('GB Connection closed'))
          result.recordset.forEach((item) => {
            if (item.EquipmentIdentifier.substring(0, 1) === '1') {
              let temp = {
                '// Action': 'R',
                'Record_type-Mean': 'Mean',
                Name: (item.EquipmentIdentifier + " " + item.Description).substring(0, 31),
                Status: '2',
                Type: '3',
                Hardware_type: '6',
                'Auth-type': '1',
                Employee_type: '1',
                Vehicle_no: item.EquipmentIdentifier,
                String: req.body.data.opcoData.stationCode + item.EquipmentIdentifier,
                Fleet_name: req.body.data.opcoData.fleetName,
                Department_name: req.body.data.opcoData.stationCode + " Tractors/IFTA",
                Rule_name: 'Diesel',
                Driver_id_type: '0',
                Price_list_name: '',
                Model_name: item.ModelNumber,
                Pump_name: '',
                Year: item.ConstructionYear,
                Capacity: '150',
                Consumption: '7',
                Odometer: '0',
                Cust_id: item.SerialNumber,
                Address: '',
                'Account-type': '0',
                Available_amount: '0',
                Use_pin_code: '0',
                Pin_code: '0',
                Auth_pin_from: '2',
                Nr_pin_retries: '0',
                Block_if_pin_retries_fail: '0',
                OrPT_prompt_for_plate: '0',
                OrPT_prompt_for_odometer: '1',
                Do_odometer_reasonability_check: '0',
                Max_odometer_delta_allowed: '0',
                Nr_odometer_retries: '0',
                Engine_hours: '0',
                Original_engine_hours: '0',
                Target_engine_hours: '0',
                'Two-stage_list': '',
                OrPT_prompt_for_engine_hours: '0',
                Address2: '',
                City: '',
                State: '',
                Zip: '',
                Phone: '',
                UserData1: '',
                UserData2: '',
                UserData3: '',
                UserData4: '',
                UserData5: '',
                Start_odometer: '0',
                EH_consumption: '0.75',
                Allow_ID_replacement: '2',
                Number_of_strings: '3',
                String2: '',
                String3: '',
                String4: '',
                String5: '',
                Plate_check_type: '1',
                Nr_plate_retries: '0',
                Block_if_plate_retries_fail: '0'
              }
              if (req.body.data.selectedOpCoNumber === '049') temp.Department_name = req.body.data.opcoData.stationCode + " Tractors_IFTA"
              excelData.push(temp);
            }
            else if (item.EquipmentIdentifier.substring(0, 1) === '2') {
              let temp = {
                '// Action': 'R',
                'Record_type-Mean': 'Mean',
                Name: (item.EquipmentIdentifier + " " + item.Description).substring(0, 31),
                Status: '2',
                Type: '3',
                Hardware_type: '6',
                'Auth-type': '1',
                Employee_type: '1',
                Vehicle_no: item.EquipmentIdentifier,
                String: req.body.data.opcoData.stationCode + item.EquipmentIdentifier,
                Fleet_name: req.body.data.opcoData.fleetName,
                Department_name: req.body.data.opcoData.stationCode + " Trailers/Off-Road",
                Rule_name: 'No Restriction',
                Driver_id_type: '0',
                Price_list_name: '',
                Model_name: item.ModelNumber,
                Pump_name: '',
                Year: item.ConstructionYear,
                Capacity: '50',
                Consumption: '0',
                Odometer: '0',
                Cust_id: item.SerialNumber,
                Address: '',
                'Account-type': '0',
                Available_amount: '0',
                Use_pin_code: '0',
                Pin_code: '0',
                Auth_pin_from: '2',
                Nr_pin_retries: '0',
                Block_if_pin_retries_fail: '0',
                OrPT_prompt_for_plate: '0',
                OrPT_prompt_for_odometer: '0',
                Do_odometer_reasonability_check: '0',
                Max_odometer_delta_allowed: '0',
                Nr_odometer_retries: '0',
                Engine_hours: '0',
                Original_engine_hours: '0',
                Target_engine_hours: '0',
                'Two-stage_list': '',
                OrPT_prompt_for_engine_hours: '1',
                Address2: '',
                City: '',
                State: '',
                Zip: '',
                Phone: '',
                UserData1: '',
                UserData2: '',
                UserData3: '',
                UserData4: '',
                UserData5: '',
                Start_odometer: '0',
                EH_consumption: '0.75',
                Allow_ID_replacement: '1',
                Number_of_strings: '2',
                String2: '',
                String3: '',
                String4: '',
                String5: '',
                Plate_check_type: '1',
                Nr_plate_retries: '0',
                Block_if_plate_retries_fail: '0'
              }
              if (req.body.data.selectedOpCoNumber === '049') temp.Department_name = req.body.data.opcoData.stationCode + " Trailers_Off-Road"
              excelData.push(temp);
            }
            else if (item.EquipmentIdentifier.substring(0, 1) === '3') {
              var reeferObj = {
                '// Action': 'R',
                'Record_type-Mean': 'Mean',
                Name: (item.EquipmentIdentifier + " " + item.Description).substring(0, 31),
                Status: '2',
                Type: '3',
                Hardware_type: '6',
                'Auth-type': '1',
                Employee_type: '1',
                Vehicle_no: item.EquipmentIdentifier,
                String: req.body.data.opcoData.stationCode + item.EquipmentIdentifier,
                Fleet_name: req.body.data.opcoData.fleetName,
                Department_name: req.body.data.opcoData.stationCode + " Others",
                Rule_name: 'Diesel',
                Driver_id_type: '0',
                Price_list_name: '',
                Model_name: item.ModelNumber,
                Pump_name: '',
                Year: item.ConstructionYear,
                Capacity: '150',
                Consumption: '11',
                Odometer: '0',
                Cust_id: item.SerialNumber,
                Address: '',
                'Account-type': '0',
                Available_amount: '0',
                Use_pin_code: '0',
                Pin_code: '0',
                Auth_pin_from: '2',
                Nr_pin_retries: '0',
                Block_if_pin_retries_fail: '0',
                OrPT_prompt_for_plate: '0',
                OrPT_prompt_for_odometer: '1',
                Do_odometer_reasonability_check: '0',
                Max_odometer_delta_allowed: '0',
                Nr_odometer_retries: '0',
                Engine_hours: '0',
                Original_engine_hours: '0',
                Target_engine_hours: '0',
                'Two-stage_list': '',
                OrPT_prompt_for_engine_hours: '0',
                Address2: '',
                City: '',
                State: '',
                Zip: '',
                Phone: '',
                UserData1: '',
                UserData2: '',
                UserData3: '',
                UserData4: '',
                UserData5: '',
                Start_odometer: '0',
                EH_consumption: '0.75',
                Allow_ID_replacement: '1',
                Number_of_strings: '2',
                String2: '',
                String3: '',
                String4: '',
                String5: '',
                Plate_check_type: '1',
                Nr_plate_retries: '0',
                Block_if_plate_retries_fail: '0'
              }
              excelData.push(reeferObj);
            }
          })
          res.send(excelData);
        })
        .catch((error) => {
          gbsql.close().then(() => console.log('GB Connection closed'))
          console.log(`GB Query Error::: ${error.code}`);
          res.send(excelData);
        })
    })
    .catch((err) => {
      console.log('/////////////////////////');
      console.log('GB Connection Error:::', err.code);
      res.send(excelData);
    })
})
//=============================================================
app.post('/gasboyUser', (req, res) => {
  res.send(
    req.body.data.queue.map((item) => {
      return {
        '// Action': 'R',
        'Record_type-Mean': 'Mean',
        Name: `${item.split(',')[0]} ${req.body.data.opcoData.stationCode}`,
        Status: '2',
        Type: '2',
        Hardware_type: '1',
        'Auth-type': '21',
        Employee_type: '1',
        Vehicle_no: item.split(',')[1],
        String: item.split(',')[1],
        Fleet_name: req.body.data.opcoData.fleetName,
        Department_name: `${req.body.data.opcoData.stationCode} Proxy`,
        Rule_name: 'No Restriction',
        Driver_id_type: '0',
        Price_list_name: '',
        Model_name: '98-PROXYID',
        Pump_name: '',
        Year: '0',
        Capacity: '0',
        Consumption: '0',
        Odometer: '0',
        Cust_id: '',
        Address: '',
        'Account-type': '0',
        Available_amount: '0',
        Use_pin_code: '0',
        Pin_code: '0',
        Auth_pin_from: '2',
        Nr_pin_retries: '0',
        Block_if_pin_retries_fail: '0',
        OrPT_prompt_for_plate: '1',
        OrPT_prompt_for_odometer: '0',
        Do_odometer_reasonability_check: '0',
        Max_odometer_delta_allowed: '0',
        Nr_odometer_retries: '0',
        Engine_hours: '0',
        Original_engine_hours: '0',
        Target_engine_hours: '0',
        'Two-stage_list': '',
        OrPT_prompt_for_engine_hours: '0',
        Address2: '',
        City: '',
        State: '',
        Zip: '',
        Phone: '',
        UserData1: '',
        UserData2: '',
        UserData3: '',
        UserData4: '',
        UserData5: '',
        Start_odometer: '0',
        EH_consumption: '0',
        Allow_ID_replacement: '0',
        Number_of_strings: '1',
        String2: '',
        String3: '',
        String4: '',
        String5: '',
        Plate_check_type: '1',
        Nr_plate_retries: '0',
        Block_if_plate_retries_fail: '0'
      }
    })
  )
})
//=============================================================
app.post('/routesToTelogis', (req, res) => {
  let path = `//isibld/RD_Transfer/OBC/Routes/Archive`;
  fs.readdir(path, (err, files) => {
    if (err) console.log(err);
    if (files) {
      res.send(files.filter((item) => {
        return item.substring(0, 8) === req.body.data
      })
      )
    }
  })
})
//=============================================================
function gs1Process(req, res) {
  let gs1Query =
    "select " +
    "driverpro.DeliveredGS1Barcode.GS1Barcode, " +
    "driverpro.DeliveredGS1Barcode.DCID, " +
    "driverpro.DeliveredGS1Barcode.ScheduledDate as 'Shipped Date', " +
    "driverpro.DeliveryItem.ItemID as 'Product Serial Number', " +
    "driverpro.DeliveryItem.ItemUOM as 'Product Quantity Units', " +
    "driverpro.DeliveryItem.DeliveredQuantity as 'Product Quantity Amount', " +
    "driverpro.Invoice.InvoiceNumber as 'PO Number' " +
    "from driverpro.DeliveredGS1Barcode " +
    "inner join driverpro.Invoice " +
    "on (driverpro.DeliveredGS1Barcode.DCID = driverpro.Invoice.DCID " +
    "and driverpro.DeliveredGS1Barcode.RouteID = driverpro.Invoice.RouteID ) " +
    "inner join driverpro.DeliveryItem " +
    "on (driverpro.DeliveredGS1Barcode.DCID = driverpro.DeliveryItem.DCID " +
    "and driverpro.DeliveredGS1Barcode.RouteID = driverpro.DeliveryItem.RouteID " +
    "and driverpro.DeliveredGS1Barcode.StopSequenceNumber = driverpro.DeliveryItem.StopSequenceNumber " +
    "and driverpro.DeliveredGS1Barcode.ItemID = driverpro.DeliveryItem.ItemID) " +
    "where driverpro.DeliveredGS1Barcode.GS1Barcode is not null"

  let fromGLN = {
    '331': '0074865xxxxxx',
    '838': '0074865xxxxxx',
    '1050': '0074865xxxxxx',
    '1055': '0074865000024',
    '1060': '0074865xxxxxx',
    '1065': '0074865xxxxxx',
    '1075': '0074865xxxxxx',
    '1080': '0074865xxxxxx',
    '1085': '0074865000567',
    '1090': '0074865xxxxxx',
    '1095': '0074865xxxxxx',
    '1100': '0074865xxxxxx',
    '1105': '0074865xxxxxx',
    '1115': '0074865xxxxxx',
    '1120': '0074865xxxxxx',
    '1125': '0074865xxxxxx',
    '1130': '0074865xxxxxx',
    '1135': '0074865xxxxxx',
    '1140': '0074865xxxxxx',
    '1145': '0074865000222',
    '1150': '0074865xxxxxx',
    '1155': '0074865xxxxxx',
    '1160': '0074865xxxxxx',
    '1165': '0074865xxxxxx',
    '1170': '0074865xxxxxx',
    '1175': '0074865xxxxxx',
    '1180': '0074865xxxxxx',
    '1185': '0074865xxxxxx',
    '1190': '0074865xxxxxx',
    '1195': '0074865xxxxxx',
    '1200': '0074865000673',
    '1205': '0074865xxxxxx',
    '1210': '0074865xxxxxx',
    '1215': '0074865000376',
    '1220': '0074865000383',
    '1225': '0074865xxxxxx',
    '1230': '0074865xxxxxx',
    '1235': '0074865xxxxxx',
    '1240': '0074865xxxxxx',
    '1245': '0074865000147',
    '1250': '0074865xxxxxx',
    '1255': '0074865xxxxxx',
    '1260': '0074865xxxxxx',
    '1265': '0074865xxxxxx',
    '1270': '0074865xxxxxx',
    '1275': '0074865000499',
    '1280': '0074865xxxxxx',
    '1285': '0074865000512',
    '1290': '0074865xxxxxx',
    '1295': '0074865xxxxxx',
    '1300': '0074865000543',
    '1305': '0074865000550',
    '1310': '0074865xxxxxx',
    '1315': '0074865xxxxxx',
    '1320': '0074865xxxxxx',
    '1325': '0074865xxxxxx',
    '1330': '0074865xxxxxx',
    '1335': '0074865xxxxxx',
    '1340': '0074865xxxxxx',
    '1345': '0074865xxxxxx',
    '1350': '0074865xxxxxx',
    '1355': '0074865xxxxxx',
    '1360': '0074865xxxxxx',
    '1365': '0074865xxxxxx',
    '1370': '0074865xxxxxx',
    '1375': '0074865000697',
    '1380': '0074865xxxxxx',
    '1385': '0074865xxxxxx',
    '1390': '0074865xxxxxx',
    '1395': '0074865xxxxxx',
    '1415': '0074865003063',
    '1425': '0074865xxxxxx',
    '1430': '0074865xxxxxx',
    '1435': '0074865xxxxxx',
    '1700': '0074865xxxxxx',
    '1705': '0074865xxxxxx',
    '1720': '0074865001113',
    '3005': '0074865xxxxxx',
    '3010': '0074865xxxxxx',
    '3015': '0074865xxxxxx',
    '3020': '0074865xxxxxx',
    '3025': '0074865xxxxxx',
    '3065': '0074865xxxxxx',
    '3070': '0074865xxxxxx',
    '3075': '0074865xxxxxx',
    '3080': '0074865xxxxxx',
    '3085': '0074865xxxxxx',
    '3090': '0074865xxxxxx',
    '3100': '0074865xxxxxx',
    '3105': '0074865xxxxxx',
    '3110': '0074865xxxxxx',
    '3115': '0074865xxxxxx',
    '3125': '0074865xxxxxx',
    '3130': '0074865xxxxxx',
    '3030': '0074865xxxxxx',
    '5450': '0074865xxxxxx',
    '9995': '0074865xxxxxx',
  }
  let CSVstring = 'Date,SSCC,GLN (ship from),GLN Extension (ship from),Destination GLN,Destination GLN Extension,GTIN,Product Lot,Product Serial Number,Product Quantity Units,Product Quantity Amount,poNumber,packDate,useThruDate,productionDate,expirationDate,bestBeforeDate,poNumber2,\r\n'

  gs1sql.connect()
    .then((pool) => {
      console.log('/////////////////////////');
      console.log('Connected to GS1 DB');
      console.log('Fetching Data from GS1 DB');
      pool.query(gs1Query)
        .then((result) => {
          gs1sql.close().then(() => console.log('GS1 Connection closed'));
          result.recordset.forEach((item) => {
            if (item['GS1Barcode'].substring(16, 18) === '11' || item['GS1Barcode'].substring(16, 18) === '13' || item['GS1Barcode'].substring(16, 18) === '15' || item['GS1Barcode'].substring(16, 18) === '17') {
              let date = new Date(item['Shipped Date'])
              CSVstring = CSVstring
                .concat(`${date.getMonth()}/${date.getDate()}/${date.getFullYear()},`)  //Required - Date
                .concat(`${item['GS1Barcode'].substring(0, 2)},`)                       //Required - SSCC
                .concat(`${fromGLN[item['DCID']]},`)                                                            //Required - GLN (from)
                .concat(`,`)                                                            //Optional - GLN Extension (from)
                .concat(`,`)                                                            //Required - GLN (to)
                .concat(`,`)                                                            //Optional - GLN Extension (to)
                .concat(`${item['GS1Barcode'].substring(2, 16)},`)                      //Required - GTIN
                .concat(`${item['GS1Barcode'].substring(26, 36) || ''},`)               //Required - Product Lot
                .concat(`${item['Product Serial Number']},`)                            //If Applicable - Product Serial Number
                .concat(`${item['Product Quantity Units']},`)                           //Required - Product Quantity Units
                .concat(`${item['Product Quantity Amount']},`)                          //Required - Product Quantity Amount
                .concat(`${item['PO Number']},`)                                        //Required - PO Number
                .concat(item['GS1Barcode'].substring(16, 18) === '13' ? `${item['GS1Barcode'].substring(20, 22)}/${item['GS1Barcode'].substring(22, 24)}/20${item['GS1Barcode'].substring(18, 20)},` : ',') //packDate
                .concat(item['GS1Barcode'].substring(16, 18) === '17' ? `${item['GS1Barcode'].substring(20, 22)}/${item['GS1Barcode'].substring(22, 24)}/20${item['GS1Barcode'].substring(18, 20)},` : ',') //useThruDate
                .concat(`,`)                                                                                                                                                                                //expirationDate
                .concat(item['GS1Barcode'].substring(16, 18) === '11' ? `${item['GS1Barcode'].substring(20, 22)}/${item['GS1Barcode'].substring(22, 24)}/20${item['GS1Barcode'].substring(18, 20)},` : ',') //productionDate
                .concat(item['GS1Barcode'].substring(16, 18) === '15' ? `${item['GS1Barcode'].substring(20, 22)}/${item['GS1Barcode'].substring(22, 24)}/20${item['GS1Barcode'].substring(18, 20)},` : ',') //bestBeforeDate
                .concat(`,`)                                                            //If Applicable - poNumber2
                .concat(`\r\n`)
            }
          })
          if (res) res.send({ CSVstring: CSVstring })
          /// modify this based on export
          else {
            let today = new Date();
            let date = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
            fs.writeFile(`//ms212rdfsc/ern-support/GS1/${date}-GS1Export.csv`, CSVstring, (err, result) => {
              if (err) console.log(err);
            })
          }
          /// ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        })
        .catch((err) => {
          gs1sql.close().then(() => console.log('GS1 Connection Closed'))
          console.log('GS1 Query Error::', err.code)
          if (res) res.send({ CSVstring: CSVstring })
        })
    })
    .catch((err => {
      console.log('/////////////////////////');
      console.log('GS1 Connection Error::', err.code);
    }))
}
//=============================================================
app.get('/processGS1', (req, res) => {
  gs1Process(req, res)
})

let rule = new schedule.RecurrenceRule();
rule.hour = 12;
rule.minute = 0;
rule.second = 0;

let gs1job = schedule.scheduleJob(rule, () => {
  console.log('Running scheduled GS1 Job');
  gs1Process();
})
//=============================================================
