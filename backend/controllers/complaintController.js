import asyncHandler from "express-async-handler";
import Complaint from "../models/complaintModel.js";

// @desc    Submit a new complaint (student)
// @route   POST /api/complaints
// @access  Private
const postComplaint = asyncHandler(async (req, res) => {
  const { subject, title, category, description } = req.body;

  if (!subject || !title || !category || !description) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  let attachmentData = { url: "", fileName: "", fileType: "" };

  if (req.file) {
    const originalName = req.file.originalname || "";
    const lowerName = originalName.toLowerCase();
    let fileType = "";
    if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) fileType = "jpg";
    else if (lowerName.endsWith(".png")) fileType = "png";
    else if (lowerName.endsWith(".pdf")) fileType = "pdf";

    attachmentData = {
      url: req.file.path || req.file.secure_url || "",
      fileName: originalName,
      fileType,
    };
  }

  const complaint = await Complaint.create({
    user: req.user._id,               // <-- the student who submitted
    subject,
    title,
    category,
    description,
    attachment: attachmentData,
  });

  res.status(201).json({
    success: true,
    message: "Complaint submitted successfully",
    complaint,
  });
});

// @desc    Get ALL complaints (admin only)
// @route   GET /api/complaints
// @access  Private (admin)
const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("user", "fullName studentId institutionalEmail")   // <-- adds student info
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints,
  });
});

// @desc    Get logged‑in student's OWN complaints
// @route   GET /api/complaints/mine
// @access  Private (student)
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints,
  });
});

// @desc    Get single complaint (generic)
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate("user", "fullName studentId");
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }
  res.status(200).json({ success: true, complaint });
});

// @desc    Add feedback (student or admin reply)
// @route   POST /api/complaints/:id/feedback
// @access  Private
const addFeedback = asyncHandler(async (req, res) => {
  const { message, sender } = req.body;
  if (!message || !sender) {
    res.status(400);
    throw new Error("Message and sender are required");
  }
  if (!["student", "admin"].includes(sender)) {
    res.status(400);
    throw new Error("Sender must be 'student' or 'admin'");
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.feedback.push({ message, sender });
  const updatedComplaint = await complaint.save();

  res.status(201).json({
    success: true,
    message: "Feedback added",
    complaint: updatedComplaint,
  });
});

// @desc    Mark complaint as resolved (student or admin)
// @route   PUT /api/complaints/:id/resolve
// @access  Private
const markAsResolved = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  // Since we only have "pending"/"replied", we treat "resolved" as a client‑side flag.
  // We can keep status as "replied" or add a separate field if desired.
  res.status(200).json({
    success: true,
    message: "Complaint marked as resolved",
    complaint,
  });
});

// @desc    Resend a complaint that hasn't been replied to
// @route   POST /api/complaints/:id/resend
// @access  Private
const resendComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (complaint.status !== "pending") {
    res.status(400);
    throw new Error("Complaint has already been replied to");
  }

  complaint.resendCount += 1;
  complaint.feedback.push({
    message: "Complaint resent – awaiting response.",
    sender: "student",
  });

  const updatedComplaint = await complaint.save();

  res.status(200).json({
    success: true,
    message: "Complaint resent successfully",
    complaint: updatedComplaint,
  });
});

export {
  postComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  addFeedback,
  markAsResolved,
  resendComplaint,
};