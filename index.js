const express = require('express');
const fs = require('fs').promises;
//moodul URL-i lahtiharutamiseks, et saaks POSt osad ka katte
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks, promises osaga async programmerimise jaoks
const mysql = require('mysql2/promise');

//moodul .env faili lugemiseks, keskonnamuutujate parsimiseks
require('dotenv').config();

const dateET = require('./src/dateTimeET');
const app = express();

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visit.txt';

//määrame veebilehtedele mallide renderdamise motoori
app.set('view engine', 'ejs');
//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));

//loon andmebaasiuhensude
//marsruudid
app.get('/', (req, res)=>{
	//res.send('Express.js läks käaima ja serveerib meile veebi.');
	const dayNow = dateET.day();
	const dateNow = dateET.fullDate(0);
	const timeNow = dateET.fullTime();
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, "utf8");
		let folkWisdom = data.split(";");
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		console.log(err);
		res.render('vanasona', {wisdom: 'Ei leidnud أ¼htegi vanasأµna!'});
	}
});

app.get('/regvisit', async(req, res)=>{
	res.render('regvisit'); 
});

app.post('/regvisit', async (req, res)=>{
	try {
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ';');
		res.render('regvisit');
	}	
	catch (err){
		console.log(err);
		res.render('regvisit');
	};

});

//Eesti movie paths
const eestifilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestifilmRouter);

app.get('/eestifilm', (req, res)=>{
	console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	res.render('eestifilm');
});
	
/* app.get('/eestifilm/inimesed', async (req,res)=>{
	//console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: 'if26_ilja_artjomenko_ta'
		});
		const sqlReq = 'SELECT * FROM person ORDER by last_name';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilminimesed', {personList: sqlRes});
	}
	catch (err){
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmiinimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}); */


app.get('/eestifilm/inimesed', (req, res)=>{
	res.render('eestifilmiinimesed_add');

});

app.get('/eestifilm/inimesed_add', (req, res)=>{
	res.render('eestifilmiinimesed_add');
	
});

app.post('/eestifilm/inimesed_add', async (req, res)=>{
	res.render('eestifilmiinimesed_add');
	//kontrollime andmete olemasolu
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date ()){
		comsole.log('Andmed pole korrekset');
		return res.render('eestifilmiinimesed_add');
	}
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: 'if26_ilja_artjomenko_ta'
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceasedf0 VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			req.body.deceasedInput
		]);
		res.render('eestifilmiinimesed_add');
	}
	catch (err){
		console.log('Viga andmebaasiga suhtlemisel: ' +err);
		res.render('eestifilmiinimesed_add');
	}
});

	
app.listen(5102);