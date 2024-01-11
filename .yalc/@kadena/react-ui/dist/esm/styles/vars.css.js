import { colorPalette, gradients, hexToRgba } from './colors';
import { createGlobalTheme, createTheme, createThemeContract, } from '@vanilla-extract/css';
import { tokens } from './tokens/contract.css';
import { darkThemeValues } from './tokens/dark.css';
import { lightThemeValues } from './tokens/light.css';
export const primaryFont = lightThemeValues.kda.foundation.typography.family.primaryFont;
const oldThemeValues = {
    fonts: {
        $main: `${primaryFont}, -apple-system, sans-serif`,
        $mono: "'Kode Mono', Menlo, monospace",
    },
    fontSizes: {
        $xs: '0.75rem',
        $sm: '0.875rem',
        $base: '1rem',
        $md: '1.123rem',
        $lg: '1.25rem',
        $xl: '1.5rem',
        $2xl: '1.75rem',
        $3xl: '2rem',
        $4xl: '2.25rem',
        $5xl: '2.5rem',
        $6xl: '2.75rem',
        $7xl: '3rem',
        $8xl: '3.25rem',
        $9xl: '3.75rem',
        $10xl: '4.5rem',
        $11xl: '5rem',
        $12xl: '5.25rem',
    },
    lineHeights: {
        $initial: 'initial',
        $normal: 'normal',
        $base: '1.4',
        $lg: '1.9',
    },
    fontWeights: {
        $light: '300',
        $normal: '400',
        $medium: '500',
        $semiBold: '600',
        $bold: '700',
    },
    radii: {
        0: '0',
        $xs: '2px',
        $sm: '4px',
        $md: '6px',
        $lg: '8px',
        $round: '999rem',
    },
    borderWidths: {
        $sm: '1px',
        $md: '2px',
    },
    shadows: {
        $1: `0px 1px 2px 0 ${colorPalette.$gray90}`,
    },
    sizes: {
        0: '0',
        $0: '0.125rem',
        $1: '0.25rem',
        $2: '0.5rem',
        $3: '0.75rem',
        $4: '1rem',
        $5: '1.25rem',
        $6: '1.5rem',
        $7: '1.75rem',
        $8: '2rem',
        $9: '2.25rem',
        $10: '2.5rem',
        $11: '2.75rem',
        $12: '3rem',
        $13: '3.25rem',
        $14: '3.5rem',
        $15: '3.75rem',
        $16: '4rem',
        $17: '4.25rem',
        $18: '4.5rem',
        $19: '4.75rem',
        $20: '5rem',
        $24: '6rem',
        $25: '6.25rem',
        $32: '8rem',
        $35: '8.75rem',
        $40: '10rem',
        $48: '12rem',
        $56: '14rem',
        $64: '16rem',
        $2xs: 'var(--spacing-2xs)',
        $xs: 'var(--spacing-xs)',
        $sm: 'var(--spacing-sm)',
        $md: 'var(--spacing-md)',
        $lg: 'var(--spacing-lg)',
        $xl: 'var(--spacing-xl)',
        $2xl: 'var(--spacing-2xl)',
        $3xl: 'var(--spacing-3xl)',
    },
    contentWidth: {
        $maxContentWidth: '42.5rem',
    },
    colors: {
        ...colorPalette,
        ...gradients,
        $primarySurface: colorPalette.$blue80,
        $primaryContrast: colorPalette.$blue20,
        $primaryLowContrast: colorPalette.$blue10,
        $primaryHighContrast: colorPalette.$blue100,
        $primaryAccent: colorPalette.$blue60,
        $primarySurfaceInverted: colorPalette.$blue40,
        $primaryContrastInverted: colorPalette.$blue80,
        $secondarySurface: colorPalette.$pink80,
        $secondaryContrast: colorPalette.$pink20,
        $secondaryLowContrast: colorPalette.$pink10,
        $secondaryHighContrast: colorPalette.$pink100,
        $secondaryAccent: colorPalette.$pink60,
        $secondarySurfaceInverted: colorPalette.$pink40,
        $secondaryContrastInverted: colorPalette.$pink80,
        $tertiarySurface: colorPalette.$purple80,
        $tertiaryContrast: colorPalette.$purple20,
        $tertiaryLowContrast: colorPalette.$purple10,
        $tertiaryHighContrast: colorPalette.$purple100,
        $tertiaryAccent: colorPalette.$purple60,
        $tertiarySurfaceInverted: colorPalette.$purple40,
        $tertiaryContrastInverted: colorPalette.$purple80,
        $borderDefault: hexToRgba(colorPalette.$gray50, 0.2),
        $borderSubtle: hexToRgba(colorPalette.$gray40, 0.4),
        $borderContrast: colorPalette.$gray40,
        $layoutSurfaceDefault: colorPalette.$gray10,
        $layoutSurfaceSubtle: colorPalette.$gray20,
        $layoutSurfaceCard: hexToRgba(colorPalette.$gray20, 0.6),
        $layoutSurfaceContrast: colorPalette.$white,
        $layoutSurfaceOverlay: hexToRgba(colorPalette.$gray90, 0.6),
        $infoSurface: colorPalette.$blue80,
        $infoContrast: colorPalette.$blue20,
        $infoLowContrast: colorPalette.$blue10,
        $infoHighContrast: colorPalette.$blue100,
        $infoAccent: colorPalette.$blue60,
        $infoSurfaceInverted: colorPalette.$blue40,
        $infoContrastInverted: colorPalette.$blue80,
        $warningSurface: colorPalette.$yellow80,
        $warningContrast: colorPalette.$yellow20,
        $warningLowContrast: colorPalette.$yellow10,
        $warningHighContrast: colorPalette.$yellow100,
        $warningAccent: colorPalette.$yellow60,
        $warningSurfaceInverted: colorPalette.$yellow40,
        $warningContrastInverted: colorPalette.$yellow80,
        $negativeSurface: colorPalette.$red80,
        $negativeContrast: colorPalette.$red20,
        $negativeLowContrast: colorPalette.$red10,
        $negativeHighContrast: colorPalette.$red100,
        $negativeAccent: colorPalette.$red60,
        $negativeSurfaceInverted: colorPalette.$red40,
        $negativeContrastInverted: colorPalette.$red80,
        $positiveSurface: colorPalette.$green80,
        $positiveContrast: colorPalette.$green20,
        $positiveLowContrast: colorPalette.$green10,
        $positiveHighContrast: colorPalette.$green100,
        $positiveAccent: colorPalette.$green60,
        $positiveSurfaceInverted: colorPalette.$green40,
        $positiveContrastInverted: colorPalette.$green80,
        $disabledContrast: hexToRgba(colorPalette.$gray40, 0.6),
        $background: colorPalette.$gray10,
        $foreground: colorPalette.$gray100,
        $neutral1: colorPalette.$gray10,
        $neutral2: colorPalette.$gray20,
        $neutral3: colorPalette.$gray40,
        $neutral4: colorPalette.$gray60,
        $neutral5: colorPalette.$gray90,
        $neutral6: colorPalette.$gray100,
    },
};
export const vars = createThemeContract(oldThemeValues);
const lightContract = {
    ...vars,
    ...tokens,
};
createGlobalTheme(':root', lightContract, {
    ...oldThemeValues,
    ...lightThemeValues,
});
const oldDarkThemeColors = {
    ...colorPalette,
    ...gradients,
    $primarySurface: colorPalette.$blue40,
    $primaryContrast: colorPalette.$blue80,
    $primaryLowContrast: colorPalette.$blue100,
    $primaryHighContrast: colorPalette.$blue20,
    $primaryAccent: colorPalette.$blue60,
    $primarySurfaceInverted: hexToRgba(colorPalette.$blue80, 0.8),
    $primaryContrastInverted: colorPalette.$blue40,
    $secondarySurface: colorPalette.$pink40,
    $secondaryContrast: colorPalette.$pink80,
    $secondaryLowContrast: colorPalette.$pink100,
    $secondaryHighContrast: colorPalette.$pink20,
    $secondaryAccent: colorPalette.$pink60,
    $secondarySurfaceInverted: hexToRgba(colorPalette.$pink80, 0.8),
    $secondaryContrastInverted: colorPalette.$pink40,
    $tertiarySurface: colorPalette.$purple40,
    $tertiaryContrast: colorPalette.$purple80,
    $tertiaryLowContrast: colorPalette.$purple100,
    $tertiaryHighContrast: colorPalette.$purple20,
    $tertiaryAccent: colorPalette.$purple60,
    $tertiarySurfaceInverted: hexToRgba(colorPalette.$purple80, 0.8),
    $tertiaryContrastInverted: colorPalette.$purple40,
    $borderDefault: hexToRgba(colorPalette.$gray20, 0.2),
    $borderSubtle: hexToRgba(colorPalette.$gray10, 0.2),
    $borderContrast: colorPalette.$gray40,
    $layoutSurfaceDefault: colorPalette.$gray100,
    $layoutSurfaceSubtle: colorPalette.$gray90,
    $layoutSurfaceCard: hexToRgba(colorPalette.$gray60, 0.4),
    $layoutSurfaceContrast: colorPalette.$black,
    $layoutSurfaceOverlay: hexToRgba(colorPalette.$gray10, 0.8),
    $infoSurface: hexToRgba(colorPalette.$blue40, 0.8),
    $infoContrast: colorPalette.$blue80,
    $infoLowContrast: colorPalette.$blue100,
    $infoHighContrast: colorPalette.$blue20,
    $infoAccent: colorPalette.$blue60,
    $infoSurfaceInverted: hexToRgba(colorPalette.$blue80, 0.8),
    $infoContrastInverted: colorPalette.$blue40,
    $warningSurface: hexToRgba(colorPalette.$yellow40, 0.8),
    $warningContrast: colorPalette.$yellow80,
    $warningLowContrast: colorPalette.$yellow100,
    $warningHighContrast: colorPalette.$yellow20,
    $warningAccent: colorPalette.$yellow60,
    $warningSurfaceInverted: hexToRgba(colorPalette.$yellow80, 0.8),
    $warningContrastInverted: colorPalette.$yellow40,
    $negativeSurface: hexToRgba(colorPalette.$red40, 0.8),
    $negativeContrast: colorPalette.$red80,
    $negativeLowContrast: colorPalette.$red100,
    $negativeHighContrast: colorPalette.$red20,
    $negativeAccent: colorPalette.$red60,
    $negativeSurfaceInverted: hexToRgba(colorPalette.$red80, 0.8),
    $negativeContrastInverted: colorPalette.$red40,
    $positiveSurface: hexToRgba(colorPalette.$green40, 0.8),
    $positiveContrast: colorPalette.$green80,
    $positiveLowContrast: colorPalette.$green100,
    $positiveHighContrast: colorPalette.$green20,
    $positiveAccent: colorPalette.$green60,
    $positiveSurfaceInverted: hexToRgba(colorPalette.$green80, 0.8),
    $positiveContrastInverted: colorPalette.$green40,
    $disabledContrast: hexToRgba(colorPalette.$gray40, 0.6),
    $background: colorPalette.$gray100,
    $foreground: colorPalette.$gray10,
    $neutral1: colorPalette.$gray100,
    $neutral2: colorPalette.$gray90,
    $neutral3: colorPalette.$gray60,
    $neutral4: colorPalette.$gray40,
    $neutral5: colorPalette.$gray20,
    $neutral6: colorPalette.$gray10,
};
const darkContract = {
    new: tokens.kda.foundation.color,
    old: vars.colors,
};
export const darkThemeClass = createTheme(darkContract, {
    new: darkThemeValues.kda.foundation.color,
    old: oldDarkThemeColors,
}, 'dark');
//# sourceMappingURL=vars.css.js.map