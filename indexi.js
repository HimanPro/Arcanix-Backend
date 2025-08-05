require("dotenv").config();
require("./connection");
const Web3 = require("web3");
const express = require("express");
const cors = require("cors");
const config2 = require("./models/Configs");
const app = express();
const dashboardRouter = require("./routes/Dashboard");

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

const ABI = [{"constant":false,"inputs":[{"name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newImplementation","type":"address"},{"name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"implementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_logic","type":"address"},{"name":"_admin","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"previousAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"implementation","type":"address"}],"name":"Upgraded","type":"event"}]
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
    const { blockNumber, transactionHash, args, event } = events[i];
    // console.log(blockNumber, transactionHash, event);
    const timestamp = await getTimestamp(blockNumber);

     if (event == "Registrationico") {
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
        } else if(event == "Registrationinvst") {
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


const server = app.listen(8080, () => {
  console.log("Server running!");
});
