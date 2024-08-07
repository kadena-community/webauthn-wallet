import { atoms, token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const spirekeySidebar = style({
  width: '100%',
  height: '100%',
  position: 'fixed',
  border: 0,
  borderRadius: '1rem',
  right: 0,
  top: 0,
  zIndex: 999998,
  transform: 'translateX(100%)',
  // can't use tokens here, values from: https://github.com/kadena-community/design-system/blob/319723c222395cb4a1a43ed20ba333f39e1c2e49/tokens/foundation/transition.tokens.json#L35
  transition: 'transform 200ms cubic-bezier(0.33, 1, 0.68, 1)',
  background: 'rgba(19, 30, 43, 1)',

  '@media': {
    '(min-width: 992px)': {
      width: '500px',
    },
  },
});

export const spirekeySidebarOpen = style({
  transform: 'translateX(0%)',
});

export const spirekeyNotification = style({
  borderRadius: token('radius.lg'),
  position: 'fixed',
  border: 'none',
  width: '21.5rem',
  height: '3rem',
  right: token('spacing.md'),
  top: token('spacing.md'),
  zIndex: 999999,
  transition:
    'transform 200ms cubic-bezier(0.33, 1, 0.68, 1), right 200ms cubic-bezier(0.33, 1, 0.68, 1)',
  willChange: 'transform, right',
});

export const spirekeyNotificationMinimized = style({
  right: '0',
  transform: 'translateX(18.46rem)',
});

export const spirekeyNotificationHidden = style({
  right: 0,
  transform: 'translateX(100%)',
});
