import Employees from "../models/employee.js";


export const getEmployees = async (req, res) => {
    try {
        const employee = await Employees.find();
        res.json(employee)
    } catch (error) {
        console.log(error);
    }
}

export const postEmployees = async (req, res, next) => {
    try {
        const { name, role, department, email } = req.body;
        const emp = await Employees({ name, role, department, email });
        await emp.validate()
        await emp.save();
        res.status(201).json(emp);
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError' || err.code === 11000) {
            return res.status(400).json({ error: err.message });
        }

    }
}


export const putEmployee = async (req,res)=>{
    try {
        const {name,email,department,role} = req.body;
        const emp = await Employees.findById(req.params.id);
        if(!emp) return res.status(404).json({error:"Employee not found"});
        emp.name = name;
        emp.role = role;
        emp.department= department;
        emp.email= email;
        await emp.validate();
        await emp.save();
        res.json(emp)
    } catch (err) {
        if(err.name === 'ValidationError' || err.code === 11000){
            return res.status(400).json({error:err.message});
        }
        
    }

}

export const deleteEmployee = async (req,res)=>{
    try {
        const emp = await Employees.findByIdAndDelete(req.params.id);
        if(!emp) return res.status(404).json({error:'Employee not found'});
        res.json({message: 'Employee deleted'})

    } catch (error) {
        console.log(error);
    }
}