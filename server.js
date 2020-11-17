// 'use strict';
// const express = require('express');
// const pg = require('pg');
// const cors = require('cors');
// const superagent = require('superagent');
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// require('dotenv').config();
// app.set('view engine','ejs');
// app.use(cors());

// // rendering related
// const client=new pg.Client(process.env.DATABASE_URL);
// //render  endpoint 
// app.get('/home', handleHome);
// let methodOverride=require('method-override');
// app.use(methodOverride('_method'));
// // create cons and use it 
// function Fact(factObject) {
//     this.type = factObject.type;
//     this.text = factObject.text;
// }
// function handleHome(req, res) {
//     let url = 'https://cat-fact.herokuapp.com/facts';
//     superagent.get(url).then(data => {
//         // console.log(data.body);
//         let apiData=data.body.all;//. body inside api and all is a array
//         let arr=apiData.map(element=>{
//             return new Fact(element);
//         });
//         res.render('home-page',{array:arr});
//     }).catch(error => {
//         console.log(error);
//     });
// }
// app.post('/facts',addingFact); //to adding to db as a hidden input form

// function addingFact(req,res){
//     let sql='insert into fact (types,texts) values ($1,$2);';
//     let value=[req.body.type,req.body.text];
//     client.query(sql,value).then(()=>{
//         // res.send('adding ');
//         res.redirect('/facts');
//     }).catch(error => {
//         console.log(error);
//     });
// }
// app.get('/facts',readDB);
// function readDB(req,res){
//     let sql='select * from fact;';
//     client.query(sql).then((data)=>{
//         console.log(data.rows);
//        res.render('fan-fact',{result:data.rows})
//     }).catch(err=>{
//         console.log(err);
//     });
// }


// app.get('/facts/:id',detalis);
// function detalis(req,res){
//     let sql3='select * from fact where id=$1;';
//     let value3=[req.params.id];
//     client.query(sql3,value3).then(data=>{
//         res.render('fact-details',{res:data.rows[0]});
//     }).catch(err=>{
//         console.log(err);
//     });
// }

// app.put('/facts/:id',update);
// function update(req,res){
//     let sql4='update fact set types=$1,texts=$2 where id=$3;'
//     let value4=[req.body.type,req.body.text,req.body.id];
//     client.query(sql4,value4).then(data=>{
//         res.redirect('/facts');
//     }).catch(err=>{
//         console.log(err);
//     });
// }
// app.delete('/facts/:id',deleting);
// function deleting(req,res){
//     let sql5='delete from fact where id=$1;';
//     let value5=[req.params.id]
//     client.query(sql5,value5).then(()=>{
//         res.redirect('/facts');
//     }).catch(err=>{
//         console.log(err);
//     });
// }

// client.connect().then(()=>{
//     const port = process.env.PORT;
//     app.listen(port, () => {
//         console.log(`app it's listen to port ${port}`);
//     });
// }).catch(err=>{
//     console.log(err);
// });

const express = require('express');
const cors = require('cors');
// - APIs related
const superagent = require('superagent');
const methodOverride = require('method-override');


// - database related
const pg = require('pg');
require('dotenv').config();
const client = new pg.Client(process.env.DATABASE_URL);


const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(methodOverride('_method'));

function Fact(data){
  this.type = data.type;
  this.text = data.text;
}

// /home end point
app.get('/home', handleHome);
app.get('/facts', handleGettingFavFacts);
app.post('/facts', handleAddFact);
app.get('/facts/:id', handleFactDetails);
app.put('/facts/:id', handleUpdatingFact);
app.delete('/facts/:id', handleDeletingFact);
app.get('/test', handleGetTest);
app.post('/test', handlePostTest);

function handleGetTest(req,res){
  res.send(req.query);
}


function handlePostTest(req,res){
  res.send(req.body);
}




function handleHome(req,res){
  let dataArr = [];
  let url = 'https://cat-fact.herokuapp.com/facts';
  superagent.get(url).then(data =>{
    data.body.all.forEach(element => {
      dataArr.push(new Fact(element));
    });
    res.render('home-page',{result:dataArr});
  });
}

function handleAddFact(req,res){
  let query = 'INSERT INTO fact (types,texts) VALUES ($1,$2);';
  let values = [req.body.type,req.body.text];

  client.query(query,values).then(()=>{
    res.redirect('/facts');
  });

}

function handleGettingFavFacts(req,res){
  let query = 'SELECT * FROM fact;';
  client.query(query).then(data =>{
    console.log('inside then');
    console.log(data.rows);
    res.render('fan-fact',{result: data.rows});
  });
}

function handleFactDetails(req,res){
  let query = 'SELECT * FROM fact WHERE id = $1;';
  let values = [req.params.id];
  client.query(query,values).then(data=>{
    res.render('fact-details', {res: data.rows[0]});
  });
}

function handleUpdatingFact(req, res){
  let query = 'UPDATE fact SET types = $1, texts = $2 WHERE id = $3;';
  let values = [req.body.type, req.body.text, req.params.id];
  client.query(query,values).then(()=>{
    res.redirect('/facts');
  });
}

function handleDeletingFact(req,res){
  let query = 'DELETE FROM fact WHERE id = $1;';
  let values = [req.params.id];
  client.query(query,values).then(()=>{
    res.redirect('/facts');
  });
}


client.connect().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`app listening on port ${PORT}`);
  });
});