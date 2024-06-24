const express = require("express");
const ApplyCareer = require("../model/applyCareer");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");



// create request (APPLY JOB)
router.post("/apply-job", catchAsyncErrors(async (req,res,next)=> {
    try{

    //   const careerId = req.body._id;
    //   const career = await ApplyCareer.findById(careerId);
    //   if (!career) {
    //     return next(new ErrorHandler("Career Id is invalid!", 400));
    //   } else {
        let cv = [];

        if (typeof req.body.cv === "string") {
          cv.push(req.body.cv);
        } else {
          cv = req.body.cv;
        }
      
        const cvLinks = [];
      
        for (let i = 0; i < cv.length; i++) {
          const result = await cloudinary.v2.uploader.upload(cv[i], {
            folder: "applyCareer",
          });
      
          cvLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        const careerData = req.body;
        careerData.cv = cvLinks;
        // careerData.career = career;

        const applyCareer = await ApplyCareer.create(careerData);

        res.status(201).json({
            success: true,
            applyCareer
        })
    // }

    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}))

// get all appliers to the job
router.get("/all-job-appliers", catchAsyncErrors(async (req,res,next)=>{
    try{
        const applyCareers = await ApplyCareer.find().sort({
            createdAt: -1
        }) 

        res.status(201).json({
            success: true,
            applyCareers
        })
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}))

// get appliers to the job
router.get("/job-applier/:id", catchAsyncErrors(async (req,res,next)=>{
    try{
        const career = await ApplyCareer.findById(req.params.id) 

        res.status(201).json({
            success: true,
            career
        })
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}))

// delete job request
router.delete("/delete-apply-job/:id", catchAsyncErrors(async (req,res,next)=>{
    try{
        const career = await ApplyCareer.findById(req.params.id);

        if(!career){
            return next(
                new ErrorHandler("Request is not available with this id", 400)
              );
        }

        await ApplyCareer.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: "Request deleted successfully!",
          });
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
}))


module.exports = router;