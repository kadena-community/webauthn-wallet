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

type Leaf = string[];
const constructLeaves = <T>(hashes: T[]) => {
  const startResult: T[][] = [];
  return hashes.reduce((acc, curr, i, leaves) => {
    if (i % 2 !== 0) return acc;
    const leaf: T[] = [curr, leaves[i + 1]].filter(Boolean);
    return [...acc, leaf];
  }, startResult);
};

enum DIRECTION {
  LEFT = 0,
  RIGHT = 1,
}
type ProofLeaf = {
  hash: string;
  direction: DIRECTION;
  isDirectSibling: boolean;
};
const createProofLeafWith =
  (hash: HashFunction) =>
  (subject: string, [a, b]: Leaf, direction: DIRECTION) => {
    if (a === subject)
      return { hash: b, direction: DIRECTION.RIGHT, isDirectSibling: true };
    if (b === subject)
      return { hash: a, direction: DIRECTION.LEFT, isDirectSibling: true };
    if (!a) return { hash: b, direction, isDirectSibling: false };
    if (!b) return { hash: a, direction, isDirectSibling: false };
    return { hash: hash(`${a},${b}`), direction, isDirectSibling: false };
  };
type MerkleProofAccumulator = {
  currentDirection: DIRECTION;
  proofLeaves: ProofLeaf[];
};
const buildProof =
  (hash: HashFunction) => (hashes: string[], proofLeaves: ProofLeaf[]) => {
    Math.floor(Math.log2(hashes.length));
    console.warn(
      'DEBUGPRINT[4]: merkle.ts:50: Math.floor(Math.log2(hashes.length))=',
      hashes.length,
      Math.floor(Math.log2(hashes.length)),
    );
    return constructLeaves(proofLeaves).flatMap(([a, b]) => {
      if (a?.isDirectSibling || b?.isDirectSibling)
        return [a, b].filter(Boolean);
      if (!a) return b;
      if (!b) return a;
      return { hash: hash(`${a.hash},${b.hash}`), direction: a.direction };
    });
  };
export const getMerkleProofWith =
  (hash: HashFunction) =>
  (targetHash: string, hashes: any[]): any => {
    const leaves = constructLeaves(hashes);
    const creatProofLeaf = createProofLeafWith(hash);
    const { proofLeaves }: MerkleProofAccumulator = leaves.reduce(
      ({ currentDirection, proofLeaves }: MerkleProofAccumulator, leaf) => {
        const newProofLeaf = creatProofLeaf(targetHash, leaf, currentDirection);
        return {
          proofLeaves: [...proofLeaves, newProofLeaf],
          currentDirection: newProofLeaf.isDirectSibling
            ? DIRECTION.RIGHT
            : newProofLeaf.direction,
        };
      },
      {
        currentDirection: DIRECTION.LEFT,
        proofLeaves: [],
      },
    );
    return buildProof(hash)(
      hashes,
      proofLeaves.filter((l) => !!l.hash),
    ).map(({ direction, hash }) => ({ direction, hash }));
  };
