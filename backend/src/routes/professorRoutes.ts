import express from "express";
import { getProfessorById,getProfessors,createProfessor} from "../controllers/professorControllers";
const router = express.Router();

router.get('/', getProfessors);
router.get('/:id', getProfessorById);
router.post('/', createProfessor);
// router.put('/:id', updateProfessor);

export default router;