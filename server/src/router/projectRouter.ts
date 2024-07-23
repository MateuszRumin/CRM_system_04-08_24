import { Router } from 'express';
import {getAllProjectsWithoutUser, getAllProjectsWithUser, getAllProjects} from '../modules/projects/selectAllProjects'
import { getProjectDetailsById } from '../modules/projects/getProjectDetailsById'

const router = Router();

router.get('/', getAllProjects);
router.get('/without/:user_id', getAllProjectsWithoutUser);
router.get('/with/:user_id', getAllProjectsWithUser);

router.get('/:project_id', getProjectDetailsById);




module.exports = router