import express from "express";
import {
  postComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  addFeedback,
  markAsResolved,
  resendComplaint,
} from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CampusResolveComplaints",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});
const upload = multer({ storage });

// Protect all routes
router.use(protect);

// Student endpoints
router.post("/", upload.single("image"), postComplaint);
router.get("/mine", getMyComplaints);          // <-- student’s own complaints

// Admin endpoint
router.get("/", getAllComplaints);             // <-- all complaints (admin)

// Shared endpoints
router.get("/:id", getComplaintById);
router.post("/:id/feedback", addFeedback);
router.put("/:id/resolve", markAsResolved);
router.post("/:id/resend", resendComplaint);

export default router;