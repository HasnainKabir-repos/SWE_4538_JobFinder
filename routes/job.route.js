const router = require("express").Router();
const isAuthenticated = require('../middleware/auth.middleware');
const {
    createJob,
    getAllJobs,
    searchByKeywords,
    getKeywords,
    deleteJob,
    updateJob
} = require('../controller/job.controller');


router.post('/create', isAuthenticated, createJob);
router.get('/alljobs', isAuthenticated, getAllJobs);
router.get('/search', isAuthenticated, searchByKeywords);
router.get('/getKeywords', isAuthenticated, getKeywords);
router.delete('/delete',isAuthenticated,  deleteJob);
router.put('/update', isAuthenticated, updateJob);
module.exports = router;