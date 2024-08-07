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
const isMinimalRight =
  (index: number, treeSize: number) => (currentSize: number) => {
    console.warn('DEBUGPRINT[36]: merkle.ts:55: index=', index);
    console.warn('DEBUGPRINT[35]: merkle.ts:55: treeSize=', treeSize);
    return currentSize <= Math.log2(treeSize - index);
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

const getRightLeaves =
  (hash: HashFunction) =>
  (index: number, treeSize: number, proofLeaves: ProofLeaf[]): ProofLeaf[] => {
    const right = proofLeaves.filter(
      (p: ProofLeaf) => p.direction === DIRECTION.RIGHT,
    );
    const amountOfNeededSiblings = Math.ceil(Math.log2(treeSize - index));
    console.warn(
      'DEBUGPRINT[38]: merkle.ts:79: amountOfNeededSiblings=',
      amountOfNeededSiblings,
    );

    let leavesCounted = 0;
    const proof = [];
    for (let sibling = 0; sibling < amountOfNeededSiblings; sibling++) {
      const leaves = Math.ceil(Math.pow(2, sibling) / 2);
      const siblings = proofLeaves.slice(leavesCounted, leavesCounted + leaves);
      // recursively map through till 1 hash is left
      const sl = constructLeaves(siblings).flatMap(mapProofLeaf(hash));
      proof.push(sl);
      leavesCounted = leavesCounted + leaves;
    }

    // const right = constructLeaves(
    //   proofLeaves.filter((p: ProofLeaf) => p.direction === DIRECTION.RIGHT),
    // ).flatMap(mapProofLeaf(hash));
    // if (isMinSize(right.length)) return right;
    // return getRightLeaves(hash)(isMinSize, right);
    return proof.flatMap((x) => x);
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
