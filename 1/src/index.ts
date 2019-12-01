import * as fs from "fs";
import * as readline from "readline";
import { Readable } from "stream";
import { map } from "axax/esnext/map";
import { reduce } from "axax/esnext/reduce";
import { pipe } from "axax/esnext/pipe";

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
  const sum = reduce(
    (accumulator: number, next: number) => accumulator + next,
    0
  );
  const mapFuel = map((value: string) => fuelFn(parseInt(value)));

  return pipe(mapFuel, sum)(rl);
}

async function main() {
  console.log(await execute(readInputStream("./input.txt"), fuel1));
  console.log(await execute(readInputStream("./input.txt"), fuel2));
}

main();
