import { getMerkleProofWith, getRootHashWith } from '@/utils/merkle';
import { describe, expect, it } from 'vitest';

describe('Merkle', () => {
  const hashMock = (value: string) => `H(${value})`;
  const getRootHash = getRootHashWith(hashMock);
  const getMerkleProof = getMerkleProofWith(hashMock);
  describe('When getting a merkle root hash', () => {
    describe('And we have 4 entries', () => {
      it('should get the hash based on `H(H(A,B),H(C,D))`', () => {
        const hashes = ['A', 'B', 'C', 'D'];
        expect(getRootHash(hashes)).toEqual('H(H(A,B),H(C,D))');
      });
    });
    describe('And we have 3 entries', () => {
      it('should get the hash based on `H(H(A,B),C)`', () => {
        const hashes = ['A', 'B', 'C'];
        expect(getRootHash(hashes)).toEqual('H(H(A,B),C)');
      });
    });
    describe('And we have 5 entries', () => {
      it('should get the hash based on `H(H(H(A,B),H(C,D)),E)`', () => {
        const hashes = ['A', 'B', 'C', 'D', 'E'];
        expect(getRootHash(hashes)).toEqual('H(H(H(A,B),H(C,D)),E)');
      });
    });
  });
  describe('When getting the merkle proof', () => {
    describe('And we have 4 entries', () => {
      describe('And we want to have the proof for A', () => {
        it('should get [ [{ hash: B, direction: 1 }], [{ hash: H(C,D), direction: 1 }] ]', () => {
          const hashes = ['A', 'B', 'C', 'D'];
          expect(getMerkleProof('A', hashes)).toEqual([
            { hash: 'B', direction: 1 },
            { hash: 'H(C,D)', direction: 1 },
          ]);
        });
      });
      describe('And we want to have the proof for B', () => {
        it('should get [A, H(C,D)]', () => {
          const hashes = ['A', 'B', 'C', 'D'];
          expect(getMerkleProof('B', hashes)).toEqual([
            { hash: 'A', direction: 0 },
            { hash: 'H(C,D)', direction: 1 },
          ]);
        });
      });
      describe('And we want to have the proof for C', () => {
        it('should get [H(A,B), D]', () => {
          const hashes = ['A', 'B', 'C', 'D'];
          expect(getMerkleProof('C', hashes)).toEqual([
            { hash: 'H(A,B)', direction: 0 },
            { hash: 'D', direction: 1 },
          ]);
        });
      });
      describe('And we want to have the proof for D', () => {
        it('should get [H(A,B), C]', () => {
          const hashes = ['A', 'B', 'C', 'D'];
          expect(getMerkleProof('D', hashes)).toEqual([
            { hash: 'H(A,B)', direction: 0 },
            { hash: 'C', direction: 0 },
          ]);
        });
      });
    });
    describe('And we have 5 entries', () => {
      describe('And we want to have the proof for A', () => {
        it('should get [B, H(C,D), E]', () => {
          const hashes = ['A', 'B', 'C', 'D', 'E'];
          expect(getMerkleProof('A', hashes)).toEqual([
            { hash: 'B', direction: 1 },
            { hash: 'H(C,D)', direction: 1 },
            { hash: 'E', direction: 1 },
          ]);
        });
      });
      describe('And we want to have the proof for E', () => {
        it('should get [H(H(A,B),H(C,D)), 0, H(0,0)]', () => {
          const hashes = ['A', 'B', 'C', 'D', 'E'];
          expect(getMerkleProof('E', hashes)).toEqual([
            { hash: 'H(H(A,B),H(C,D))', direction: 0 },
          ]);
        });
      });
    });
    describe('And we have 6 entries', () => {
      it('should get [H(H(A,B),H(C,D)), 0, H(0,0)]', () => {
        const hashes = ['A', 'B', 'C', 'D', 'E', 'F'];
        expect(getMerkleProof('E', hashes)).toEqual([
          { hash: 'H(H(A,B),H(C,D))', direction: 0 },
          { hash: 'F', direction: 1 },
        ]);
      });
    });
    describe('And we have 9 entries', () => {
      it('should get the 4 leaves', () => {
        const hashes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        expect(getMerkleProof('E', hashes)).toEqual([
          { hash: 'H(H(A,B),H(C,D))', direction: 0 },
          { hash: 'F', direction: 1 },
          { hash: 'H(G,H)', direction: 1 },
          { hash: 'I', direction: 1 },
        ]);
      });
      it('should get the 3 leaves', () => {
        // [      'ABCD',         'EF',     'H',  'I'];
        // [  'AB',     'CD',     'EF',     'GH', 'I'];
        // ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const hashes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        expect(getMerkleProof('G', hashes)).toEqual([
          { hash: 'H(H(A,B),H(C,D))', direction: 0 },
          { hash: 'H(E,F)', direction: 0 },
          { hash: 'H', direction: 1 },
          { hash: 'I', direction: 1 },
        ]);
      });
    });
    describe('And we have 17 entries', () => {
      const hashes = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'l',
        'M',
        'N',
        'O',
        'P',
        'Q',
      ];
      it('should get the 6 leaves', () => {
        expect(hashes.length).toEqual(17);
        expect(getMerkleProof('E', hashes)).toEqual([
          { hash: 'H(H(A,B),H(C,D))', direction: 0 },
          { hash: 'F', direction: 1 },
          { hash: 'H(G,H)', direction: 1 },
          { hash: 'H(H(H(I,J),H(K,l)),H(H(M,N),H(O,P)))', direction: 1 },
          { hash: 'Q', direction: 1 },
        ]);
      });
      it('should get the 5 leaves', () => {
        // H(H(H(H(A,B),H(C,D)),H(H(E,F),H(G,H))),H(H(H(I,J),H(K,l)),H(H(M,N),H(O,P))))    Q
        // H(H(H(A,B),H(C,D)),H(H(E,F),H(G,H)))    H(H(H(I,J),H(K,l)),H(H(M,N),H(O,P)))    Q
        // H(H(A,B),H(C,D))   H(H(E,F),H(G,H))       H(H(I,J),H(K,l))  H(H(M,N),H(O,P))    Q
        // H(A,B)   H(C,D)    H(E,F)   H(G,H)        H(I,J)   H(K,l)     H(M,N)  H(O,P)    Q
        // A   B    C    D    E    F   G    H        I    J   K    L     M    N   O   P    Q
        expect(hashes.length).toEqual(17);
        expect(getMerkleProof('A', hashes)).toEqual([
          { hash: 'B', direction: 1 },
          { hash: 'H(C,D)', direction: 1 },
          { hash: 'H(H(E,F),H(G,H))', direction: 1 },
          { hash: 'H(H(H(I,J),H(K,l)),H(H(M,N),H(O,P)))', direction: 1 },
          { hash: 'Q', direction: 1 },
        ]);
      });
      it('should get the 1 leaf', () => {
        expect(hashes.length).toEqual(17);
        expect(getMerkleProof('Q', hashes)).toEqual([
          {
            hash: 'H(H(H(H(A,B),H(C,D)),H(H(E,F),H(G,H))),H(H(H(I,J),H(K,l)),H(H(M,N),H(O,P))))',
            direction: 0,
          },
        ]);
      });
    });
  });
});
