const csv = require('csv-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/challenge";

var csvResults = [];

describe('Main Test Suite', () => {

    test('Test #1: Data integrity.', () => {
      fs.createReadStream('data.csv')
        .pipe(csv({ separator: '|' }))
        .on('data', (data) => csvResults.push(data))
        .on('end', () => {
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("challenge");
            dbo.collection("Patients").find({}, { projection: { _id: 0 } }).toArray(function(err, retrievedPatients) {
              if (err) throw err;
              expect(retrievedPatients).toEqual(csvResults);
              db.close();
            });
          });
        });
      });
      

    test('Test #2: Patient IDs where first name is missing.', () => {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("challenge");
        dbo.collection("Patients").find({ 'First Name': {$eq: ''} }, { projection: { _id: 0, 'Program Identifier': 1 } }).toArray(function(err, retrievedPatients) {
          if (err) throw err;
          db.close();
          expect(retrievedPatients.length).toEqual(2);
        });
      });
    });


    test('Test #3: Patient IDs where the email address is missing, but consent is Y.', () => {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("challenge");
        dbo.collection("Patients").find({ $and: [ { 'First Name': {$eq: ''} }, { 'CONSENT': {$eq: 'Y'} } ] }, { projection: { _id: 0, 'Program Identifier': 1 } }).toArray(function(err, retrievedPatients) {
          if (err) throw err;
          db.close();
          expect(retrievedPatients.length).toEqual(1);
        });
      });
    });


    test('Test #4: Verify Emails were created in Emails Collection for patients who have CONSENT as Y.', () => {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("challenge");
        dbo.collection("Emails").find({}, { projection: { _id: 0 } }).toArray(function(err, retrievedEmails) {
          if (err) throw err;
          db.close();
          expect(retrievedEmails).toBeDefined();
        });
      });
    });


    test('Test #5: Verify emails for each patient are scheduled correctly.', () => {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("challenge");
        dbo.collection("Emails").find({}, { projection: { _id: 0, 'scheduled_date': 1 } }).toArray(function(err, retrievedDates) {
          if (err) throw err;
          db.close();

          let processedDates = [];
          retrievedDates.forEach(date => {
            splittedDate = date['scheduled_date'].split('-');
            processedDates.push(splittedDate[2]);
          });
          
          let currentDate = new Date();
          let expectedDates = [
            (currentDate.getDate() + 1).toString(),
            (currentDate.getDate() + 2).toString(),
            (currentDate.getDate() + 3).toString(),
            (currentDate.getDate() + 4).toString(),
          ];

          expect(processedDates).toEqual(
            expect.arrayContaining(expectedDates),
          );
        });
      });
    });
    

});


