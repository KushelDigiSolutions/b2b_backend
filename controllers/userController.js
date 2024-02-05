const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = async ({ auth }) => {
    if (!auth) {
        return { status: false };
    }
    return { status: true };
};

const getUsers = async ({ id, query, page, perPage }) => {
    let and = [];
    if (id && id !== "" && id !== "undefined") {
        and.push({ _id: id });
    }
    if (query && query !== "" && query !== "undefined") {
        console.log(query);
        and.push({ name: { $regex: query, $options: "i" } });
    }
    if (and.length === 0) {
        and.push({});
    }

    const count=await User.count({ $and: and });

    let data;
    if (page && page !== "" && page !== "undefined") {
        data = await User.find({ $and: and }).skip((page-1)*perPage).limit(perPage);
    }
    else
    {
        data = await User.find({ $and: and });
    }
    return { status: true, data, count };
};

// const signin = async ({ name, email, phone, password }) => {
const signin = async ({ name, email, password,confirmPassword, categoryies}) => {
    const checkUser = await User.findOne({ email });
    // const checkUser1 = await User.findOne({ phone });

    // if (checkUser || checkUser1) {
    if (checkUser) {
        return { status: false, message: 'User already exists' };
    }

    if(password !== confirmPassword){
    //    window.alert("password and confirmPassword must be same")
        return { status: false, message: 'password and confirm password must be same' };
    }

    const pass = await bcrypt.hash(password, 10);
    const confirmPass = await bcrypt.hash(confirmPassword, 10);
    const newUser = new User({
        name,
        email,
        // phone,
        password: pass,
        categoryies,
        confirmPassword: confirmPass,
        role: 'USER'
    });
    const saveUser = await newUser.save();
    return { status: true, data: saveUser, message: 'User Registration Successfull' };
};

const login = async ({ email, password }) => {
    let emailCheck = await User.findOne({ email });
    if (!emailCheck) {
        return { status: false, message: "Invalid Credentials" };
    }
    const passwordVerify = await bcrypt.compare(password, emailCheck.password);
    if (!passwordVerify) {
        return { status: false, message: "Invalid Credentials" };
    }
    let token = jwt.sign({ _id: emailCheck._id }, process.env.SK);
    return { status: true, message: "Login success", token, user: emailCheck };
};

const updateUser = async ({ userId, name, email, phone,categoryies, website, budget,location, aboutCompany, file, auth,twiter,facebook,linkdin,insta }) => {
    // if (!auth) {
    //     return { success: false, message: "Not Authorised" };
    // }

    if (auth.email !== email) {
        let checkUser = User.findOne({ email });
        if (checkUser) {
            return { status: false, data: ans, message: 'Email already taken' };
        }
    }
    let updateObj = removeUndefined({ name, email,phone,categoryies, website, budget,location, aboutCompany,twiter,facebook,linkdin,insta});

    if (file && file !== "") {
        var result = await uploadToCloudinary(file.path);
        updateObj['img'] = {
            url: result.url,
            id: result.public_id
        };
    }

    // if (password && password !== "undefined" && password !== "") {
    //     password = await bcrypt.hash(password, 3);
    //     updateObj['password'] = password;
    // }
    let ans = await User.findByIdAndUpdate(userId, { $set: updateObj }, { new: true });
    return { status: true, data: ans, message: 'User Updated Successfull' };
};

const deleteUser = async ({ id }) => {
    const ans = await User.findByIdAndDelete(id);
    return { status: true, data: ans };

};

const deleteUsers = async () => {
    const ans = await User.deleteMany();
    return { status: true, data: ans };
};

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

const sendOtp = async ({ email }) => {
    let emailCheck = await User.findOne({ email });
    if (!emailCheck) {
        return { status: false, message: "Invalid Email" };
    }

    let otp = generateOtp();
    // Create a SMTP transport object
    let transporter = nodemailer.createTransport({
        host: "mail.kusheldigi.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "info@kusheldigi.com",
            pass: "Kusheldigiinfo@2025",
        },
        from: "info@kusheldigi.com",
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Message object
    var message = {
        from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
        to: `"User" <${email}>`,

        subject: 'Password reset OTP',

        text: `<div>
                    <p>OTP: ${otp}</p>
                </div>`,

        html: `<div>
                    <p>OTP: ${otp}</p>
                </div>`
    };

    transporter.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
    });

    return { status: true, message: "Otp Sent", email, otp };
};

const submitOtp = async ({ otp, otp1 }) => {
    if (otp.toString() !== otp1.toString()) {
        return { status: false, message: "Invalid Otp" };
    }

    return { status: true, message: "Success" };
};

const changePassword = async ({ email, password }) => {
    password = await bcrypt.hash(password, 8);
    await User.findOneAndUpdate({ email }, { password }, { new: true });

    return { status: true, message: "Password reset success" };
};

const resetPassword = async ({ password, userId }) => {
    let password1 = await bcrypt.hash(password, 8);
    let user = await User.findOneAndUpdate({ _id: userId }, { password: password1 }, { new: true });
    console.log(user);
    // Create a SMTP transport object
    let transporter = nodemailer.createTransport({
        host: "mail.kusheldigi.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "info@kusheldigi.com",
            pass: "Kusheldigiinfo@2025",
        },
        from: "info@kusheldigi.com",
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Message object
    var message = {
        from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
        to: `"User" <${user.email}>`,

        subject: 'Password Reset | New Password',

        text: `New Password: ${password}`,

        html: `<div>
                    <p>New Password: ${password}</p>
                </div>`
    };

    transporter.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
    });

    return { status: true, message: "Password reset success" };
};

module.exports = {
    verify,
    getUsers,
    signin,
    login,
    updateUser,
    deleteUser,
    deleteUsers,
    sendOtp,
    submitOtp,
    changePassword,
    resetPassword
}