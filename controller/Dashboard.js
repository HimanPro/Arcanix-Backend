const Registration = require("../models/Registration");
const signup = require("../models/signup");

const getDashboardData = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const data = await Registration.findOne({ user: address });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    // Fetch userId from Signup schema
    const userRecord = await signup.findOne({ user: data.user });

    // Attach userIdd to the response
    const result = {
      ...data._doc,
      userIdd: userRecord ? userRecord.userId : null,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getDashboardData };
