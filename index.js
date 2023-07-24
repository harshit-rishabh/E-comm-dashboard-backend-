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
const PORT = process.env.REACT_APP_PORT;
app.post('/signup', async (req, resp) => {
    let usersignup = new signup(req.body);
    let result = await usersignup.save();
    result = result.toObject();
    delete result.pass;
    resp.send(result);
});
app.post('/login', async (req, resp) => {
    if (req.body.email && req.body.pass) {
        let user = await signup.findOne(req.body).select('-pass');
        if (user) {
            resp.send(user);
        } else {
            resp.send({ result: "Invalid User..." })
        }
    } else {
        resp.send("plz enter both fields...")
    }

})

app.post('/addproduct', async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})

app.get('/getlist', async (req, resp) => {
    let result = await Product.find();
    resp.send(result);
})

app.delete('/deleteproduct/:id', async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
})

app.get('/getlist/:id', async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result);
    } else {
        resp.send({ result: 'Invalid id...' });
    }
});

app.put('/getlist/:id', async (req, resp) => {
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

app.get('/search/:key', async (req, resp)=>{
    let result  = await Product.find({
        '$or':[
            {name:{$regex : req.params.key}},
            {price:{$regex : req.params.key}},
            {company:{$regex : req.params.key}}
        ]
    })
    resp.send(result);
})
app.listen(PORT);
