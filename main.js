const csv = require('csv-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/challenge";

var csvResults = [];
var emailsToLoad = [];

fs.createReadStream('data.csv')
    .pipe(csv({ separator: '|' }))
    .on('data', (data) => csvResults.push(data))
    .on('end', () => {

        for (let index = 0; index < csvResults.length; index++) {
            const patient = csvResults[index];
            if (patient['CONSENT'] === 'Y') {
                let currentDate = new Date();
                let emails = [
                    {
                        'Name': "Day 1",
                        'scheduled_date': currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + (currentDate.getDate() + 1),
                        'email': patient['Email Address']
                    },
                    {
                        'Name': "Day 2",
                        'scheduled_date': currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + (currentDate.getDate() + 2),
                        'email': patient['Email Address']
                    },
                    {
                        'Name': "Day 3",
                        'scheduled_date': currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + (currentDate.getDate() + 3),
                        'email': patient['Email Address']
                    },
                    {
                        'Name': "Day 4",
                        'scheduled_date': currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + (currentDate.getDate() + 4),
                        'email': patient['Email Address']
                    },
                ];
                emails.forEach(emailObject => {
                    emailsToLoad.push(emailObject);
                });
            }
        }


        // Load CSV data into DB.
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("challenge");
            dbo.collection("Patients").insertMany(csvResults, function(err, res) {
              if (err) throw err;
              console.log("Patients inserted! Nº inserted: ", res.insertedCount);
              db.close();
            });
        });
        
        
        // Load into Emails db collection.
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("challenge");
            dbo.collection("Emails").insertMany(emailsToLoad, function(err, res) {
              if (err) throw err;
              console.log("Emails inserted! Nº inserted: ", res.insertedCount);
              db.close();
            });
        });
});

