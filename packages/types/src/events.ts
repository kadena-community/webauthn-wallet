import type { SpireKeyAccount } from './account';

export type SpireKeyEvents = {
  connected: SpireKeyAccount;
  signed: Record<string, { sig: string; pubKey: string }[]>;
  isReady: SpireKeyAccount[];

  'canceled:connect': void;
  'canceled:sign': void;

  'minimize-notification': void;
  'maximize-notification': void;
  'show-notifications-sidebar': void;
};

export type SpireKeyEventName = keyof SpireKeyEvents;

export type SpireKeyCallback<T extends SpireKeyEventName> = <
  K extends SpireKeyEvents[T],
>(
  payload: K,
) => void;

export type SpireKeyEvent = {
  source: 'kadena-spirekey';
  name: SpireKeyEventName;
  payload: SpireKeyEvents[SpireKeyEventName] extends void
    ? never
    : SpireKeyEvents[SpireKeyEventName];
};
