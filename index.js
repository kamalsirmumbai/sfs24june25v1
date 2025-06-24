require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const con = mysql2.createConnection({
	host: process.env.HOST,
	user : process.env.USER,
	password : process.env.PASSWORD,
	database : process.env.DATABASE
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/ss", upload.single("file"), (req, res) => {
	let sql = "INSERT INTO student VALUES (?, ?, ?, ?, ?)";
	let data = [req.body.rno, req.body.name, req.body.marks, req.file.buffer, req.file.mimetype];

	con.query(sql, data, (error, result) => {
		if (error) 
			res.send(error);
		else 
			res.send(result);
  		});
	});


app.get("/gs", (req, res) => {
	let sql = "SELECT * FROM student";
	con.query(sql, (error, result) => {
    		if (error) 
		{
			res.send(error);
    		} 
		else 
		{
      			let alldata = result.map((row) => {
        		return {
          			rno: row.rno,
          			name: row.name,
          			marks: row.marks,
          			file: row.file.toString("base64"), 
          			mime: row.mime 
        			};
      			});
      			res.send(alldata);
    		}
		});
	});


app.delete("/ds", (req, res) => {
	let sql = "delete from student where rno = ?";
	let data = [req.body.rno];

	con.query(sql, data, (error, result) => {
		if (error) 
			res.send(error);
		else 
			res.send(result);
  		});
	});



app.listen(9000, () => { console.log("ready to serve @ 9000"); });









