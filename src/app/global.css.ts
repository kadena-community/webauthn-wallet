import '@kadena/react-ui/global';
import { vars } from '@kadena/react-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

const developerBackgroundColor = vars.colors.$gray70;
const developerBorderColor = vars.colors.$pink50;

globalStyle('body', {
  backgroundColor: '#081320',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  borderTop: `3px solid transparent`,
  borderBottom: `3px solid transparent`,
});

globalStyle('body.developer', {
  backgroundColor: developerBackgroundColor,
  borderTop: `3px solid ${developerBorderColor}`,
  borderBottom: `3px solid ${developerBorderColor}`,
});
