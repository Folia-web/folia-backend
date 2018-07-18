module.exports=function(app){
    const editJsonFile = require('edit-json-file')
    const fs=require('fs')
    const mongoose = require('mongoose')
    const pm2=require('pm2')
    const configPM2=require('../../ecosystem.config')

    //params: mongoURL, the mongodb connection string to be saved in config/config.js mongoURL value
    app.post('/setupMongo',function(req,res){
        let file = editJsonFile(__dirname+ "/../config/config.json",{
            autosave: true
        })
        let result=file.set('mongoURL',req.body.mongoURL)
        res.send(result.data)
    })

    // params: configFile a json configuration file to be saved at config/serviceAccountKey.json
    app.post('/setupFirebase',function(req,res){
        if(!req.files)
            return res.status(400).send('No files were uploaded.')
        let configFile = req.files.configFile        
        configFile.mv(__dirname+ "/../serviceAccountKey.json",function(err){
            if (err)
                return res.status(500).send(err)
                let file = editJsonFile(__dirname+ "/../config/config.json",{
                    autosave: true
                })
                let result=file.set('firebaseURL',req.body.firebaseURL)
                res.send(result.data)
        })

    })

    app.get('/testMongo',function(req,res){
        let dbConfig=require(__dirname+ "/../config/config.json")
        mongoose.connect(dbConfig.mongoURL,function(err){
            if(err)
                return res.status(500).send(err)
            res.send({mongodb:true})
            mongoose.disconnect()
        })

    })

    app.get('/testFirebase',function(req,res){
        try {
            let serviceAccount=require(__dirname+ "/../serviceAccountKey.json")
            let dbConfig=require(__dirname+ "/../config/config.json")
            firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount),
                databaseURL: dbConfig.firebaseURL
              },"testApp")
            var firedb=firebase.database()
            firedb.goOffline()
            res.send({firebase:true})    
        } catch (error) {
            res.status(500).send(error)
        }
    })

    app.get('/foliaServerInfo',function(req,res){
        pm2.describe('folia-server',function(err,processDescription){
            if(err){
                res.send(err)
                console.error(err)
                process.exit(2)
            }
            res.send(processDescription)
        })
    })

    app.get('/foliaServerInfo',function(req,res){
        pm2.describe('folia-server',function(err,processDescription){
            if(err){
                res.send(err)
                console.error(err)
                process.exit(2)
            }
            res.send(processDescription)
        })
    })


    app.get('/startFoliaService',function(req,res){
        pm2.connect(function(err) {
            if (err) {
              console.error(err);
              process.exit(2);
            }
            
            pm2.start(configPM2.apps[1], function(err, apps) {
            //  pm2.disconnect();   // Disconnects from PM2
            console.log(err)
              if (err){ 
                  res.send(err)
                  throw err
                  return
                }
               res.send(apps)
            
            });
          });
          
    })
}