const mongoose = require('mongoose');

const mySchema = mongoose.Schema({
    title: String,
    location: String,
    desc: String,
    bidDate:{
        type: String,
        
    },
    startDate:{
        type: String,
        
    },
    stage:{
        type:String ,
    }
    ,
    buildingUse:{
       type: String ,
    },
    sector: String ,
    value: Number , 
    defaultImg: String,
    createdBy: Object,
    ts: String,
    status: String,
    folder: {
        type :String ,
    
    },
    img: {
        type: Array,
        default: []
    },
    isFavorite: {
        type: String,
        default: "false"
    },
  
}, { timestamps: true });

const Project = mongoose.model('Project', mySchema);

module.exports = Project;
