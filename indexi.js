require("dotenv").config();
require("./connection");
const Web3 = require("web3");
const express = require("express");
const cors = require("cors");
const config2 = require("./models/Configs");
const app = express();
const dashboardRouter = require("./routes/Dashboard");
const signup = require("./models/signup");
const Registration = require("./models/Registration");
const stake2 = require("./models/stake");

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins
      callback(null, true);

      // To revert back to allowed origins, comment out the above line and uncomment the following block:
      /*
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
      */
    },
  })
);

// app.use("/api", routes);
app.use("/api", dashboardRouter);

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.contractRPC_URL, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 15,
      onTimeout: false,
    },
  })
);

const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint8","name":"plan","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"investId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"capitalAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"roiAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"CapitalClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DailyROIClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdtAmount","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"plan","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"investId","type":"uint256"}],"name":"Investment","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint8","name":"level","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"levelIncome","type":"uint256"}],"name":"LevelIncome","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RealTokensDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"ReferralIncome","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referrerId","type":"uint256"}],"name":"Registrationico","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referrerId","type":"uint256"}],"name":"Registrationinvst","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdtAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"virtualTokens","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[],"name":"RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"adminDistributeRealTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"arxToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"usdtAmount","type":"uint256"},{"internalType":"uint8","name":"plan","type":"uint8"}],"name":"arxinvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"users","type":"address[]"}],"name":"batchDistribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"usdtAmount","type":"uint256"}],"name":"buyTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"plan","type":"uint8"},{"internalType":"uint256","name":"investId","type":"uint256"}],"name":"claimCapital","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimDailyROI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plan","type":"uint256"}],"name":"claimDailyROI2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"plan","type":"uint256"}],"name":"claimDailyROI3","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getCurrentClaimableROI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getPurchase","outputs":[{"internalType":"uint256","name":"usdtSpent","type":"uint256"},{"internalType":"uint256","name":"tokensReceived","type":"uint256"},{"internalType":"bool","name":"distributed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"plan","type":"uint256"}],"name":"getROIBreakdown","outputs":[{"internalType":"uint256[]","name":"usdtAmounts","type":"uint256[]"},{"internalType":"uint256[]","name":"claimedROIs","type":"uint256[]"},{"internalType":"uint256[]","name":"claimableROIs","type":"uint256[]"},{"internalType":"uint256[]","name":"timestamps","type":"uint256[]"},{"internalType":"uint256[]","name":"roiPercents","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"idToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_usdtAddress","type":"address"},{"internalType":"address","name":"arxAddress","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"isUserExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"isUserExistsInvst","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastUserId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"purchases","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"invst_ref","type":"address"},{"internalType":"address","name":"ico_ref","type":"address"},{"internalType":"uint256","name":"partnerCount","type":"uint256"},{"internalType":"uint256","name":"usdtSpentico","type":"uint256"},{"internalType":"uint256","name":"usdtSpentinvst","type":"uint256"},{"internalType":"uint256","name":"tokensReceived","type":"uint256"},{"internalType":"uint256","name":"totalROIClaimed","type":"uint256"},{"internalType":"uint256","name":"targetROI","type":"uint256"},{"internalType":"uint256","name":"lastClaimedAt","type":"uint256"},{"internalType":"bool","name":"distributed","type":"bool"},{"internalType":"uint256","name":"refToken","type":"uint256"},{"internalType":"uint256","name":"teambusiness","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"realToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_referrer","type":"address"}],"name":"registrationEx","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referrer","type":"address"}],"name":"registrationExInvst","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"useradd","type":"address"}],"name":"seeHistroyArx","outputs":[{"components":[{"internalType":"uint256","name":"usdt","type":"uint256"},{"internalType":"uint256","name":"arx","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct ArcanixICO.DetailsICO[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"useradd","type":"address"},{"internalType":"uint256","name":"plan","type":"uint256"}],"name":"seeHistroyInvst","outputs":[{"components":[{"internalType":"uint256","name":"usdtAmount","type":"uint256"},{"internalType":"uint256","name":"plan","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"roiPercent","type":"uint256"},{"internalType":"uint256","name":"claimedROI","type":"uint256"},{"internalType":"bool","name":"stakestatus","type":"bool"}],"internalType":"struct ArcanixICO.Details[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_realToken","type":"address"}],"name":"setRealToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawUSDT","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const contract = new web3.eth.Contract(ABI, process.env.contractAddress);

async function getLastSyncBlock() {
  let { lastSyncBlock } = await config2.findOne();
  return lastSyncBlock;
}
async function getEventReciept(fromBlock, toBlock) {
  let eventsData = await contract.getPastEvents("allEvents", {
    fromBlock: fromBlock,
    toBlock: toBlock,
  });
  return eventsData;
}

async function getTimestamp(blockNumber) {
  let { timestamp } = await web3.eth.getBlock(blockNumber);
  return timestamp;
}

async function processEvents(events) {
  //console.log("events.length ",events.length)
  for (let i = 0; i < events.length; i++) {
    const { blockNumber, transactionHash, returnValues, event } = events[i];
    // console.log(blockNumber, transactionHash, returnValues, event);
    const timestamp = await getTimestamp(blockNumber);

     if (event == "Registrationico") {
          try {
            let userId =
            "ARX" +
            Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, "0");
            let isNotReg = await Registration.findOne({ user: returnValues[0] });
            if (!isNotReg) {
    
              let notsigned = await signup.findOne({ user: returnValues[0] });
              if (!notsigned) {
    
                await signup.create({
                  user: returnValues[0],
                  userId: userId
                });
              }
    
              let referrer = await Registration.findOne({
                user: returnValues[1],
              });
              if (!referrer) {
                referrer = { userId: 0 };
              }
    
    
              await Registration.create({
                user: returnValues.user,
                uId: returnValues[2],
                userId: userId,
                referrer: returnValues.referrer,
                txHash: transactionHash,
                block: blockNumber,
                timestamp: timestamp,
                regfrom: "ICO"
              });
            }
          } catch (e) {
            console.log("Error (Registration Event):", e.message);
          }
        } else if(event == "Registrationinvst") {
          try {
            let userId =
            "ARX" +
            Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, "0");
            let isReg = await Registration.findOne({ user: returnValues[0] });
            if (!isReg) {
            let isNotReg = await signup.findOne({ user: returnValues.user });
            if (!isNotReg) {
             
    
             
    
              await signup.create({
                user: returnValues[0],
                userId: userId
              });
            }

            await Registration.create({
                user: returnValues.user,
                userId: userId,
                referrer: returnValues.referrer,
                txHash: transactionHash,
                block: blockNumber,
                timestamp: timestamp,
                regfrom: "INVEST"
              });
            }
          } catch (e) {
            console.log("Error (Registration Event):", e.message);
          }
        } else if(event == "Investment") {
          try {
            let userDetails = await stake2.findOne({ txHash: transactionHash });
            if (!userDetails) {
              await stake2.create({
                user: returnValues.user,
                amount: returnValues.usdtAmount,
                plan: returnValues.plan,
                investId : returnValues.investId,
                txHash: transactionHash,
                block: blockNumber,
                timestamp: timestamp,
              });
            }
          } catch (e) {
            console.log("Error (Investment Event):", e.message);
          }
        }
  }
}

async function updateBlock(updatedBlock) {
  try {
    let isUpdated = await config2.updateOne(
      {},
      { $set: { lastSyncBlock: updatedBlock } }
    );
    if (!isUpdated) {
      console.log("Something went wrong!");
    }
  } catch (e) {
    console.log("Error Updating Block", e);
  }
}


async function listEvent() {
  let lastSyncBlock = await getLastSyncBlock();
  let latestBlock = await web3.eth.getBlockNumber();
  let toBlock =
    latestBlock > lastSyncBlock + 1000 ? lastSyncBlock + 1000 : latestBlock;
  //console.log(lastSyncBlock, toBlock);
  let events = await getEventReciept(lastSyncBlock, toBlock);
  //console.log("events", events.length);

  await processEvents(events);
  await updateBlock(toBlock);
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
