import mongoose from "mongoose";

const userSchema = new mongoose.Schema({   
    name:{  
        type: String,
        required: true,
        minlength: 3,
      
    },
    email: {  
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {  
        type: String,
        required: true,
        minlength: 6,
    },
    role: {  
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {  
        type: Date,
        default: Date.now,
    },
  

})

const User = mongoose.model('User', userSchema);

export default User;    
