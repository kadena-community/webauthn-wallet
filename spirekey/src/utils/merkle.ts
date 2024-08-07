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
const isMinimalLeft = (index: number) => (currentSize: number) => {
  const currLevel = Math.ceil(Math.log2(index));
  const levelsBefore = Math.floor(Math.log2(index));
  if (levelsBefore === Math.log2(index)) return currentSize <= 1;
  return currentSize <= currLevel;
};
const getLeftLeaves =
  (hash: HashFunction) =>
  (
    isMinSize: (currentSize: number) => boolean,
    proofLeaves: ProofLeaf[],
  ): ProofLeaf[] => {
    const left = constructLeaves(
      proofLeaves.filter((p: ProofLeaf) => p.direction === DIRECTION.LEFT),
    ).flatMap(mapProofLeaf(hash));
    if (isMinSize(left.length)) return left;
    return getLeftLeaves(hash)(isMinSize, left);
  };

const mergeLeaves =
  (hash: HashFunction) =>
  (proofLeaves: ProofLeaf[]): ProofLeaf => {
    const leaves = constructLeaves(proofLeaves).flatMap(mapProofLeaf(hash));
    if (leaves.length > 1) return mergeLeaves(hash)(leaves);
    return leaves[0];
  };

const getLeaves = (level: number, depth: number) => {
  if (depth === 0 || level < depth) return Math.ceil(Math.pow(2, level) / 2);
  return Math.ceil(Math.pow(2, level));
};

const getRightLeaves =
  (hash: HashFunction) =>
  (index: number, treeSize: number, proofLeaves: ProofLeaf[]): ProofLeaf[] => {
    const right = proofLeaves.filter((l) => l.direction === DIRECTION.RIGHT);
    const max = Math.ceil(Math.log2(treeSize));
    const used = index === 0 ? 0 : Math.ceil(Math.log2(index));
    const amountOfNeededSiblings = max - used;
    let leavesCounted = 0;
    const proof = [];
    for (let sibling = 0; sibling <= amountOfNeededSiblings; sibling++) {
      const leaves = getLeaves(sibling, used);
      const siblings = right.slice(leavesCounted, leavesCounted + leaves);
      proof.push(mergeLeaves(hash)(siblings));
      leavesCounted = leavesCounted + leaves;
    }
    return proof.filter(Boolean);
  };
const mapProofLeaf =
  (hash: HashFunction) =>
  ([a, b]: any) => {
    if (a?.isDirectSibling || b?.isDirectSibling) return [a, b].filter(Boolean);
    if (!a) return b;
    if (!b) return a;
    return {
      hash: hash(`${a.hash},${b.hash}`),
      direction: a.direction,
      isDirectSibling: false,
    };
  };
const buildProof =
  (hash: HashFunction) =>
  (index: number, treeSize: number, proofLeaves: ProofLeaf[]) => {
    const left = getLeftLeaves(hash)(isMinimalLeft(index), proofLeaves);
    const right = getRightLeaves(hash)(index, treeSize, proofLeaves);
    return [...left, ...right];
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
      hashes.indexOf(targetHash),
      hashes.length,
      proofLeaves.filter((l) => !!l.hash),
    ).map(({ direction, hash }: ProofLeaf) => ({ direction, hash }));
  };
