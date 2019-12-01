import * as fs from "fs";
import * as readline from "readline";

type FuelCalculator = (fuel: number) => number;

interface AsyncStrings {
  [Symbol.asyncIterator](): AsyncIterableIterator<string>;
}

function fuel1(mass: number) {
  return Math.floor(mass / 3) - 2;
}

function fuel2(mass: number): number {
  const fuel = Math.floor(mass / 3) - 2;

  if (fuel < 0) {
    return 0;
  }

  return fuel + fuel2(fuel);
}

function readInputStream(filename: string) {
  const fileStream = fs.createReadStream(filename);

  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
}

async function execute(rl: AsyncStrings, fuelFn: FuelCalculator) {
  let sum = 0;
  for await (const line of rl) {
    sum += fuelFn(parseInt(line));
  }
  return sum;
}

async function main() {
  console.log(await execute(readInputStream("./input.txt"), fuel1));
  console.log(await execute(readInputStream("./input.txt"), fuel2));
}

main();
