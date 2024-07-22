import { Router } from 'express';
import {getAllProjectsWithoutUser, getAllProjectsWithUser, getAllProjects} from '../modules/projects/selectAllProjects'

const router = Router();

router.get('/', getAllProjects);
router.get('/without/:user_id', getAllProjectsWithoutUser);
router.get('/with/:user_id', getAllProjectsWithUser);





module.exports = router