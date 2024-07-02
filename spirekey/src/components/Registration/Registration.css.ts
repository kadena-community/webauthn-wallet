import { breakpoints, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const card = style({
  '@media': {
    [breakpoints.md]: {
      marginTop: '-9em',
      marginBottom: '3em',
    },
  },
});

export const buttons = style({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: tokens.kda.foundation.spacing.n6,
  paddingInline: tokens.kda.foundation.spacing.n4,

  '@media': {
    [breakpoints.md]: {
      justifyContent: 'flex-end',
      rowGap: tokens.kda.foundation.spacing.n4,
      columnGap: tokens.kda.foundation.spacing.n6,
      paddingInline: 0,
    },
  },
});
