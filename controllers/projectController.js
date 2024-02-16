const Project = require("../models/Project");
const User = require("../models/User");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose');
const path = require("path");


// let and = [];

// if (id && id !== "" && id !== "undefined") {
//     and.push({ _id: id });
// }

// if (query && query !== "" && query !== "undefined") {
//     console.log(query);
//     and.push({ title: { $regex: query, $options: "i" } });
// }

// if (and.length === 0) {
//     and.push({});
// }
// const count = await Project.count({ $and: and });
// let data;

// if (page && page !== "" && page !== "undefined") {
//     data = await Project.find({ $and: and }).skip((page - 1) * perPage).limit(perPage);
// }


// data = await Project.find({ $and: and });

const getProjects = async ({ id }) => {
    try {

        const data = await User.findById(id).populate("project").exec();
        console.log(data);
        return { status: true, data };
    } catch (error) {
        console.log("error", error);
    }
};

const getProjects1 = async (id) => {
    // let and = []
    const data = await Project.find();
    return { status: true, data }
}

const postProject = async ({ id, title, location, file, desc, defaultImg, auth, bidDate, startDate, stage, buildingUse, Value, sector }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }
    try {


        if (defaultImg || defaultImg === "true") {

            const newProject = new Project({
                title, defaultImg, img: [], desc, bidDate, startDate, stage, buildingUse, Value, sector, location, ts: new Date().getTime(), status: true, createdBy: auth
            });
            const saveProject = await newProject.save();

            // Update user's project field with the new project's ID
            await User.findByIdAndUpdate(id, { $push: { project: saveProject._id } });

            return { status: true, message: 'New Project created', data: saveProject };
        }
        else {
            const newProject = new Project({
                title, defaultImg, img: file, desc, bidDate, startDate, stage, buildingUse, Value, sector, location, ts: new Date().getTime(), status: true, createdBy: auth
            });
            const saveProject = await newProject.save();

            // Update user's project field with the new project's ID
            await User.findByIdAndUpdate(id, { $push: { project: saveProject._id } });

            return { status: true, message: 'New Project created', data: saveProject };
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "500"
        }
    }
};


function getFileType(filePath) {
    // Extract the file extension
    console.log("filpath", filePath);
    const extension = path.extname(filePath).toLowerCase();

    console.log("extension", extension);

    // Map common file extensions to MIME types
    const extensionToType = {
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        // Add more mappings as needed
    };

    // Return the corresponding MIME type if known, otherwise return null
    return extensionToType[extension] || null;
}


const uploadImage = async ({ file }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }
    let result = [];

    for (let i of file) {
        var locaFilePath = i.path;
        var fileType = getFileType(locaFilePath);

        if (fileType === null) {
            var uploadResult = await uploadToCloudinary(locaFilePath);
            const { message, Success, public_id } = uploadResult;
            result.push({ fileName: i.originalname, public_id, Success, message });
        }

        else {
            var uploadResult = await uploadToCloudinary(locaFilePath);
            result.push(uploadResult);
        }
    }

    return { status: true, message: 'Upload completed', data: result };
};


const updateProject = async ({ status, isFavorite, id, title, location, file, desc, defaultImg, bidDate, startDate, stage, buildingUse, Value, sector }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    try {
        let updateObj = removeUndefined({ title, defaultImg, status, desc, isFavorite, location, bidDate, startDate, stage, buildingUse, Value, sector });


        if (defaultImg !== '' && defaultImg !== 'undefined' && defaultImg) {
            updateObj['img'] = [];
        }

        if (file !== '' && file !== undefined && file !== null) {
            updateObj['img'] = file;
        }

        const updateProject = await Project.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

        return { status: true, message: 'Project updated successfully', data: updateProject };
    } catch (error) {
        console.log(error);
    }
};

const updateProjectStatus = async ({ id, auth, status }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ status });

    const updateProject = await Project.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Status updated successfully', data: updateProject };
};

const deleteProjectImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Project image deleted successfully' };
};

const deleteProject = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteProject = await Project.findByIdAndDelete(id);
    if (deleteProject.img.url) {
        cloudinary.uploader.destroy(deleteProject.img.id, async (err, result) => {
            console.log(result);
            if (err) throw err;
        });
    }
    // console.log(deleteProject);

    return { status: true, message: 'Project deleted successfully' };
};

const deleteAllProjects = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteProject = await Project.deleteMany();

    return { status: true, message: 'All Projects deleted successfully' };
};

module.exports = {
    getProjects,
    postProject,
    uploadImage,
    updateProject,
    updateProjectStatus,
    deleteAllProjects,
    deleteProject,
    deleteProjectImage,
    getProjects1
};
