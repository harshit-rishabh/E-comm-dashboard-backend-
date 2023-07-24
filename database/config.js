const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = `${process.env.REACT_APP_ATLAS_URL}`;
const connectionparams = {
    useNewURLParser:true,
    useUnifiedTopology:true,
    useUnifiedTopology:true
}
mongoose.connect(url, connectionparams).then(()=>console.log('connected')).catch((err)=>console.log(err));
