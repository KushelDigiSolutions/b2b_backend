const express = require("express");
const {verify,getUsers,signin,login,sendOtp,changePassword,submitOtp,resetPassword} = require("../controllers/userController");
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

// router.put('/updateUser/:userId', auth, upload, async (req, res) => {
//     try {
//         const data = await updateUser({ ...req.body,  userId: req.params.userId, auth: req.user, file: req.file });
//         if (!data.status) {
//             return res.status(400).json(data);
//         }
//         res.json(data);
//     } 
    
//     catch (error) {
//         console.log(error);
//     }

// });

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

module.exports = router;
