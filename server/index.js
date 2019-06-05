const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const jsonexport = require('jsonexport');

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
let fs = require('fs');
//=============================================================
app.get('/getFiles', (req, res) => {
  console.log('Getting OpCo Info');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data))
  })
})
//=============================================================
app.post('/updateUserConfigs', (req, res) => {
  console.log('Updating User Configs');
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
    if (found.sendable === true) {
      sendRoutes();
    }
  }, 10000)

})
//=============================================================
app.post('/restoreColumns', (req, res) => {
  let fse = require('fs-extra');
  let files = ['rnedrte.cps', 'tsmaint.cps', 'rnedrte.wps', 'tsmaint.wps'];

  fse.pathExists(`//ms212rdfsc /${req.body.data}`, (err, exists) => {
    console.log(req.body.data);
    if (exists) {
      files.forEach((item) => {
        console.log(`From: //ms212rdfsc/ern-support/DOCs/SOTS stuff/rdclient-backup/${req.body.data}/${item}`)
        console.log(`To:   //ms212rdfsc/rdclient$/${req.body.data}/${item}`);
        // fs.copy(`//ms212rdfsc/RDsupport/ProfileAutomation/${req.body.data}/${item}`,`//ms212rdfsc/rdclient$/${req.body.data}/${item}`)
      })
    } else console.log("Can't find");
  })

})
//=============================================================
let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME
};

sql.connect(config, function (err) {
  if (err) throw err;
  console.log('Connected to Gasboy DB');
});

app.post('/gasboyEquipment', (req, res) => {
  let query = req.body.data.queue.reduce((result, item) => {
    if (item === req.body.data.queue[0]) return result
    else return result += ` OR EquipmentIdentifier = '${item}'`
  }, `'${req.body.data.queue[0]}'`)
  let db = new sql.Request();
  db.query(
    "select Equipment.EquipmentIdentifier, Equipment.Description, EquipmentExtended.ConstructionYear, Equipment.Manufacturer, Equipment.ModelNumber, Equipment.SerialNumber " +
    "from ((Equipment INNER JOIN EquipmentExtended on Equipment.EquipmentID = EquipmentExtended.EquipmentID) " +
    "INNER JOIN Company on Equipment.SiteCodeID = Company.SiteCodeID) where Company.Name = '" +
    req.body.data.selectedOpCoNumber + "' and (Equipment.EquipmentIdentifier = " +
    query + ")",
    (err, result) => {
      if (err) throw err
      if (result) {
        let excelData = [];
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
        res.send(excelData)
      }
    })
})

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
app.post('/createNewOpCo', (req, res) => {

  console.log('Num', req.body.data.OpCoNum);
  console.log('Name', req.body.data.OpCoName);;

  let item = 'ms212rdctx16'

  for (let i = 1; i <= 5; i++) {
    fs.mkdirSync(`//${item}/routing/${req.body.data.OpCoNum}-${i}`, (err, exist) => {
      if (err) throw err;
      if (exist) console.log(`${req.body.data.OpCoNum}-${i} created`);
    })
    let folders = ['CUSTDL', 'RTRDL', 'RTRUL'];
    folders.forEach((folder) => {
      fs.mkdirSync(`//${item}/routing/${req.body.data.OpCoNum}-${i}/${folder}`, (err, exist) => {
        if (err) throw err;
        if (exist) console.log(`${folder} created`);
      })
    })
    //=============================================================
    let config =
      'IW,"  ' +
      // '429DOERLE FOOD SERVICE, LLC      '
      req.body.data.OpCoName.padEnd(33, ' ')
      + `AS${req.body.data.OpCoNum}A    "\r\n` +
      'FV,"ROADNET        RDNY5 Y200010007"\r\n'

    fs.writeFile(`//${item}/routing/${req.body.data.OpCoNum}-${i}/CONFIG.tmp`, config, (err, res) => {
      if (err) throw err;
    })
  }






  // fs.writeFile(`//${item}/routing/UserConfig.txt`, req.body.data, (err, res) => {
  //     if (err) throw err;
  //   });

})