const Registration = require("../models/Registration");

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

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
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
