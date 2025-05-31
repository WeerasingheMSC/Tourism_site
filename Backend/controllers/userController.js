import User from "../models/User.js";

/**
 * @desc    Get currently logged-in user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // auth middleware put decoded token on req.user
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
