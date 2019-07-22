/* eslint-disable no-unused-vars */
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
let replace = require('replace-in-file');
//=============================================================
app.get('/getFiles', (req, res) => {
  // console.log('Getting OpCo Info');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) console.log(err)
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
let exconfig = {
  user: process.env.EX_USER,
  password: process.env.EX_PW,
  database: process.env.EX_NAME,
  server: process.env.EX_HOST
}
let gbsql = new sql.ConnectionPool(gbconfig);
let gs1sql = new sql.ConnectionPool(gs1config);
let exsql = new sql.ConnectionPool(exconfig);

let today;
let time;
let sessionDate;

function currentTime() {
  let date = new Date();
  today = `${(date.getFullYear())}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
  time = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
  sessionDate = `${(date.getFullYear())}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDate() + 1)).slice(-2)}`
  // console.log(`Today: ${today}`);
  // sessionDate = `2019-07-01`
  // console.log('test---', sessionDate);

  console.log(`///////////////////////// ${time}`);
}

//=============================================================
app.post('/updateUserConfigs', (req, res) => {
  // console.log('Updating User Configs');
  servers.forEach((item) => {
    // fs.writeFile(`//${item}/routing/UserConfigCalvinTest.txt`, req.body.data, (err, res) => {
    fs.writeFile(`//${item}/routing/UserConfig.txt`, req.body.data, (err, res) => {
      if (err) console.log(err)
    });
  })
  res.send(`User Configs updated!`);
})
app.post('/replaceRIConfig', (req, res) => {
  currentTime();
  console.log('Replacing RI Config Files');
  let filesReplaced = [];
  let files = ['CONFIG.TMP', 'LOCKOUT.TMP', 'OPTMENU.DTA', 'RTRSETUP.DTA'];
  servers.forEach((server) => {
    files.forEach((file) => {
      let source = `//ms212rdfsc/ERN-support/DOCs/SOTS stuff/RI CONFIG/master/${req.body.data.OpCo}/${file}`
      let target = `//${server}/routing/${req.body.data.OpCo}/${file}`
      fse.copy(source, target)
        .then(() => {
          if (file === 'RTRSETUP.DTA') {
            let options = {
              encoding: 'binary',
              files: `//${server}/routing/${req.body.data.OpCo}/RTRSETUP.DTA`,
              from: [/ms212rdctx03/g, /ms212rdctx04/g, /ms212rdctx05/g, /ms212rdctx06/g, /ms212rdctx07/g, /ms212rdctx08/g, /ms212rdctx11/g, /ms212rdctx12/g, /ms212rdctx13/g, /ms212rdctx14/g, /ms212rdctx15/g, /ms212rdctx16/g],
              to: `${server}`,
              disableGlobs: true,
            }
            replace(options)
              .then(() => { console.log(`Modified ${server} - ${file}`) })
              .catch((error) => { console.log(error); })
          }
          filesReplaced.push(`${server} - ${file}`);
        })
        .catch((error) => {
          console.log(error);
        })
    })
  })
  setTimeout(() => {
    res.send(filesReplaced)
  }, 15000)
  ////
  // let files = [
  //   // 'LOCKOUT.TMP',
  //   // 'CONFIG.TMP',
  //   // 'OPTMENU.DTA',
  //   'RTRSETUP.DTA'
  // ];
  // let master = 'newMaster'
  // let servers = [
  //   // 'ms212rdctx06', 
  //   // 'ms212rdctx07',
  //   // 'ms212rdctx08', 
  //   // 'ms212rdctx11',
  //   // 'ms212rdctx12', 
  //   // 'ms212rdctx14', 
  //   // 'ms212rdctx15', 
  //   // 'ms212rdctx16'
  // ];
  // let awsServers = [
  //   'ms238rdctxo1',
  //   'ms238rdctxo2',
  //   'ms238rdctxo3',
  //   'ms238rdctxo4',
  //   'ms238rdctxo5',
  //   'ms238rdctxo6'
  // ];
  // let OpCos = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "022", "023", "024", "025", "026", "027", "029", "031", "032", "035", "036", "037", "038", "039", "040", "043", "045", "046", "047", "048", "049", "050", "051", "052", "054", "055", "056", "057", "058", "059", "060", "061", "064", "066", "067", "068", "073", "075", "076", "078", "101", "102", "137", "163", "164", "194", "195", "288", "293", "306", "320", "332", "335", "429"]
  // let ignores = ['010-4', '010-5', '012-5', '015-5', '164-5', '306-5', '429-1', '429-2', '429-3', '429-4', '429-5']
  // let folders = ['CUSTDL', 'RTRDL', 'RTRUL']
  // let missingFiles = {}

  // // fs.mkdirSync(`//ms212rdfsc/ERN-support/AWSRI/${master}`)

  // awsServers.forEach((server) => {
  //   // servers.forEach((server) => {
  //   // fs.mkdirSync(`//ms212rdfsc/ERN-support/AWSRI/${master}/${server}`)
  //   // console.log(`Created ${server}`);
  //   OpCos.forEach((OpCo) => {
  //     for (let i = 1; i <= 5; i++) {
  //       // fs.mkdirSync(`//ms212rdfsc/ERN-support/AWSRI/${master}/${server}/${OpCo}-${i}`)
  //       // console.log(`Created ${server}/${OpCo}-${i}`);

  //       // folders.forEach((folder) => {
  //       //   fs.mkdir(`//ms212rdfsc/ERN-support/AWSRI/${master}/${server}/${OpCo}-${i}/${folder}`, (err) => {
  //       //     if (err) console.log(err);
  //       //   })
  //       //   console.log(`Created ${server}/${OpCo}-${i}/${folder}`);
  //       // })

  //       // files.forEach((file) => {
  //       //   let source = `//${server}/ROUTING/${OpCo}-${i}/${file}`
  //       //   let target = `//ms212rdfsc/ERN-support/DOCs/SOTS stuff/RI CONFIG/master/${OpCo}-${i}/${file}`
  //       //   fse.copy(source, target, (err) => {
  //       //     if (err) {
  //       //       console.log(`Could not find ${file} in ${OpCo}-${i} in ${server}`);
  //       //     }
  //       //     else {
  //       //       console.log(`Copied ${file} from ${OpCo}-${i} in ${server} to master`);
  //       //     }
  //       //   })

  //       files.forEach((file) => {
  //         // console.log(`${OpCo}-${i}/${file}`);
  //         let source = `//ms212rdfsc/ERN-support/DOCs/SOTS stuff/RI CONFIG/master/${OpCo}-${i}/${file}`
  //         let target = `//ms212rdfsc/ERN-support/AWSRI/${master}/${server}/${OpCo}-${i}/${file}`
  //         // fse.copy(source, target, (err) => {
  //         // if (err) {
  //         //   if (!ignores.includes(`${OpCo}-${i}`)) {
  //         //     if (!(`${OpCo}-${i}` in missingFiles)) {
  //         //       console.log(`Could not find ${file} in ${OpCo}-${i} in master`);
  //         //       missingFiles[`${OpCo}-${i}`] = `${file}`
  //         //       let jsonData = JSON.stringify(missingFiles)
  //         //       jsonData = jsonData.slice(1, jsonData.length - 1).split(',').join('\r\n')
  //         //       fs.writeFile('//ms212rdfsc/ERN-support/AWSRI/Missing Files.csv', jsonData, 'utf8', (err) => {
  //         //         if (err) console.log(err);
  //         //       })
  //         //     }
  //         //   }
  //         // }
  //         // else {
  //         if (file === 'RTRSETUP.DTA') {
  //           let options = {
  //             encoding: 'binary',
  //             files: `//ms212rdfsc/ERN-support/AWSRI/${master}/${server}/${OpCo}-${i}/RTRSETUP.DTA`,
  //             from: [/ms212rdctx03/g, /ms212rdctx04/g, /ms212rdctx05/g, /ms212rdctx06/g, /ms212rdctx07/g, /ms212rdctx08/g, /ms212rdctx11/g, /ms212rdctx12/g, /ms212rdctx13/g, /ms212rdctx14/g, /ms212rdctx15/g, /ms212rdctx16/g],
  //             to: `${server}`,
  //             disableGlobs: true,
  //           }
  //           replace(options)
  //             .then(() => { console.log(`Replaced server details ${server}/${OpCo}-${i}/${file}`); })
  //             .catch((error) => {
  //               // console.log(`Error replacing server details ${server}/${OpCo}-${i}/${file}`)
  //               console.log(error);
  //             })
  //         }
  //         console.log(`Copied ${file} into ${OpCo}-${i} in ${server} `);
  //         // }
  //         // })

  //       })
  //     }
  //   })
  // })
  ////
})
//=============================================================
app.post('/routesNotFlowing', (req, res) => {
  currentTime();
  let found = {
    sendable: true,
    result: 'Route Not Found',
    path: '',
    time: today,
  };
  console.log('TODAY IS:', today);

  function sendRoutes(path, file) {
    console.log('Sending...');
    res.json(found)
  }

  console.log(`Searching for route ${req.body.data.route} for ${req.body.data.userOpCo}`);

  servers.forEach((item) => {
    let path = `//${item}/routing/${req.body.data.userOpCo}/RTRDL`;
    fs.readdir(path, (err, res) => {
      if (err) console.log(err)
      res.forEach((item2) => {
        fs.readFile(`${path}/${item2}`, 'utf8', (err, data) => {
          if (err) console.log(err)
          let content = data.split('\n')
          content.forEach((item3) => {
            if (item3.slice(16, 20) === req.body.data.route && found.sendable === true) {
              console.log('Download found');
              fs.stat(`${path}/${item2}`, (err, stats) => {
                // console.log(stats)
                if (stats.mtime.toJSON().slice(0, 10) === today) {
                  found.date = stats.mtime;
                  found.sendable = false
                  found.result = 'Route Found'
                  found.path = `${path}/${item2}`
                }
              })
            };
          })
        })
      })
    })
  })
  servers.forEach((item) => {
    let path = `//${item}/routing/${req.body.data.userOpCo}/RTRUL`;
    fs.readdir(path, (err, res) => {
      if (err) console.log(err)
      res.forEach((item2) => {
        fs.readFile(`${path}/${item2}`, 'utf8', (err, data) => {
          if (err) console.log(err)
          let content = data.split('\n')
          content.forEach((item3) => {
            if (item3.slice(20, 24) === req.body.data.route && found.sendable === true) {
              console.log('Upload found');
              fs.stat(`${path}/${item2}`, (err, stats) => {
                // console.log( stats.mtime.toJSON().slice(0,10) + today );
                if (stats.mtime.toJSON().slice(0, 10) === today) {
                  console.log(stats.mtime);
                  found.date = stats.mtime
                  found.sendable = false
                  found.result = 'Route Found'
                  found.path = `${path}/${item2}`
                }
              })
            };
          })
        })
      })
    })
  })

  setTimeout(() => {
    // if (found.sendable === true) {
    sendRoutes();
    // }
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
    if (err) console.log(err)
    if (exists) {
      files.forEach((item) => {
        fse.pathExists(`${backupFolder}${req.body.data}/${item}`, (err, exists) => {
          if (err) console.log(err)
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
    if (err) console.log(err)
    if (exists) {
      files.forEach((item) => {
        fse.pathExists(`${backupFolder}${req.body.data.fromProfile}/${item}`, (err, exists) => {
          if (err) console.log(err)
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
  currentTime();

  console.log('Pinging Gasboy Database');
  gbsql.connect()
    .then(() => {
      console.log('Ping Successful');
      gbsql.close()
    })
    .catch((error) => {
      console.log(`Ping Unsuccessful: ${error}`);
      res.send(error.code);
    })
})
//=============================================================
app.post('/gasboyEquipment', (req, res) => {
  currentTime();
  let query = req.body.data.queue.reduce((result, item) => {
    if (item === req.body.data.queue[0]) return result
    else return result += ` OR EquipmentIdentifier = '${item}'`
  }, `'${req.body.data.queue[0]}'`)
  let excelData = [];
  gbsql.connect()
    .then((pool) => {
      console.log('Connected to Gasboy Database');
      req.body.data.queue.forEach((item) => {
        console.log(`Fetching Data for ${item} - OpCo ${req.body.data.selectedOpCoNumber}`);
      })
      pool.query(
        "select Equipment.EquipmentIdentifier, Equipment.Description, EquipmentExtended.ConstructionYear, Equipment.Manufacturer, Equipment.ModelNumber, Equipment.SerialNumber " +
        "from ((Equipment INNER JOIN EquipmentExtended on Equipment.EquipmentID = EquipmentExtended.EquipmentID) " +
        "INNER JOIN Company on Equipment.SiteCodeID = Company.SiteCodeID) where Company.Name = '" +
        req.body.data.selectedOpCoNumber + "' and (Equipment.EquipmentIdentifier = " +
        query + ")"
      )
        .then((result) => {
          gbsql.close().then(() => console.log('Gasboy Database Connection closed'))
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
          gbsql.close().then(() => console.log('Gasboy Database Connection closed'))
          console.log(`GB Query Error::: ${error.code}`);
          res.send(excelData);
        })
    })
    .catch((err) => {
      console.log('GB Connection Error:::', err);
      res.send(err.code);
    })
})
//=============================================================
app.post('/gasboyUser', (req, res) => {
  currentTime();
  console.log('Generating Gasboy User');

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
  currentTime();
  console.log('Pulling routes for Telogis');
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

  let queryDate = (req ? req.body.data.date : today);

  let gs1Query =
    "select " +
    "driverpro.DeliveredGS1Barcode.DCID, " +
    "driverpro.DeliveredGS1Barcode.GS1Barcode, " +
    "driverpro.DeliveredGS1Barcode.ScheduledDate as 'Shipped Date', " +
    "driverpro.DeliveryItem.ItemID as 'Product Serial Number', " +
    "driverpro.DeliveryItem.ItemUOM as 'Product Quantity Units', " +
    "driverpro.DeliveryItem.DeliveredQuantity as 'Product Quantity Amount', " +
    "driverpro.Invoice.InvoiceNumber as 'PO Number', " +
    "driverpro.Stop.Stopname " +

    "from driverpro.DeliveredGS1Barcode " +

    "inner join driverpro.Invoice " +
    "on (driverpro.DeliveredGS1Barcode.DCID = driverpro.Invoice.DCID " +
    "and driverpro.DeliveredGS1Barcode.RouteID = driverpro.Invoice.RouteID " +
    "and driverpro.DeliveredGS1Barcode.StopSequenceNumber = driverpro.Invoice.StopSequenceNumber " +
    "and driverpro.DeliveredGS1Barcode.ScheduledDate = driverpro.Invoice.ScheduledDate) " +

    "inner join driverpro.DeliveryItem " +
    "on (driverpro.DeliveredGS1Barcode.DCID = driverpro.DeliveryItem.DCID " +
    "and driverpro.DeliveredGS1Barcode.RouteID = driverpro.DeliveryItem.RouteID " +
    "and driverpro.DeliveredGS1Barcode.ScheduledDate = driverpro.DeliveryItem.ScheduledDate " +
    "and driverpro.DeliveredGS1Barcode.StopSequenceNumber = driverpro.DeliveryItem.StopSequenceNumber " +
    "and driverpro.DeliveredGS1Barcode.ItemID = driverpro.DeliveryItem.ItemID) " +

    "inner join driverpro.Stop " +
    "on (driverpro.DeliveredGS1Barcode.DCID = driverpro.Stop.DCID " +
    "and driverpro.DeliveredGS1Barcode.RouteID = driverpro.Stop.RouteID " +
    "and driverpro.DeliveredGS1Barcode.ScheduledDate = driverpro.Stop.ScheduledDate " +
    "and driverpro.DeliveredGS1Barcode.StopSequenceNumber = driverpro.Stop.StopSequenceNumber) " +

    `and driverpro.DeliveredGS1Barcode.ScheduledDate = {ts '${queryDate} 00:00:00'}` +
    "where driverpro.DeliveredGS1Barcode.GS1Barcode is not null"

  let CSVstring = 'Date,SSCC,GLN (ship from),GLN Extension (ship from),Destination GLN,Destination GLN Extension,GTIN,Product Lot,Product Serial Number,Product Quantity Units,Product Quantity Amount,poNumber,packDate,useThruDate,productionDate,expirationDate,bestBeforeDate,poNumber2\r\n'

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

  let destinationGLNs = {};
  let data = fs.readFileSync('//ms212rdfsc/ERN-support/GS1/Master/destinationGLN.csv', 'utf8')
  data.split('\r\n').forEach((item) => {
    destinationGLNs[`${item.split(':')[0]}`] = `${item.split(':')[1]}`
  })

  gs1sql.connect()
    .then((pool) => {
      console.log('Connected to GS1 Database');
      console.log('Fetching Data from GS1 Database');
      pool.query(gs1Query)
        .then((result) => {
          gs1sql.close().then(() => console.log('GS1 Database Connection closed'));
          result.recordset.forEach((item) => {
            let GS1Barcode = item['GS1Barcode'];
            console.log('/////////////////////////////////');
            console.log('Barcode:', GS1Barcode);
            let GTIN = GS1Barcode.match(/01(\d{14})/)
            if (GS1Barcode) GS1Barcode = GS1Barcode.replace(GTIN[0], "")

            let productLot = GS1Barcode.match(/^10([\x21-\x22\x25-\x2F\x30-\x39\x41-\x5A\x5F\x61-\x7A]{0,20})/)
            if (productLot) GS1Barcode = GS1Barcode.replace(productLot[0], "")
            let productSerialNumber = GS1Barcode.match(/^21([\x21-\x22\x25-\x2F\x30-\x39\x41-\x5A\x5F\x61-\x7A]{0,20})$/);
            if (productSerialNumber) GS1Barcode = GS1Barcode.replace(productSerialNumber[0], "")

            let packDate = GS1Barcode.match(/13(\d{6})/);
            if (packDate) GS1Barcode = GS1Barcode.replace(packDate[0], "");
            let useThruDate = GS1Barcode.match(/17(\d{6})/);
            if (useThruDate) GS1Barcode = GS1Barcode.replace(useThruDate[0], "");
            let productionDate = GS1Barcode.match(/11(\d{6})/);
            if (productionDate) GS1Barcode = GS1Barcode.replace(productionDate[0], "");
            let bestBeforeDate = GS1Barcode.match(/15(\d{6})/);
            if (bestBeforeDate) GS1Barcode = GS1Barcode.replace(bestBeforeDate[0], "");

            if (productLot) console.log(productLot);

            let date = new Date(item['Shipped Date'])
            if (item['Stopname'].includes("SUBWAY")) {
              let stopnameSplit = item['Stopname'].split(' ');
              let stopStoreNum = stopnameSplit[stopnameSplit.length - 1].replace(/\D/g, '');
              CSVstring = CSVstring
                .concat(`${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + (date.getDate() + 1)).slice(-2)}/${date.getFullYear()},`)  //Required - Date
                .concat(`,`)                                                                    //Required - SSCC
                .concat(`${fromGLN[item['DCID']]},`)                                            //Required - GLN (from)
                .concat(`,`)                                                                    //Optional - GLN Extension (from)
                .concat(`${destinationGLNs[stopStoreNum + '-0']},`)                             //Required - GLN (to)
                .concat(`,`)                                                                    //Optional - GLN Extension (to)
                .concat(`${GTIN[0].slice(2)},`)                                                 //Required - GTIN
                .concat(`${item['GS1Barcode'].substring(26, 36) || ''},`)                       //Required - Product Lot
                .concat(`${item['Product Serial Number']},`)                                    //If Applicable - Product Serial Number
                .concat(`${item['Product Quantity Units']},`)                                   //Required - Product Quantity Units
                .concat(`${item['Product Quantity Amount']},`)                                  //Required - Product Quantity Amount
                .concat(`${item['PO Number']},`)                                                //Required - PO Number
                .concat(packDate ? `${packDate[1].substring(2, 4)}/${packDate[1].substring(4, 6)}/20${packDate[1].substring(0, 2)},` : ',') //packDate
                .concat(useThruDate ? `${useThruDate[1].substring(2, 4)}/${useThruDate[1].substring(4, 6)}/20${useThruDate[1].substring(0, 2)},` : ',') //useThruDate
                .concat(productionDate ? `${productionDate[1].substring(2, 4)}/${productionDate[1].substring(4, 6)}/20${productionDate[1].substring(0, 2)},` : ',') //productionDate
                .concat(`,`)                                                                    //expirationDate
                .concat(bestBeforeDate ? `${bestBeforeDate[1].substring(2, 4)}/${bestBeforeDate[1].substring(4, 6)}/20${bestBeforeDate[1].substring(0, 2)},` : ',') //bestBeforeDate
                .concat(``)                                                                     //If Applicable - poNumber2
                .concat(`\r\n`)
              // .concat(`${item['GS1Barcode'].substring(0, 2)},`)                              //Required - SSCC
            }

          })
          if (res) res.send({ CSVstring: CSVstring })
          /// modify this based on export
          else {
            fs.writeFile(`//ms212rdfsc/ern-support/GS1/Exports/${today}-GS1Export.csv`, CSVstring, (err, result) => {
              if (err) console.log(err);
            })
          }
          /// ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        })
        .catch((err) => {
          gs1sql.close().then(() => console.log('GS1 Connection Closed'))
          console.log('GS1 Query Error::', err)
          if (res) res.send({ CSVstring: CSVstring })
        })
    })
    .catch((err => {
      console.log('/////////////////////////');
      console.log('GS1 Connection Error::', err);
    }))
}
//=============================================================
app.post('/processGS1', (req, res) => {
  currentTime();

  gs1Process(req, res)
})

let gs1Rule = new schedule.RecurrenceRule();
gs1Rule.hour = 17;
gs1Rule.minute = 0;
gs1Rule.second = 0;

let gs1job = schedule.scheduleJob(gs1Rule, () => {
  currentTime();
  console.log('Running scheduled GS1 Job');
  gs1Process();
})
//=============================================================
app.post('/updateMasterGLN', (req, res) => {
  // console.log('DATA:', req.body.data);
  fs.writeFile('//ms212rdfsc/ERN-support/GS1/Master/destinationGLN.csv', req.body.data, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    console.log('Destination GLNs updated');
    res.send('Destination GLNs updated');
  })
})
//=============================================================
function routingSolution(req, res) {
  currentTime();

  let exQuery =
    `SELECT "RS_SESSION"."REGION_ID", "RS_SESSION"."SESSION_DATE", "RS_SESSION"."DESCRIPTION", "RS_STOP"."LOCATION_ID",` +
    `"RS_STOP_SUMMARY_VIEW"."DELIVERY_SIZE1", "RS_ROUTE"."ROUTE_ID", "RS_ROUTE"."DESCRIPTION" AS 'ROUTE_DESCRIPTION', "RS_ROUTE"."LOCATION_ID_ORIGIN",` +
    `"RS_STOP_SUMMARY_VIEW"."DELIVERY_SIZE2", "RS_STOP_SUMMARY_VIEW"."DELIVERY_SIZE3", "RS_ROUTE_EQUIPMENT"."EQUIPMENT_TYPE_ID",` +
    `"RS_STOP"."SEQUENCE_NUMBER", "RS_STOP"."DISTANCE", "RS_ROUTE"."DISTANCE", "TS_LOCATION"."ADDR_LINE1", "TS_LOCATION"."ADDR_LINE2",` +
    `"TS_LOCATION"."XADDR_LINE1", "TS_LOCATION"."REGION1", "TS_LOCATION"."REGION2", "TS_LOCATION"."REGION3", "TS_LOCATION"."POSTAL_CODE",` +
    `"TS_LOCATION"."COUNTRY", "RS_ROUTE"."TRAVEL_TIME", "RS_ROUTE"."SERVICE_TIME", "RS_ORDER"."ORDER_NUMBER", "RS_ORDER"."SELECTOR",` +
    `"RS_ORDER"."ORDER_TYPE", "RS_ORDER"."SIZE1", "RS_ORDER"."SIZE2", "RS_ORDER"."SIZE3", "RS_ORDER"."SIZE1_CAT1", "RS_ORDER"."SIZE2_CAT1",` +
    `"RS_ORDER"."SIZE3_CAT1", "RS_ORDER"."SIZE1_CAT2", "RS_ORDER"."SIZE2_CAT2", "RS_ORDER"."SIZE3_CAT2", "RS_ORDER"."SIZE1_CAT3",` +
    `"RS_ORDER"."SIZE2_CAT3", "RS_ORDER"."SIZE3_CAT3", "RS_ROUTE"."START_TIME", "RS_ROUTE"."PREROUTE_TIME", "RS_ROUTE"."POSTROUTE_TIME", "RS_ROUTE"."START_TIME",` +
    `"RS_ROUTE"."DRIVER1_ID", "RS_ROUTE"."DRIVER2_ID", "RS_STOP"."LOCATION_TYPE", "RS_STOP"."STOP_TYPE", "RS_ROUTE"."LOCATION_ID_DESTINATION", "TS_LOCATION"."SERVICE_TIME_TYPE_ID", "TS_EQUIPMENT_TYPE"."SIZE1", "TS_EQUIPMENT_TYPE"."SIZE2", "TS_EQUIPMENT_TYPE"."SIZE3", "TS_LOCATION"."DESCRIPTION", "TS_LOCATION"."LONGITUDE", "TS_LOCATION"."LATITUDE", "TS_REGION"."USER_FIELD1", "RS_ROUTE_SUMMARY_VIEW"."STOP_SUM", "RS_STOP"."TRAVEL_TIME"` +
    `FROM   {oj (("UPSLT"."TSDBA"."TS_LOCATION" "TS_LOCATION"` +
    `INNER JOIN (((("UPSLT"."TSDBA"."TS_REGION" "TS_REGION"` +
    `INNER JOIN "UPSLT"."TSDBA"."RS_SESSION" "RS_SESSION" ON "TS_REGION"."REGION_ID"="RS_SESSION"."REGION_ID")` +
    `LEFT OUTER JOIN (("UPSLT"."TSDBA"."TS_EQUIPMENT_TYPE" "TS_EQUIPMENT_TYPE"` +
    `INNER JOIN "UPSLT"."TSDBA"."RS_ROUTE_EQUIPMENT" "RS_ROUTE_EQUIPMENT"` +
    `ON ("TS_EQUIPMENT_TYPE"."EQUIPMENT_TYPE_ID"="RS_ROUTE_EQUIPMENT"."EQUIPMENT_TYPE_ID")` +
    `AND ("TS_EQUIPMENT_TYPE"."REGION_ID"="RS_ROUTE_EQUIPMENT"."EQUIPMENT_OWNER_ID"))` +
    `INNER JOIN "UPSLT"."TSDBA"."RS_ROUTE" "RS_ROUTE" ON ("RS_ROUTE_EQUIPMENT"."ROUTE_PKEY"="RS_ROUTE"."PKEY")` +
    `AND ("RS_ROUTE_EQUIPMENT"."RN_SESSION_PKEY"="RS_ROUTE"."RN_SESSION_PKEY")) ON "RS_SESSION"."PKEY"="RS_ROUTE"."RN_SESSION_PKEY")` +
    `LEFT OUTER JOIN "UPSLT"."TSDBA"."RS_STOP" "RS_STOP" ON ("RS_ROUTE"."RN_SESSION_PKEY"="RS_STOP"."RN_SESSION_PKEY")` +
    `AND ("RS_ROUTE"."PKEY"="RS_STOP"."ROUTE_PKEY")) LEFT OUTER JOIN "UPSLT"."TSDBA"."RS_ROUTE_SUMMARY_VIEW" "RS_ROUTE_SUMMARY_VIEW"` +
    `ON ("RS_ROUTE"."RN_SESSION_PKEY"="RS_ROUTE_SUMMARY_VIEW"."RN_SESSION_PKEY") AND ("RS_ROUTE"."PKEY"="RS_ROUTE_SUMMARY_VIEW"."PKEY"))` +
    `ON (("TS_LOCATION"."REGION_ID"="RS_STOP"."LOCATION_REGION_ID") AND ("TS_LOCATION"."TYPE"="RS_STOP"."LOCATION_TYPE")) AND ("TS_LOCATION"."ID"="RS_STOP"."LOCATION_ID")) LEFT OUTER JOIN "UPSLT"."TSDBA"."RS_STOP_SUMMARY_VIEW" "RS_STOP_SUMMARY_VIEW" ON (("RS_STOP"."PKEY"="RS_STOP_SUMMARY_VIEW"."PKEY") AND ("RS_STOP"."RN_SESSION_PKEY"="RS_STOP_SUMMARY_VIEW"."RN_SESSION_PKEY")) AND ("RS_STOP"."ROUTE_PKEY"="RS_STOP_SUMMARY_VIEW"."ROUTE_PKEY")) LEFT OUTER JOIN "UPSLT"."TSDBA"."RS_ORDER" "RS_ORDER" ON ("RS_STOP"."RN_SESSION_PKEY"="RS_ORDER"."RN_SESSION_PKEY") AND ("RS_STOP"."PKEY"="RS_ORDER"."STOP_PKEY")}` +
    `WHERE  ("RS_SESSION"."DESCRIPTION" LIKE 'Delivery' OR "RS_SESSION"."DESCRIPTION" LIKE 'DELIVERY'` +
    `OR "RS_SESSION"."DESCRIPTION" LIKE 'Integrator Imported' OR "RS_SESSION"."DESCRIPTION" LIKE 'INTEGRATOR IMPORTED')` +
    `AND "RS_STOP"."SEQUENCE_NUMBER"<>-1 AND ("RS_SESSION"."SESSION_DATE">={ts '${sessionDate} 00:00:00'}` +
    `AND "RS_SESSION"."SESSION_DATE"<{ts '${sessionDate} 00:00:01'}) AND "RS_SESSION"."REGION_ID"='078'` +
    `ORDER BY "RS_SESSION"."SESSION_DATE", "RS_ROUTE"."ROUTE_ID", "RS_STOP"."SEQUENCE_NUMBER"`
  let CSVstring = '';
  exsql.connect()
    .then((pool) => {
      console.log('Successfully Connected to RS DB');
      console.log('Fetching data for Routing Solution');
      pool.query(exQuery)
        .then((result) => {
          console.log('RS Database Connection closed');
          exsql.close();

          result.recordset.forEach((item) => {
            let timeObj = new Date(item['START_TIME'][0]);
            let startTime = `${('0' + timeObj.getHours()).slice(-2)}:${('0' + timeObj.getMinutes()).slice(-2)}`
            let startDate = `${(timeObj.getFullYear())}-${('0' + (timeObj.getMonth() + 1)).slice(-2)}-${('0' + timeObj.getDate()).slice(-2)}`

            CSVstring = CSVstring
              .concat(`${item['LOCATION_ID']}`.padEnd(10))                      //1
              .concat(`${item['ORDER_NUMBER']}`.padEnd(15))                     //2
              .concat(`${item['SIZE1'][0]}`.padEnd(10))                         //3
              .concat(`${item['SIZE1_CAT1']}`.padEnd(10))                       //4
              .concat(`${item['SIZE1_CAT2']}`.padEnd(10))                       //5
              .concat(`${item['SIZE1_CAT3']}`.padEnd(10))                       //6
              .concat(`${item['SIZE2'][0]}`.padEnd(10))                         //7
              .concat(`${item['SIZE2_CAT1']}`.padEnd(10))                       //8
              .concat(`${item['SIZE2_CAT2']}`.padEnd(10))                       //9
              .concat(`${item['SIZE2_CAT3']}`.padEnd(10))                       //10
              .concat(`${item['SIZE3'][0]}`.padEnd(10))                         //11
              .concat(`${item['SIZE3_CAT1']}`.padEnd(10))                       //12
              .concat(`${item['SIZE3_CAT2']}`.padEnd(10))                       //13
              .concat(`${item['SIZE3_CAT3']}`.padEnd(10))                       //14
              .concat(`${item['ROUTE_ID']}`.padEnd(15))                         //15
              .concat(`${item['DRIVER1_ID']}`.padEnd(15))                       //16
              .concat(`${item['DRIVER2_ID']}`.padEnd(15))                       //17
              .concat(`${item['EQUIPMENT_TYPE_ID']}`.padEnd(5))                 //18
              .concat(`${item['ROUTE_DESCRIPTION']}`.padEnd(30))                //19
              .concat(`${item['LOCATION_ID_ORIGIN']}`.padEnd(10))               //20
              .concat(`${item['LOCATION_ID_DESTINATION']}`.padEnd(10))          //21
              .concat(`${item['SEQUENCE_NUMBER']}`.padEnd(5))                   //22
              .concat(`${item['ORDER_TYPE']}`.padEnd(5))                        //23
              .concat(startDate.padEnd(15))                                     //24
              .concat(startTime.padEnd(15))                                     //25
              .concat(`\r\n`)

            // .concat(` ${item['PREROUTE_TIME']}`.padEnd(10))                   //22
            // .concat(` ${item['POSTROUTE_TIME']}`.padEnd(10))                  //23
          })
          if (res) {
            res.send({ CSVstring: CSVstring })
          }
          else {
            fs.writeFile(`//ms212rdfsc/ern-support/078RoutingSolution/${today} - 078RoutedSolution.csv`, CSVstring, (err, result) => {
              if (err) console.log(err);
            })
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
      exsql.close();
      console.log('RS Database Connection closed');
    })
}

app.get('/routingSolution', (req, res) => {
  routingSolution(req, res);
});

let rsRule = new schedule.RecurrenceRule();
rsRule.hour = 20;
rsRule.minute = 45;
rsRule.second = 0;

let rsjob = schedule.scheduleJob(rsRule, () => {
  console.log('Running scheduled RS Job');
  routingSolution();
})