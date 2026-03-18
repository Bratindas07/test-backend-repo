const express = require("express");
const jwt = require("jsonwebtoken");
const z = require("zod");
const fs = require("fs");
const app = express();
const port = 3001;

app.use(express.json());

const jswPassword = "SECRET_AND_SECURITY";

const inputValidation = (name,password) => {
    const schema = z.object({
        name: z.string(),
        password: z.string().min(4)
    })
    const response = schema.safeParse(name)
    return response.success;
}

const authorization = (token) => {
    try{
        const decode = jwt.verify(token,jswPassword);
        const name = decode.name
        const data = readData();
        users = JSON.parse(data);
        const userFound = users.find(user => user.name === name)
        console.log(userFound.name)
        if(userFound==="" || userFound===undefined){
            return "";
        }
        return userFound.name;
    }catch(err){
       console.log("Error while finding user")
    }
}

const readData = () => {
    try {
    const data = fs.readFileSync("usersDataBase.txt", "utf-8");
    if (!data || data.trim() === "") {
      console.log("No data");
      return "";
    }
       return data;
  } catch (err) {
    console.log("An error occurred: " + err.message);
    return "";
  }  
}

const writeData = (data) => {
    const content = JSON.stringify(data)
    fs.writeFile("usersDataBase.txt",content,(err)=>{
        if(err){
            console.log("Error while writing to the database " + err);
        } else {
            console.log("Success in updating the database");
        }
    })
}
// let users = [
//   { 
//     name: "Brato",
//        password: "124",
//         todos: []
//     }
// ]
let users = [];

app.get("/",(req,res) => {
    res.send("Hello and welcome to the most faltu backend server made by me which has notepad as database and has no security layers")
})

app.post("/signin",(req,res) =>{
    const name = req.body.name;
    const password = req.body.password;
    if(!inputValidation(name,password)){
        res.status(411).json({
            msg: "Wrong inputs"
        })
        return;
    }
    const token = jwt.sign({name:name},jswPassword);
    const data = readData();
    if(data==="" || data===undefined){
        users.push({"name":name,"password":password, todos:[]})
    }else {
        users = JSON.parse(data);
        users.push({"name":name,"password":password, todos:[]})
    }
    writeData(users);
    res.status(200).json({
        token
    });
})

app.get("/users",(req,res) => {
    const data = readData();
    if(data==="" || data===undefined){
        res.json({
            msg: "Error while reading the database"
        });
        return;
    }
    users = JSON.parse(data);
    res.json({"users": users.map(user => user.name)})
})

app.post("/todo",(req,res) => {
    // {task: "Do this", done:true}
    const todo = req.body.todo;
    const token = req.headers.authorization;
    const name = authorization(token)
    if(name === ""){
        res.json({
            msg: "User does not exist"
        })
        return;
    }
    const data = readData();
    users = JSON.parse(data);
    users.forEach(user => {
        if(user.name === name){
            user.todos.push(todo);
        }
    })
    writeData(users);
    res.json({
        msg: "Todo updated"
    })
})

app.post("/login",(req,res) => {
    const name = req.body.name;
    const password = req.body.password;
    const data = readData();
    if(data==="" || data===undefined){
        res.json({
            msg: "Data does not exist in the database"
        });
        return;
    }
    users = JSON.parse(data);
    console.log(users)
    const result = users.find(user => user.name===name && user.password===password);
    if(!result){
        res.json({
            msg: "User not found in the database"
        });
        return;
    }
    const token = jwt.sign({name:name},jswPassword);
    res.json({
        token
    })
})

app.get("/todos",(req,res) => {
    const token = req.headers.authorization;
    const name = authorization(token)
    if(name === ""){
        res.json({
            msg: "User does not exist, cant show the todos"
        })
        return;
    }
    const data = readData();
    users = JSON.parse(data);
    res.json({
        todos: users.map(user => user.todos)
    })
})

app.get("/todos/:name",(req,res) => {
    const token = req.headers.authorization;
    const name = authorization(token)
    if(name === ""){
        res.json({
            msg: "User does not exist"
        })
        return;
    }
    const username = req.params.name;
    const data = readData();
    const users = JSON.parse(data);
    const user = users.find(user => user.name === username)
    const userTodos = user.todos;
    res.json({
         "User's todos" : userTodos
        })
    })

app.use((err,req,res,next) => {
    console.log(err)
    res.status(500).json({
        msg: "Internal Server Error"
    })
})

app.listen(port,()=>{
    console.log(`App is listening at http://localhost:${port}`);
})