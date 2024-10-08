import { keyframes, style } from '@vanilla-extract/css';

export const wrapperClass = style({});
export const createClass = style({
  transition: 'opacity .2s ease',
  selectors: {
    '&:hover:not([data-isDisabled="true"])': {
      cursor: 'pointer',
      opacity: '.2',
    },
    '&[data-isDisabled="true"]': {
      opacity: '.2',
      cursor: 'not-allowed',
    },
  },
});
export const importClass = style({
  transition: 'opacity .2s ease',
  selectors: {
    '&:hover:not([data-isDisabled="true"])': {
      cursor: 'pointer',
      opacity: '.2',
    },
    '&[data-isDisabled="true"]': {
      opacity: '.2',
      cursor: 'not-allowed',
    },
  },
});

const blinkAnimation = keyframes({
  '0%': {
    opacity: '.2',
  },
  '50%': {
    opacity: '1',
  },
  '100%': {
    opacity: '.2',
  },
});

export const childWrapperClass = style({});

export const walletIconClass = style({
  selectors: {
    '&[data-import-animated="true"]': {
      animation: `${blinkAnimation} 4s linear 0s normal`,
      animationIterationCount: 'infinite',
    },
  },
});

export const cardCreateClass = style({
  opacity: 0,
  transform: 'translateY(15px)',
  transition: 'all 2s ease',
  selectors: {
    '&[data-animated="true"]': {
      opacity: 1,
      transform: 'translateY(65px)',
    },
  },
});

export const cardImportClass = style({
  opacity: 0,
  transform: 'translateY(-50px)',
  transition: 'all 2s ease',
  selectors: {
    '&[data-animated="true"]': {
      opacity: 1,
      transform: 'translateY(0px)',
    },
  },
});
