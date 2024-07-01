import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const dashoffset = keyframes({
  '0%': { strokeDashoffset: '0px' },
  '50%': { strokeDashoffset: '-40px' },
  '100%': { strokeDashoffset: '0px' },
});

const finalize = keyframes({
  '0%': {
    stroke: '#16B681',
    strokeDasharray: '10px',
  },
  '100%': {
    stroke: '#4BE9B5',
    strokeDasharray: '50px',
  },
});

export const backgroundLine = style({
  fill: 'none',
  stroke: '#4A9079',
  strokeLinecap: 'round',
});

export const line = style({
  fill: 'none',
  stroke: '#16B681',
  strokeLinecap: 'round',
  strokeMiterlimit: 10,
  strokeDasharray: '10px',
  strokeDashoffset: '0px',
});

export const animating = style({});

export const success = style({});

globalStyle(`${animating} ${line}`, {
  animation: `${dashoffset} 4s forwards infinite`,
});

globalStyle(`${success} ${line}`, {
  animation: `${finalize} 2s forwards`,
});