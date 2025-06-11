import CustomTourRequest from "../models/CustomTourRequest.js";
import { sendEmail } from "../services/emailService.js";

/**
 * @desc    Submit a custom tour request
 * @route   POST /requests
 * @access  Public
 */
export const submitTourRequest = async (req, res, next) => {
  try {
    const tourRequestData = req.body;

    // Create a new custom tour request from the form data
    const newRequest = await CustomTourRequest.create(tourRequestData);

    res.status(201).json({
      message: "Tour request submitted successfully",
      request: newRequest,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin view all custom tour requests
 * @route   GET /requests
 * @access  Admin only
 */
export const getAllRequests = async (req, res, next) => {
  try {
    const requests = await CustomTourRequest.find({
      "approvalStatus.status": "pending",
    });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin approve or reject custom tour request and notify tourist
 * @route   PUT /requests/:id
 * @access  Admin only
 */
export const approveRejectTourRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate the status
    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "approved" or "rejected"' });
    }

    const request = await CustomTourRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    // Update approval status
    request.approvalStatus.status = status;
    request.approvalStatus.adminNotes = adminNotes || "";
    request.approvalStatus.reviewedAt = new Date();
    request.approvalStatus.reviewedBy = req.user.userId;

    await request.save();

    // Send approval/rejection email to the tourist
    const subject =
      status === "approved"
        ? "Your Custom Tour Request is Approved"
        : "Your Custom Tour Request is Rejected";
    const text = `Your custom tour request has been ${status}. Admin notes: ${
      adminNotes || "No additional notes"
    }.`;

    let emailError;
    try {
      await sendEmail(request.email, subject, text);
      console.log(`✅ Email sent to ${request.email} regarding request ${id}`);
    } catch (e) {
      emailError = e;
      console.error(`❌ Failed to send email to ${request.email}:`, e);
    }

    res.json({
      message: `Tour request ${status} successfully`,
      request,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin view one custom tour request’s full details
 * @route   GET /requests/:id
 * @access  Admin only
 */
export const getRequestById = async (req, res, next) => {
  try {
    // 🔄 1) Grab the ID from the URL params
    const { id } = req.params;

    // 🔄 2) Fetch that single request document
    const request = await CustomTourRequest.findById(id);

    // 🔄 3) If not found, return 404
    if (!request) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    // 🔄 4) Otherwise, send it back as JSON
    res.json(request);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin view all custom tour requests
 * @route   GET /noStatusRequests
 * @access  Admin only
 */
export const getAllRequestsNoStatus = async (req, res, next) => {
  try {
    const requests = await CustomTourRequest.find();

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

