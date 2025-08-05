const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const contractABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DailyROIClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdtAmount",
        type: "uint256",
      },
      { indexed: false, internalType: "uint8", name: "plan", type: "uint8" },
    ],
    name: "Investment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      { indexed: false, internalType: "uint8", name: "level", type: "uint8" },
      {
        indexed: false,
        internalType: "uint256",
        name: "levelIncome",
        type: "uint256",
      },
    ],
    name: "LevelIncome",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RealTokensDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "ReferralIncome",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "referrerId",
        type: "uint256",
      },
    ],
    name: "Registrationico",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "referrerId",
        type: "uint256",
      },
    ],
    name: "Registrationinvst",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdtAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "virtualTokens",
        type: "uint256",
      },
    ],
    name: "TokensPurchased",
    type: "event",
  },
  {
    inputs: [],
    name: "RATE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "adminDistributeRealTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "usdtAmount", type: "uint256" },
      { internalType: "uint8", name: "plan", type: "uint8" },
    ],
    name: "arxinvest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address[]", name: "users", type: "address[]" }],
    name: "batchDistribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "usdtAmount", type: "uint256" }],
    name: "buyTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "plan", type: "uint8" }],
    name: "claimCapital",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plan", type: "uint256" }],
    name: "claimDailyROI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plan", type: "uint256" }],
    name: "claimDailyROI2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "plan", type: "uint256" }],
    name: "claimDailyROI3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentClaimableROI",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getPurchase",
    outputs: [
      { internalType: "uint256", name: "usdtSpent", type: "uint256" },
      { internalType: "uint256", name: "tokensReceived", type: "uint256" },
      { internalType: "bool", name: "distributed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "plan", type: "uint256" },
    ],
    name: "getROIBreakdown",
    outputs: [
      { internalType: "uint256[]", name: "usdtAmounts", type: "uint256[]" },
      { internalType: "uint256[]", name: "claimedROIs", type: "uint256[]" },
      { internalType: "uint256[]", name: "claimableROIs", type: "uint256[]" },
      { internalType: "uint256[]", name: "timestamps", type: "uint256[]" },
      { internalType: "uint256[]", name: "roiPercents", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "idToAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_usdtAddress", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "isUserExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "isUserExistsInvst",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUserId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "purchases",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "invst_ref", type: "address" },
      { internalType: "address", name: "ico_ref", type: "address" },
      { internalType: "uint256", name: "partnerCount", type: "uint256" },
      { internalType: "uint256", name: "usdtSpentico", type: "uint256" },
      { internalType: "uint256", name: "usdtSpentinvst", type: "uint256" },
      { internalType: "uint256", name: "tokensReceived", type: "uint256" },
      { internalType: "uint256", name: "totalROIClaimed", type: "uint256" },
      { internalType: "uint256", name: "targetROI", type: "uint256" },
      { internalType: "uint256", name: "lastClaimedAt", type: "uint256" },
      { internalType: "bool", name: "distributed", type: "bool" },
      { internalType: "uint256", name: "refToken", type: "uint256" },
      { internalType: "uint256", name: "teambusiness", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "realToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_referrer", type: "address" }],
    name: "registrationEx",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_referrer", type: "address" }],
    name: "registrationExInvst",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "useradd", type: "address" }],
    name: "seeHistroyArx",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "usdt", type: "uint256" },
          { internalType: "uint256", name: "arx", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct ArcanixICO.DetailsICO[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "useradd", type: "address" },
      { internalType: "uint256", name: "plan", type: "uint256" },
    ],
    name: "seeHistroyInvst",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "usdtAmount", type: "uint256" },
          { internalType: "uint256", name: "plan", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "roiPercent", type: "uint256" },
          { internalType: "uint256", name: "claimedROI", type: "uint256" },
          { internalType: "bool", name: "stakestatus", type: "bool" },
        ],
        internalType: "struct ArcanixICO.Details[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_realToken", type: "address" }],
    name: "setRealToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdtToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawUSDT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const dashboardRouter = require("./routes/Dashboard");
app.use(cors());
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const { ethers } = require("ethers");
const Configs = require("./models/Configs");
const { WebSocketProvider } = require("ethers");
const database = require("./database");
const Registration = require("./models/Registration");
const signup = require("./models/signup");
database();

const provider = new WebSocketProvider(process.env.contractRPC_URL);
const contract = new ethers.Contract(
  process.env.contractAddress,
  contractABI,
  provider
);

async function getLastSyncBlock() {
  let config = await Configs.findOne();

  if (!config) {
    const currentBlock = await provider.getBlockNumber();
    config = await Configs.create({ lastSyncBlock: currentBlock });
  }

  return config.lastSyncBlock;
}

async function getEventReceipt(fromBlock, toBlock) {
  const allEvents = [];

  const eventNames = contractABI
    .filter((item) => item.type === "event")
    .map((item) => item.name);

  for (const eventName of eventNames) {
    const filter = contract.filters[eventName]();
    const logs = await contract.queryFilter(filter, fromBlock, toBlock);
    allEvents.push(...logs);
  }

  return allEvents;
}

async function getTimestamp(blockNumber) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}

async function processEvents(events) {
  for (let i = 0; i < events.length; i++) {
    const { blockNumber, transactionHash, args, fragment } = events[i];
    const eventName = fragment?.name;

    const timestamp = await getTimestamp(blockNumber);

    if (eventName == "Registrationico") {
      try {
        let isNotReg = await Registration.findOne({ user: args[0] });
        if (!isNotReg) {

          let notsigned = await signup.findOne({ user: args[0] });
          if (!notsigned) {
          
            let userId =
            "ARX" +
            Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, "0");

            await signup.create({
              user: args[0],
              userId: userId
            });
          }

          let referrer = await Registration.findOne({
            user: args[1],
          });
          if (!referrer) {
            referrer = { userId: 0 };
          }


          await Registration.create({
            user: args[0],
            uId: args[2],
            userId: userId,
            referrer: args[1],
            rId: args[3],
            txHash: transactionHash,
            block: blockNumber,
            timestamp: timestamp,
          });
        }
      } catch (e) {
        console.log("Error (Registration Event):", e.message);
      }
    } else if(eventName == "Registrationinvst") {
      try {
        let isNotReg = await signup.findOne({ user: args[0] });
        if (!isNotReg) {
         

          let userId =
            "ARX" +
            Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, "0");

          await signup.create({
            user: args[0],
            userId: userId
          });
        }
      } catch (e) {
        console.log("Error (Registration Event):", e.message);
      }
    }
  }
}
app.use("/api", dashboardRouter);

async function updateBlock(blockNumber) {
  // console.log("Updating lastSyncBlock to:", blockNumber);
  await Configs.updateOne({}, { lastSyncBlock: blockNumber });
}

async function listEvent() {
  let lastSyncBlock = await getLastSyncBlock();
  let latestBlock = await provider.getBlockNumber();
  let toBlock =
    latestBlock > lastSyncBlock + 1000 ? lastSyncBlock + 1000 : latestBlock;

  let events = await getEventReceipt(lastSyncBlock, toBlock);

  processEvents(events);
  updateBlock(toBlock);

  if (lastSyncBlock == toBlock) {
    setTimeout(listEvent, 15000);
  } else {
    setTimeout(listEvent, 5000);
  }
}

listEvent();

const server = app.listen(3000, () => {
  console.log("Server running!");
});
