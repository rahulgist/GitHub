/** IMPORT NODE MODULES**/

var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

/*
    Parse all from data
*/

app.use(bodyParser.urlencoded({extended:true}));

/* @Used for formatting dates */

var dateFormat = require('dateformat');
const { expr } = require('jquery');
var now = new Date();

app.set('view engine','ejs');


app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"employeedb"
});


/* Global site title and base url */

const siteTitle = "Simple App";
const baseUrl = "http://localhost:4000/";

app.get('/',function (req,res){

    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function(err,result){
       // console.log(result);
        res.render('pages/index',{
           siteTitle : siteTitle,
           pageTitle : 'Event List' ,
           items : result
        });

    });

});
// add new events form
app.get('/event/add',function (req,res){

    res.render('pages/add-event.ejs',{
        siteTitle : siteTitle,
        pageTitle : 'Add New Event' ,
        items : ''
     });

});

// add new events to mysql db

app.post('/event/add', function(req,res){
    var query =     "INSERT INTO `e_events` (`e_id`, `e_name`, `e_start_date`, `e_end_date`, `e_desc`, `e_location`) VALUES (NULL,";
        query +=    "'"+req.body.e_name+"',";
        query +=    "'"+dateFormat(req.body.e_start_date,"yyyy-mm-dd")+"',";
        query +=    "'"+dateFormat(req.body.e_end_date,"yyyy-mm-dd")+"',";
        query +=    "'"+req.body.e_desc+"',";
        query +=    "'"+req.body.e_location+"')";
        //console.log(query);
        con.query(query, function(err, result){
            res.redirect(baseUrl);
        });
})


// edit events

app.get('/event/edit/:event_id', function(req,res){

    con.query("SELECT * FROM e_events WHERE e_id='" + req.params.event_id + "'", function(err,result){

        result[0].e_start_date = dateFormat(result[0].e_start_date,"yyyy-mm-dd");
        result[0].e_end_date = dateFormat(result[0].e_end_date,"yyyy-mm-dd");

        res.render('pages/edit-event',{
            siteTitle: siteTitle,
            pageTitle: "Editing Event :" + result[0].e_name,
            item: result
        });

    });
});


// Update event

app.post('/event/edit/:event_id', function(req,res){
    var query =     "UPDATE e_events SET ";
        query +=    "e_name = '"+req.body.e_name+"',";
        query +=    "e_start_date = '"+req.body.e_start_date+"',";
        query +=    "e_end_date = '"+req.body.e_end_date+"',";
        query +=    "e_desc = '"+req.body.e_desc+"',";
        query +=    "e_location = '"+req.body.e_location+"' ";
        query +=    "WHERE e_events.e_id = "+req.body.e_id+"";
       // console.log(query);
        con.query(query, function(err, result){
            if(result.affectedRows){
                res.redirect(baseUrl);
            }
        });
});

app.get('/event/delete/:event_id',function(req,res){

    con.query("DELETE FROM e_events WHERE e_id = '"+req.params.event_id+"'",function(err,result){
        if(result.affectedRows){
            res.redirect(baseUrl);
        }
    });
});

/* Connect to server */

var server = app.listen(4000, function(){
    console.log('Server started on Port 4000....');
});