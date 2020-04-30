const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {db} = require('./db');
var authenticated = false;

const app = express();

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
const router = express.Router();

//function to authenticate

const authenticate = (email,password) => {

    for(let i=0;i<db.length;i++){

        if( email == db[i].email  && password == db[i].password ){
            authenticated = true;
            break;
        }else{
            authenticated = false;
        }
    }
}

//function to add new user

const addMe = (name,email,password)=>{
    db.push({
        name,
        email,
        password
    })    
}


//sends login page 

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})


//validate user and sends homepage

router.post('/',(req,res)=>{

    let {email,password} = req.body;
    authenticate(email,password);

    if(authenticated){
        res.sendFile(path.join(__dirname,"public","home.html"));
    }else{
        res.send("wrong credentials")
    }
    
})


router.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','register.html'));
})

router.post('/addUser',(req,res)=>{
    const {name,email,password} = req.body;

    addMe(name,email,password);
    res.redirect("/login");
})




app.use('/',router);

app.listen(3000);

