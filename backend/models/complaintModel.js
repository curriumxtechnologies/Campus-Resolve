import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const complaintSchema = new mongoose.Schema(
  {
    // 🆕 Reference to the student who submitted the complaint
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,                     // <-- ensures every complaint belongs to someone
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      url: { type: String, default: "" },
      fileName: { type: String, default: "" },
      fileType: {
        type: String,
        enum: ["jpg", "png", "pdf", ""],
        default: "",
      },
    },
    status: {
      type: String,
      enum: ["pending", "replied"],
      default: "pending",
    },
    feedback: [feedbackSchema],

    resendCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto update status when feedback array changes
complaintSchema.pre("save", function () {
  if (this.isModified("feedback")) {
    this.status = this.feedback.length > 0 ? "replied" : "pending";
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;