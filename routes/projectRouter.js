const express = require('express');
const { getProjects, postProject, uploadImage, updateProject, updateProjectStatus, deleteProjectImage, deleteProject, deleteAllProjects } = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { upload, multiUpload } = require('../util/util');
const { updateUserStatus } = require('../controllers/userController');
const router = express.Router();

router.get('/getProjects/:id',auth , async (req, res) => {
    const data = await getProjects({auth: req.user, id: req.params.id  });
    res.json(data);
});

router.post('/postProject/:id', auth, async (req, res) => {
    const data = await postProject({ ...req.body, auth: req.user , id: req.params.id  });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.post('/uploadImage', multiUpload, auth, async (req, res) => {
    const data = await uploadImage({ ...req.body, auth: req.user, file: req.files.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateProject/:id', auth, async (req, res) => {

    
    try {
        let data = await updateProject({ ...req.body, auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.put('/updateProjectStatus/:id', auth, async (req, res) => {
    try {
        let data = await updateProjectStatus({ ...req.body, auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteProjectImage/:id', auth, async (req, res) => {
    try {
        let data = await deleteProjectImage({ auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteProject/:id', auth, async (req, res) => {
    try {
        let data = await deleteProject({ auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteAllProjects', async (req, res) => {
    try {
        let data = await deleteAllProjects({ auth: req.user });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;
