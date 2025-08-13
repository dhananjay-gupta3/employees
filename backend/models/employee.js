import mongoose from "mongoose";



const employeeSchema = new mongoose.Schema({
    name:{type:String, require:[true, 'Name is required'],
        minlength:2
    },
    role: {type: String, require:[true,'Role is required']},
    department:{type:String,require:[true,'Department is required']},
    email:{type:String,
        require:[true,'Email is required'],
        match:[/\S+@\S+\.\S+/,'Email is invalid'],
        unique:true

    }
})

const Employees = mongoose.model('Employees', employeeSchema);

export default Employees