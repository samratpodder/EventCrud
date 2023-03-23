const express = require('express')
const app = express()
const mysql = require('mysql')
const port = process.env.PORT  ||3000;
app.set('view engine','ejs');
app.use(express.static('public'));
// const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var connection = mysql.createConnection({
    host     : "paridhi2023mysqldb1.ckscrgb0xpar.ap-south-1.rds.amazonaws.com" /*process.env.RDS_HOSTNAME*/,
    user     : "admin" /*process.env.RDS_USERNAME*/,
    password : "Rabai123" /*process.env.RDS_PASSWORD*/,
    port     : 3306 /*process.env.RDS_PORT*/,
    database: "eventpage"
  });
  
  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');
  });


var getDataQuery = `select * from 
eventlist left join Domains on eventlist.DomainID = Domains.DomainID 
union
select * from
eventlist right join Domains on eventlist.DomainID = Domains.DomainID`;

app.get('/',(req,res)=>{
    res.render('home');
});
app.post('/update',(req,res)=>{
  console.log(req);
  const {domain, event, eventDescription, registrationCost, teamSize, pdfDownloadLink, imageLink } = req.body;
  // var updatequery = "UPDATE eventlist SET EventName = "+event+",  EventDesc="+eventDescription+", RegCost="+registrationCost+", TeamSize="+teamSize+", PDFLink="+pdfDownloadLink+",PosterLink="+imageLink+" WHERE EventName = "+event+";";
  var insertquery = `insert into eventlist(DomainID, EventName,EventDesc,RegCost,TeamSize,PDFLink,PosterLink) values (${domain},"${event}","${eventDescription}",${registrationCost},${teamSize},"${pdfDownloadLink}","${imageLink}")`;
  connection.query(insertquery,(error, results, fields)=>{
    if (error) throw error;
    res.redirect('/');
  });

});
app.get('/getData',(req,res)=>{
  connection.query(getDataQuery,(error, results, fields) =>{
    if (error) throw error;
    res.send(results);
  });
});
app.listen(port,()=>{
    console.log("http://localhost:"+port);
});