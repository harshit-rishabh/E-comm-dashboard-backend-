const express = require('express');
const cors = require('cors');
const app = express();
require('./database/config');
const signup = require('./database/signup');
const Product = require('./database/product')
app.use(express.json());
app.use(cors());
app.post('/signup', async(req, resp)=>{
    let usersignup = new signup(req.body);
    let result =await usersignup.save();
    result = result.toObject();
    delete result.pass;
    resp.send(result);
});
app.post('/login',async (req, resp)=>{
    if(req.body.email && req.body.pass){
        let user = await signup.findOne(req.body).select('-pass');
        if(user){
            resp.send(user);
        }else{
            resp.send({result:"Invalid User..."})
        }
    }else{
        resp.send("plz enter both fields...")
    }
    
})

app.post('/addproduct', async (req, resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})

app.get('/getlist', async (req, resp)=>{
    let result = await Product.find();
    resp.send(result);
})

app.delete('/deleteproduct/:id',async (req, resp)=>{
    let result = await Product.deleteOne({_id : req.params.id});
    resp.send(result)
})
app.listen(5000);
