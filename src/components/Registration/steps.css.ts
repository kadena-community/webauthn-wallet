import { customTokens } from '@/styles/tokens.css';
import { globalStyle, style } from '@vanilla-extract/css';

export const descriptionEmphasis = style({
  color: customTokens.color.accent,
  fontWeight: '700',
});

export const itemContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
});

globalStyle(`${itemContainer} input`, {
  display: 'none',
});

export const item = style({
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
});

globalStyle(`input:checked + ${item}`, {
  color: customTokens.color.accent,
});
