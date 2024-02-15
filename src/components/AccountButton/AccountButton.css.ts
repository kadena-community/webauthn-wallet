import { customTokens } from '@/styles/tokens.css';
import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const button = style([
  atoms({
    position: 'relative',
    borderRadius: 'sm',
    textDecoration: 'none',
    textAlign: 'center',
  }),
  {
    background: 'rgba(147, 147, 147, 0.1)',
    backdropFilter: 'blur(18px)',
    selectors: {
      '&:before': {
        pointerEvents: 'none',
        content: '',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: '1px',
        border: '1px solid transparent',
        background:
          'linear-gradient(-45deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25)) border-box',
        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        maskComposite: 'xor, exclude',
      },
    },
  },
]);

export const buttonContent = style([
  atoms({
    borderRadius: 'sm',
  }),
  {
    background: 'rgba(255, 255, 255, 0.2)',
  },
]);

export const iconContainer = style([
  atoms({
    paddingBlock: 'sm',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    borderTopLeftRadius: tokens.kda.foundation.radius.sm,
    borderTopRightRadius: tokens.kda.foundation.radius.sm,
    background: 'rgba(255, 255, 255, 0.3)',
    color: customTokens.color.white,
  },
]);

export const title = style([
  atoms({
    marginInline: 'sm',
  }),
  {
    color: customTokens.color.white,
    fontWeight: 'bold',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
]);

export const description = style([
  atoms({
    marginInline: 'sm',
  }),
  {
    color: customTokens.color.white,
    opacity: 0.6,
    fontSize: '0.75rem',
    lineHeight: '1.5',
  },
]);