const mysql = require('mysql2/promise');

//@desc home page for movies
//route GET /eestifilm
//@access public

//app.get('/eestifilm', (req, res)=>{
const eestifilm = (req, res) => {
	res.render('eestifilm');
};	

//@desc home page for people involved into the movie industry
//route GET /eestifilm
//@access publi

//app.get('/eestifilm/inimesed', async (req,res)=>{
const inimesed = async (req, res) => {
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
};

// app.post('/eestifilm/inimesed_add', async (req, res)=>{
const inimesedAddPost = async (req, res) => {
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
};

const inimesedAdd = (req, res) => {
	res.render('eestifilmiinimesed_add', {notice: 'Ootan sisestus'});

}


module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost
}