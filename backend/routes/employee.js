import { Router } from "express";
import { deleteEmployee, getEmployees, postEmployees, putEmployee } from "../controllers/employees.js";

const router = Router();

router.get('/', getEmployees);
router.post('/', postEmployees);
router.put('/:id', putEmployee)
router.delete('/:id', deleteEmployee)
export default router