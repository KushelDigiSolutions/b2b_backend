const express = require("express");
const {verify,getUsers,signin,login,sendOtp,changePassword,submitOtp,resetPassword,deleteUsers,deleteUser,updateUser,deleteUserImage} = require("../controllers/userController");
const { upload } = require('../util/util');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/verify', auth, async (req, res) => {
    const data = await verify({ auth: req.user });
    res.json(data);
});

router.get('/getUsers', async (req, res) => {
    const data = await getUsers({ ...req.query });
    res.json(data);
});

router.post('/signin', async (req, res) => {
    const data = await signin({ ...req.body });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.post('/login', async (req, res) => {
    const data = await login({ ...req.body });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateUser/:userId', auth, upload, async (req, res) => {
    try {
        const data = await updateUser({ ...req.body,  userId: req.params.userId, auth: req.user, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
       return res.json(data);
    } 
    
    catch (error) {
        console.log(error);
    }

});

router.delete('/deleteUsers', async (req, res) => {
    const data = await deleteUsers({ ...req.body });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.delete('/deleteUser/:id', async (req, res) => {
    const data = await deleteUser({ ...req.body, id: req.params.id });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.post('/sendOtp', async (req, res) => {
    const data = await sendOtp({ ...req.body });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.post('/submitOtp', async (req, res) => {
    const data = await submitOtp({ ...req.body });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.post('/changePassword', async (req, res) => {
    const data = await changePassword({ ...req.body });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/resetPassword/:userId', async (req, res) => {
    const data = await resetPassword({ ...req.body, userId: req.params.userId });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.delete('/deleteUserImage/:id', auth, async (req, res) => {
    try {
        let data = await deleteUserImage({ auth: req.user, id: req.params.id });
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

