const express = require('express');
const bodyParser = require('body-parser');
const config = require('./Config/config.js');
const mysql = require('mysql');
const fs = require('fs');
const csv = require('csv-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

dbConn.connect((err) =>{
    if(err)
        console.log(err);
    else
        console.log("Connected to database test");
});

app.get('/import', (req, res) => {
    let counter = 0;
    const tab = [];
    let csvStream = fs.createReadStream(".\\public\\user.csv")
        .pipe(csv())
        .on("data", (record) => {
            tab.push(record);
            csvStream.pause();
            if (counter < 10){
                let userID = record.userID;
                let nom = record.nom;
                let prenom = record.prenom;
                let pays = record.pays;
                let ville = record.ville;

                dbConn.query("INSERT INTO user VALUES (?,?,?,?,?)", [userID,nom,prenom,pays,ville], (err) => {
                    if (err){
                        console.log(err);
                    }
                });
                counter++;
            }
            csvStream.resume();
        }).on("end", () => {
            res.status(200).json({
                error: false,
                message: 'job done'
            });
            console.log(tab);
        }).on("error", (error) => {
            res.status(200).json({
                error: true,
                message: error.stack
            })
        });
});

app.listen(config.PORT, function () {
    console.log('Server started at ' + config.getHTTPUrl() + ' Version : '+ config.VERSION);
});