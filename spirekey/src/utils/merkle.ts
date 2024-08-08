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
const getStartingLeaf = (subjectIndex: number, leaves: Leaf[][]) => {
  const leafIndex = Math.floor(subjectIndex / 2);
  const subjectSiblingIndex = (subjectIndex + 1) % 2;
  const siblingHash = leaves[leafIndex][subjectSiblingIndex];
  return {
    hash: siblingHash,
    direction: subjectSiblingIndex,
  };
};
const mergeProof =
  (hash: HashFunction) =>
  (leaves: Leaf[]): string => {
    const proof: Leaf = leaves
      .flatMap(([a, b]) => {
        if (!a) return b;
        if (!b) return a;
        return hash(`${a},${b}`);
      })
      .filter(Boolean);
    if (proof.length > 1) return mergeProof(hash)(constructLeaves(proof));
    return proof[0];
  };
const getLeafDirection = (
  subjectIndex: number,
  initialConsideredLeafSize: number,
  currentLeafSize: number,
) => {
  if (currentLeafSize == initialConsideredLeafSize) return DIRECTION.LEFT;
  if (currentLeafSize / 2 > subjectIndex - initialConsideredLeafSize / 2)
    return DIRECTION.RIGHT;
  return DIRECTION.LEFT;
};
const getProofIndex = (
  subjectIndex: number,
  depth: number,
  direction: DIRECTION,
) => {
  const necesaryLeaves = Math.ceil(Math.pow(2, depth + 1) / 2);
  if (
    direction === DIRECTION.LEFT &&
    necesaryLeaves >= Math.ceil(subjectIndex / 2)
  )
    return 0;
  if (direction === DIRECTION.LEFT)
    return Math.max(0, Math.ceil(subjectIndex / 2) - necesaryLeaves / 2);
  if (necesaryLeaves > subjectIndex) return necesaryLeaves / 2;
  return Math.ceil(subjectIndex / 2) + necesaryLeaves / 2;
};
export const getMerkleProofWith =
  (hash: HashFunction) =>
  (subject: string, hashes: any[]): any => {
    const leaves = constructLeaves(hashes);
    const subjectIndex = hashes.indexOf(subject);
    if (subjectIndex < 0) throw new Error('Subject not found');

    const maxProofLength = Math.ceil(Math.log2(hashes.length));
    const initialConsideredLeaves = Math.pow(
      2,
      Math.ceil(Math.log2(subjectIndex + 1)),
    );
    const proof = Array(maxProofLength).fill(0);
    return proof
      .map((_, i) => {
        if (i === 0) return getStartingLeaf(subjectIndex, leaves);
        const currentLeafSize = Math.pow(2, i + 1);
        const leafDirection = getLeafDirection(
          subjectIndex,
          initialConsideredLeaves,
          currentLeafSize,
        );
        const currentProofLeaves = currentLeafSize / 2 / 2;
        const lastProvenIndex = getProofIndex(subjectIndex, i, leafDirection);

        const proofHashes = leaves.slice(
          lastProvenIndex,
          lastProvenIndex + currentProofLeaves,
        );
        return {
          hash: mergeProof(hash)(proofHashes),
          direction: leafDirection,
        };
      })
      .filter((x) => x.hash);
  };
