import { tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const wrapper = recipe({
  base: {
    height: '100%',
    width: '100%',
  },
  variants: {
    variant: {
      collapsed: {
        overflow: 'hidden',
      },
      expanded: {
        overflow: 'scroll',
      },
    },
  },
  defaultVariants: {
    variant: 'collapsed',
  },
});

export const inner = style({
  position: 'relative',
  height: '100%',
  width: '100%',
});

export const card = recipe({
  base: {
    width: '100%',
    bottom: 'auto',
    position: 'relative',
  },
  variants: {
    variant: {
      active: {
        order: '-1',
      },
      collapsed: {
        position: 'absolute',
      },
      expanded: {
        position: 'relative',
        marginBlockEnd: tokens.kda.foundation.spacing.lg,
      },
    },
  },
});
