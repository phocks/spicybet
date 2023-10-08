export function generatePlayer(name: string) {
  return {
    name,
    score: 0,
    spicyBetBalance: 3,
  };
}

export function getDiff(a: number, b: number) {
  return Math.abs(a - b);
}

// export a function that gives a random integer between 0 and 1
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
