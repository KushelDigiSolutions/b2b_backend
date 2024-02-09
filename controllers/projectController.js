const Project = require("../models/Project");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getProjects = async ({ id, query, page, perPage }) => {
    let and = [];

    if (id && id !== "" && id !== "undefined") {
        and.push({ _id: id });
    }

    if (query && query !== "" && query !== "undefined") {
        console.log(query);
        and.push({ title: { $regex: query, $options: "i" } });
    }

    if (and.length === 0) {
        and.push({});
    }
    const count = await Project.count({ $and: and });
    let data;

    if (page && page !== "" && page !== "undefined") {
        data = await Project.find({ $and: and }).skip((page - 1) * perPage).limit(perPage);
    }
    else
    {
        data = await Project.find({ $and: and });
    }
    
    return { status: true, data, count };
};

const postProject = async ({ title, location, file, desc, defaultImg, auth }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    if (defaultImg || defaultImg === "true") {
        const newProject = new Project({
            title, defaultImg, img: [], desc, location, ts: new Date().getTime(), status: true, createdBy: auth
        });
        const saveProject = await newProject.save();

        return { status: true, message: 'New Project created', data: saveProject };
    }
    else {
        const newProject = new Project({
            title, defaultImg, img: file, desc, location, ts: new Date().getTime(), status: true, createdBy: auth
        });
        const saveProject = await newProject.save();

        return { status: true, message: 'New Project created', data: saveProject };
    }
};

const uploadImage = async ({ file }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }
    let result = [];

    for (let i of file) {
        var locaFilePath = i.path;
        var result1 = await uploadToCloudinary(locaFilePath);
        result.push(result1);
    }
    console.log(result);

    return { status: true, message: 'Image uploaded successfully', data: result };
};

const updateProject = async ({ id, auth, title, defaultImg, desc, file, status, isFavorite }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ title, defaultImg, status, desc, isFavorite });

    if (defaultImg !== '' && defaultImg !== 'undefined' && defaultImg) {
        updateObj['img'] = [];
    }

    if (file !== '' && file !== undefined && file !== null) {
        updateObj['img'] = file;
    }

    const updateProject = await Project.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Project updated successfully', data: updateProject };
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
    deleteProjectImage
};
