export function generatePlayer(name: string) {
  return {
    name,
    score: 0,
    spicyBetBalance: 3
  };
}

export function getDiff(a: number, b: number) {
  return Math.abs(a - b);
}