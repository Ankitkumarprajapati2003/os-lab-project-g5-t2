/**
Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and 
mobile applications.

This code sets up a server using the Express.js framework, connects to a MySQL database, and listens to POST requests at 
 the root route.
 It extracts the required data from the request body and inserts it into the database.
 It also creates a table if it doesn't exist in the database.

* CORS (Cross-Origin Resource Sharing) is a mechanism used by web browsers to allow web applications to make requests to servers that   are outside of their domain or origin.
 For example, if a client-side web application running on http://localhost:3000 wants to make a request to a server running on http://api.example.com, the server can specify that http://localhost:3000 is an allowed origin by including the following response header:

 */


// Importing necessary modules
const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');
app.use(cors());

app.use(express.static("../Project"))
// Adding middleware
app.use(express.json());



/* The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or
the qs library (when true). 
A querystring parsing and stringifying library with some added security. A querystring parser that supports nesting and 
arrays, with a depth limit.*/
app.use(express.urlencoded({ extended: true }));

// Create a connection object by providing the required parameters
const mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql@ankit',
  database: 'osproject'
});

// Connecting to the database
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database!");
});

// Starting the server
app.listen(5500, function () {
  console.log("Server Started!!");
});
app.get("/Project", (req, res) => {
  res.sendFile(path.resolve("index.html"))
})
// Handling POST request at root route
app.post("/fcfs", (req, res) => {

  // Extracting required data from the request body
  const queries = req.body.Queries;
  const Query = queries.join(',');

  // Creating the database table if not exists
  connection.query("CREATE TABLE if not exists FCFS_Disk_Scheduling(Request_ID int AUTO_INCREMENT primary key, Queries varchar(100) ,Head_Position int, Total_Seek_Time decimal(4,2), Avg_Seek_Time decimal(4,2))", function (err, result) {
    if (err) throw err;
  });

  // Preparing data to be inserted into the database
  var values = [[null, Query, req.body.Head_Position, req.body.Total_Seek_Time, req.body.Avg_Seek_Time]];
  console.log(values);

  // Inserting data into the database
  var sql = "INSERT INTO FCFS_Disk_Scheduling VALUES ?";
  connection.query(sql, [values], function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log("Data inserted successfully!");
    }
  });
});

app.post("/priority", (req, res) => {
  const processes = req.body.processes;
  // console.log(processes);
  var values = [];
  for (var j = 0; j < processes.length; j++) {
    // values[j] = Object.values(processes[j]);
    values[j] = [null,req.body.processes[j].processID, req.body.processes[j].arrivalTime, req.body.processes[j].cpuBurstTime, req.body.processes[j].priority, req.body.processes[j].startTime, req.body.processes[j].completionTime, req.body.processes[j].turnaroundTime, req.body.processes[j].waitingTime, req.body.processes[j].responseTime];
    // console.log(values[j]);
  }
  
  connection.query("CREATE TABLE if not exists Preemtive_Priority_Scheduling (SrNo int AUTO_INCREMENT primary key, Process_ID VARCHAR(5) , Arrival_Time int, Brust_Time int, Priority int, Start_Time int,Completion_Time int, Turnaround_Time int, Waiting_Time int, Response_Time int)", function (err, result) {
    if (err) throw err;
    var sql = "INSERT INTO Preemtive_Priority_Scheduling VALUES ?";
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      else {
        console.log("Data inserted Successfully");
      };
    });
  })
});

app.post("/opr", (req, res) => {
  connection.query("CREATE TABLE if not exists Optimal_Page_Replacement(Pages_ID int AUTO_INCREMENT primary key,Pages_Request varchar(1000),Number_of_Frames int,Page_Hits int,Page_Faults int,Total_Request int,Miss_Ratio varchar(10),Hit_Ratio varchar(10))",
    function (err, result) {
      if (err) throw err;
      
     var values=[[null, req.body.pages, req.body.numFrames, req.body.pageHits, req.body.pageFaults, req.body.totalRequests, req.body.missRatio, req.body.hitRatio]];
      
      var sql = "INSERT INTO Optimal_Page_Replacement VALUES ?";
      connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        else {
          console.log("Data inserted Successfully");
        };
      });
    });
});

