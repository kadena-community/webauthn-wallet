type HashFunction = (value: string) => string;
export const getRootHashWith =
  (hash: HashFunction) =>
  (hashes: string[]): string => {
    const leaves = constructLeaves(hashes).map(([a, b]: Leaf) => {
      if (!a) return b;
      if (!b) return a;
      return hash(`${a},${b}`);
    });
    if (leaves.length > 1) return getRootHashWith(hash)(leaves);
    return leaves[0];
  };

const fillEmptyLeaves = (hashes: string[]) => {
  const missingLeaves = Array(
    Math.pow(2, Math.ceil(Math.log2(hashes.length))) - hashes.length,
  ).fill('0');
  return [...hashes, ...missingLeaves];
};

type Leaf = string[];
type Leaves = Leaf[];
const constructLeaves = (hashes: string[]): Leaves => {
  const startResult: Leaves = [];
  return hashes.reduce((acc, curr: string, i, leaves) => {
    if (i % 2 !== 0) return acc;
    const leaf: Leaf = [curr, leaves[i + 1]].filter(Boolean);
    return [...acc, leaf];
  }, startResult);
};

export const getMerkleProofWith =
  (hash: HashFunction) =>
  (targetHash: string, hashes: any[]): any => {
    const leaves = constructLeaves(hashes);
    const proofLeaves = leaves.map(([a, b]) => {
      if (Array.isArray(a) || Array.isArray(b)) return [a, b].flatMap((x) => x);
      if (a === targetHash) return [b];
      if (b === targetHash) return [a];
      return hash(`${a},${b}`);
    });

    if (proofLeaves.length > Math.ceil(Math.log2(hashes.length)))
      return getMerkleProofWith(hash)(targetHash, proofLeaves);
    return proofLeaves.flatMap((x) => x);
  };
