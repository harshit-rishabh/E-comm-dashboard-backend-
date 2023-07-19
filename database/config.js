const mongoose = require('mongoose');
const url = 'mongodb+srv://harshitshukla4385:ecomm@cluster0.rtwqqag.mongodb.net/E-comm?retryWrites=true&w=majority';
const connectionparams = {
    useNewURLParser:true,
    useUnifiedTopology:true
}
mongoose.connect(url, connectionparams).then(()=>console.log('connected')).catch((err)=>console.log(err));