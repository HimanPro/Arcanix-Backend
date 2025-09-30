const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../model/admin_login");
const admin_login = require("../model/admin_login");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const stake2 = require("../model/stake");
const registration = require("../model/registration");
const WithdrawalModel = require("../model/withdraw");

// router.post("/admin-signup", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await Admin({
//       email: email,
//       password: hashedPassword,
//     }).save();
//     if (user) {
//       return res.json({
//         error: false,
//         status: 200,
//         user,
//       });
//     } else {
//       return res.json({
//         error: true,
//         status: 400,
//         message: "User Not Created",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       error: true,
//       status: 500,
//       message: "Something Went Wrong",
//     });
//   }
// });

router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      return res.json({
        error: true,
        status: 400,
        message: "Email And Password Is Required",
      });
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.json({
        error: true,
        status: 400,

        message: "Email Id Not Found",
      });
    } else {
      if (user.password) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ email: user.email }, process.env.JWT, {
          expiresIn: "12h",
        });

        const expirationTimestamp = Date.now() + 12 * 3600000;

        if (!passwordMatch) {
          return res.json({
            error: true,
            status: 400,
            message: "Password Incorrect",
          });
        } else {
          return res.json({
            token,
            email: user.email,
            expiresIn: expirationTimestamp,
            status: 200,
            error: false,
            message: "Logged in Successfully",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: true,
      status: 500,
      message: "Something Went Wrong",
    });
  }
});

router.post("/generate-secret", async (req, res) => {
  const { email } = req.body;
  console.log(email, "gdgdf");
  const user = await admin_login.findOne({ email: email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const secret = speakeasy.generateSecret({ name: "MySecureApp" });
  console.log(secret, "sercret");
  user.secret = secret.base32;
  await user.save();
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.json({ secret: secret.base32, qrCode: data_url });
  });
});
router.post("/verify-token", async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await admin_login.findOne({ email: email });

    if (!user) {
      return res.json({
        status: 400,
        message: "User not found",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token,
    });
    return res.json({
      verified,
      status: 200,
    });
  } catch (err) {
    console.error("Error verifying 2FA token:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stakes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { user } = req.query;

    // Build filter condition
    let filter = {};
    if (user) {
      filter.user = { $regex: user, $options: "i" };
    }

    // Fetch paginated stakes with filter
    const stakes = await stake2
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Total documents with filter
    const total = await stake2.countDocuments(filter);

    // Total amount with filter (sum the correct 'amount' field)
    const totalAmountAgg = await stake2.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

    res.status(200).json({
      success: true,
      stakes,
      total,
      totalAmount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
});

router.get("/userlist", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { user } = req.query;

    // Build filter condition
    let filter = {};
    if (user) {
      filter.userId = { $regex: user, $options: "i" };
    }

    // Fetch paginated stakes with filter
    const stakes = await registration
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Total documents with filter
    const total = await registration.countDocuments(filter);

    // Total amount with filter (sum the correct 'amount' field)
    const totalAmountAgg = await registration.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$stake_amount" } },
        },
      },
    ]);

    const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

    res.status(200).json({
      success: true,
      stakes,
      total,
      totalAmount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
});

router.post("/adminLogin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Email and password are required", success: false });
  }

  try {
    const admin = await admin_login.findOne({ email });

    console.log("admin ",admin)

    if (!admin || admin.password !== password) {
      return res
        .status(401)
        .json({ msg: "Invalid email or password", success: false });
    }

    res.status(200).json({ msg: "Login successful", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error", success: false, error: error.message });
  }
});

router.get("/withdrawlist", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const total = await WithdrawalModel.countDocuments({isapprove : false, isreject : false});
    const withdraws = await WithdrawalModel.find({isapprove : false, isreject : false})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      withdraws,
      page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/withdraw/update
router.put("/withdraw/update", async (req, res) => {
  try {
    const { ids, trxnHash } = req.body;
    await WithdrawalModel.updateMany(
      { _id: { $in: ids } },
      { $set: { trxnHash, isapprove: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/adminDashboardSummary", async (req, res) => {
  try {
    const stakes = await stake2.find({});

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Total stake amount
    const totalStakeAmount = stakes.reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    );

    // ✅ Stake countdowns (replace `isMatured` with your actual field/logic)
    const totalStakeCountdown = stakes.filter((s) => !s.isMatured).length;

    const todayStakeCountdown = stakes.filter(
      (s) => s.createdAt >= today && !s.isMatured
    ).length;

    // ✅ Today's stake amount
    const todayStakeAmount = stakes
      .filter((s) => s.createdAt >= today)
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: await registration.countDocuments({}),
        todayNewUsers: await registration.countDocuments({
          createdAt: { $gte: today },
        }),
        totalStakeAmount,
        totalStakeCountdown,
        todayStakeAmount,
        todayStakeCountdown,
      },
    });
  } catch (error) {
    console.error("AdminDashboardSummary API Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /withdraw/history?page=1&limit=10&user=0x123
router.get("/withdraw/history", async (req, res) => {
  try {
    const { page = 1, limit = 10, user } = req.query;
    const query = { isapprove: true };
    if (user) query.userId = user;

    const total = await WithdrawalModel.countDocuments(query);
    const withdraws = await WithdrawalModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalAmount = await WithdrawalModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$withdrawAmount" } } }
    ]);

    res.json({
      success: true,
      withdraws,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;