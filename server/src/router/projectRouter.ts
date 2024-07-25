import { Router } from 'express';
import { getAllProjectsWithoutUser, getAllProjectsWithUser, getAllProjects } from '../modules/projects/selectAllProjects'
import { getProjectDetailsById } from '../modules/projects/getProjectDetailsById'
import { addNewProject } from '../modules/projects/addNewProject'
import { updateProjectById } from '../modules/projects/updateProjectDetails'
import { addNewTaskProject } from '../modules/projects/addNewTaskProject'
import { getProjectAssignedUsers } from '../modules/projects/selectUserProjectAssignments'
import { updateTaskProject } from '../modules/projects/updateTaskProjectDetail'
import { selectAllUsersWithoutProject } from '../modules/projects/selectAllUsersWithoutProject'
import { selectAllUsersWithProjects } from '../modules/projects/selectAllUsersWithProject'
import { deleteProject } from '../modules/projects/deleteProject'
import { deleteTaskProject } from '../modules/projects/deleteTaskProject'
import { addClientProjectMeeting } from '../modules/projects/addClientProjectMeeting'
import { getProjectMeetingDetail } from '../modules/projects/getProjectMeetingDetail'
import { updateProjectMeetingDetail } from '../modules/projects/updateProjectMeetingDetail'
import { deleteProjectMeeting } from '../modules/projects/deleteProjectMeeting'
import { addFigmaLink } from '../modules/projects/addFigmaLink'
import { addRepositoryLink } from '../modules/projects/addRepoLink'
import { deleteLink } from '../modules/projects/deleteLink'
import { addProjectDoc } from '../modules/projects/addProjectDocs'
import { deleteProjectDoc } from '../modules/projects/deleteProjectDocs'
import { getTaskProjectDetails } from '../modules/projects/getTaskProjectDetail'

const router = Router();

//Projekty
router.get('/', getAllProjects);//
router.get('/without/:user_id', getAllProjectsWithoutUser);//
router.get('/with/:user_id', getAllProjectsWithUser);//
router.get('/:project_id', getProjectDetailsById);//
router.post('/new', addNewProject);//
router.put('/:project_id', updateProjectById);//
router.get('/:project_id/users', getProjectAssignedUsers);//
router.delete('/:project_id', deleteProject);//

router.get('/users/available', selectAllUsersWithoutProject);//
router.get('/users/busy', selectAllUsersWithProjects);//

//Taski do projektów
router.post('/task/new', addNewTaskProject);//
router.put('/task/:task_id', updateTaskProject);//
router.delete('/task/:task_id', deleteTaskProject);//
router.get('/task/:task_id', getTaskProjectDetails);//

//Spotkania
router.post('/meeting/new', addClientProjectMeeting);//
router.get('/meeting/:meeting_id', getProjectMeetingDetail);//
router.put('/meeting/:meeting_id', updateProjectMeetingDetail);//
router.delete('/meeting/:meeting_id', deleteProjectMeeting);//

//linki repo/figma, dokumentacje
router.post('/link/figma', addFigmaLink);//
router.post('/link/repo', addRepositoryLink);//
router.post('/doc', addProjectDoc);//

router.delete('/link/:link_id', deleteLink);//
router.delete('/doc/:doc_id', deleteProjectDoc);//

module.exports = router