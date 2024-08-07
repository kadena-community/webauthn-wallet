import { atoms } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const container = style([
  atoms({
    padding: 'md',
    position: 'fixed',
  }),
  {
    zIndex: 9999,
  },
]);

export const discordChannel = style({
  whiteSpace: 'nowrap',
});

globalStyle(`${container} button`, {
  flexShrink: 0,
});

globalStyle(`${container} [role="alert"]`, {
  background: 'rgb(105 81 0 / 80%)',
});
