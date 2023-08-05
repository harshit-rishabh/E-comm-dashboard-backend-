const express = require('express');
const cors = require('cors');
const app = express();
require('./database/config');
const signup = require('./database/signup');
const Product = require('./database/product')
app.use(express.json());
app.use(cors());
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.REACT_APP_PORT || 4500;
const Jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT;

app.post('/signup', tokenverify, async (req, resp) => {
    let usersignup = new signup(req.body);
    let result = await usersignup.save();
    result = result.toObject();
    delete result.pass;
    Jwt.sign({result}, jwtkey, {expiresIn:'30min'}, (err, token)=>{
        if(err){
            resp.send({result: 'connextion is not valid...'})
        }
        resp.send({result, key: token});
    })
});
app.post('/login', tokenverify, async (req, resp) => {
    if (req.body.email && req.body.pass) {
        let user = await signup.findOne(req.body).select('-pass');
        if (user) {
            Jwt.sign({user}, jwtkey, {expiresIn:'30min'}, (err, token)=>{
                if(err){
                    resp.send({result: 'connextion is not valid...'})
                }
                resp.send({user, key: token});
            })
            
        } else {
            resp.send({ result: "Invalid User..." })
        }
    } else {
        resp.send("plz enter both fields...")
    }

})

app.post('/addproduct', tokenverify, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})

app.get('/getlist', tokenverify, async (req, resp) => {
    let result = await Product.find();
    resp.send(result);
})

app.delete('/deleteproduct/:id', tokenverify, async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
})

app.get('/getlist/:id', tokenverify, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result);
    } else {
        resp.send({ result: 'Invalid id...' });
    }
});

app.put('/getlist/:id', tokenverify, async (req, resp) => {
    let result = await Product.updateOne(
        {
            _id: req.params.id
        },
        {
            $set: req.body
        }

    )
    if (result) {
        resp.send(result);
    } else {
        resp.send({ result: 'Invalid id...' });
    }
})

app.get('/search/:key', tokenverify, async (req, resp)=>{
    let result  = await Product.find({
        '$or':[
            {name:{$regex : req.params.key}},
            {price:{$regex : req.params.key}},
            {company:{$regex : req.params.key}}
        ]
    })
    resp.send(result);
})

function tokenverify(req, resp, next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        // resp.send(token);
        Jwt.verify(token, jwtkey, (err, accepted)=>{
            if(err){
                resp.status(401).send({result:"plz provide valid token..."})
            }else{
                next();
            }
        })
    }else{
        resp.status(403).send({result:"token not found..."})
    }
}
app.listen(PORT);
