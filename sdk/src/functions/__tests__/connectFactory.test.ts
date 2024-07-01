import { describe, expect, it, vitest } from 'vitest';

import { EmbedManager } from '../../embed-manager';
import * as styles from '../../styles.css';
import { connect } from '../connectFactory';
import { publishEvent } from '../events';

describe('connectFactory', () => {
  let embedManager = EmbedManager.getInstance('http://localhost:1337');

  it('connects an account', async () => {
    const promise = connect();

    expect(
      embedManager.sidebar.classList.contains(styles.spirekeySidebarOpen),
    ).toBe(true);
    expect(embedManager.sidebar.src).toContain(`/embedded/sidebar`);
    expect(embedManager.sidebar.src).not.toContain(`transaction=`);

    publishEvent('connected', {
      accountName: 'test',
      alias: 'test',
      minApprovals: 0,
      minRegistrationApprovals: 0,
      balance: '4',
      devices: [],
      networkId: 'mainnet01',
      chainIds: ['0', '18'],
    });

    await expect(promise).resolves.toMatchObject({
      accountName: 'test',
      alias: 'test',
      minApprovals: 0,
      minRegistrationApprovals: 0,
      balance: '4',
      devices: [],
      networkId: 'mainnet01',
      chainIds: ['0', '18'],
    });
  });

  it('handles a timeout correctly', async () => {
    vitest.useFakeTimers();
    const promise = connect();

    vitest.advanceTimersByTime(5 * 60 * 1000);

    await expect(promise).rejects.toEqual([
      new Error('Timeout: Connecting took too long'),
    ]);
  });
});