const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const upload = require('./modules/upload-images.js')
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "screenshot",
})

//存圖片//

app.post('/upload', upload.none(), async (req, res) => {
  //接收base64
    // console.log(req.body.imgData)
    var imgData = req.body.imgData;
    const snapimgName = uuidv4()
  // //濾data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64');


  const screenShotImg = 'snap' + snapimgName + '.png';

  const sql = "INSERT INTO `picture`(`screenShotImg`) VALUES (?)";

  db.query(sql, [screenShotImg]);


  fs.writeFile(`./public/${screenShotImg}`, dataBuffer, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("saved");
    }
  });
});

//存//
app.get('/save', async (req, res) => {
  console.log(req.query);
})
// app.post("/save", upload.none(), async (req, res) => {

// console.log(req.body)
// const sql = "INSERT INTO `picture`(`screenShotImg`) VALUES (?)";

// const r = await db.query(sql, [req.query.screenShotImg]);

// res.send(req.query)

// });

//只撈一筆//
app.get("/view",(req, res) => {
  
  db.query("SELECT * FROM `picture` ORDER BY `picture`.`id` DESC",(err,result)=>{
    if(err){
      console.log(err);
    } else{
      res.send(result)
    }
  })
  
})

app.get("/see", upload.none(), async (req, res) => {


  const sql = "SELECT * FROM `picture`";
  const [r] = await db.query(sql);
  console.log(r)
  res.json(r)
});

app.listen(3001, () => {
  console.log("run 3001")
})