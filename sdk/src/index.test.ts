import { describe, expect, it, vi } from 'vitest';
import {
  type Account,
  initSpireKey,
  onAccountConnected,
  onTransactionsSigned,
  publishEvent,
} from './index';

describe('SDK', () => {
  describe('initSpireKey', () => {
    it('should init spirekey', () => {
      const sdk = initSpireKey();
      expect(sdk.connect).toBeTruthy();
      expect(sdk.sign).toBeTruthy();
    });
  });
  describe('onAccountConnected', () => {
    it('should fire the event', () => {
      const cb = vi.fn();
      onAccountConnected(cb);
      const account: Account = {
        accountName: 'test',
        alias: 'test',
        minApprovals: 0,
        minRegistrationApprovals: 0,
        balance: '4',
        devices: [],
        networkId: 'mainnet01',
        chainIds: ['0', '18'],
      };
      publishEvent('connected', account);
      vi.waitFor(() => expect(cb).toHaveBeenCalledWith(account), 1000);
    });
  });
  describe('onTransactionsSigned', () => {
    it('should fire the event', () => {
      const cb = vi.fn();
      onTransactionsSigned(cb);
      const sig = { hash: [{ sig: 'something', pubKey: 'pubKey' }] };
      publishEvent('signed', sig);
      vi.waitFor(() => expect(cb).toHaveBeenCalledWith(sig), 1000);
    });
  });
});
