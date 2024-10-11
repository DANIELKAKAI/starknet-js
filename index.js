import { Account, RpcProvider, json, Contract } from "starknet";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();


const provider = new RpcProvider({
  nodeUrl: "http://127.0.0.1:5050/rpc",
});


const accountAddress = '0x22143db9e8a13fe27381b252b7de208f4be7ba8114d2971cd2b2b6879dd7bc9';
const privateKey = process.env.PRIVATE_KEY;
const account = new Account(provider, accountAddress, privateKey, "1");


const contractAddress = '0x51bff1c2003f28d7f66e75e9f582a6375d5b44e1d0a6a88ca74fef7f5787a27';
const compiledContractAbi = json.parse(
  fs.readFileSync("./abi.json").toString("ascii")
);

const letapayContract = new Contract(
  compiledContractAbi,
  contractAddress,
  provider
);

let owner = await letapayContract.get_owner();

console.log("Stored_data:", owner.toString());


const payment_id = 8;


letapayContract.connect(account);
const myCall = letapayContract.populate("add_payment", [payment_id, "0x4af968c2342d5b783dbe358d01d6e90d77a1cb30a1f8d98d630ce47520258ff", 20]);
const res = await letapayContract.add_payment(myCall.calldata);
const tx_receipt = await provider.waitForTransaction(res.transaction_hash);


console.log("res", res);


const myCall2 = letapayContract.populate("get_payment", [payment_id]);
const res2 = await letapayContract.get_payment(myCall2.calldata);

console.log("res", res2);






