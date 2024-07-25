import { Router } from 'express';
import { getAllProjectsWithoutUser, getAllProjectsWithUser, getAllProjects } from '../modules/projects/selectAllProjects'
import { getProjectDetailsById } from '../modules/projects/getProjectDetailsById'
import { addNewProject } from '../modules/projects/addNewProject'
import { updateProjectById } from '../modules/projects/updateProjectDetails'
import { addNewTaskProject } from '../modules/projects/addNewTaskProject'
import { getProjectAssignedUsers } from '../modules/projects/selectUserProjectAssignments'
import { updateTaskProject } from '../modules/projects/updateTaskProjectDetail'

const router = Router();

//Projekty
router.get('/', getAllProjects);
router.get('/without/:user_id', getAllProjectsWithoutUser);
router.get('/with/:user_id', getAllProjectsWithUser);
router.get('/:project_id', getProjectDetailsById);
router.post('/new', addNewProject);
router.put('/:project_id', updateProjectById);
router.get('/:project_id/users', getProjectAssignedUsers);
router.delete('/:project_id', );

//Taski projektów
router.post('/task/new', addNewTaskProject);
router.put('/task/:task_id', updateTaskProject);
router.delete('/task/:task_id',);

module.exports = router