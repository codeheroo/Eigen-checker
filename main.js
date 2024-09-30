import axios from "axios";
import fs from "fs";
import path from "path";
function getAddressesArray(filePath = "addresses.txt") {
  try {
    // Read the file content
    const data = fs.readFileSync(path.resolve(filePath), "utf-8");

    // Split the content into lines and filter out any empty lines
    const addressesArray = data
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return addressesArray;
  } catch (error) {
    console.error("Error reading the file:", error);
    return [];
  }
}
var isNumber = function isNumber(value) {
  return typeof value === "number" && isFinite(value);
};
async function getBalance(address) {
  try {
    const result = await axios.get(
      `https://checkeigen.byzantine.fi/api/getValue?address=${address}`,
    );
    if (
      (isNumber(result.data.kelp) && result.data.kelp != 0) ||
      (isNumber(result.data.swell) && result.data.swell != 0) ||
      (isNumber(result.data.renzo) && result.data.renzo != 0) ||
      (isNumber(result.data.mantle) && result.data.mantle != 0) ||
      (isNumber(result.data.puffer) && result.data.puffer != 0)
    ) {
      console.log(result.data);
      console.log(address);
      return address;
    } else {
      console.log(address);
      return 0;
    }
  } catch (e) {
    console.log(e);
    return await getBalance(address);
  }
}
function splitArrayIntoChunks(array, numChunks = 10) {
  const result = [];
  const chunkSize = Math.ceil(array.length / numChunks);

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;

    // Slice the array into the chunk and push it to the result
    const chunk = array.slice(start, end);

    if (chunk.length > 0) {
      result.push(chunk);
    }
  }

  return result;
}
const addresses = getAddressesArray();
const chunks = splitArrayIntoChunks(addresses, 1000);

let balances = [];

for (const chunk of chunks) {
  const balance = await Promise.all(chunk.map((addr) => getBalance(addr)));
  fs.appendFileSync("result.txt", JSON.stringify(balance) + "\n");
}
