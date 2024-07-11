import type { SpireKeyAccount } from './account';

export type SpireKeyEvents = {
  connected: SpireKeyAccount;
  'connected:minted': SpireKeyAccount;
  signed: Record<string, { sig: string; pubKey: string }[]>;
  'signed:submittable': Record<string, { sig: string; pubKey: string }[]>;
  'minimize-notification': void;
  'maximize-notification': void;
  'show-notifications-sidebar': void;
  'canceled:connect': void;
  'canceled:sign': void;
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
