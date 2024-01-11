import { style } from '@vanilla-extract/css';
import { tokens } from './contract.css';
export const codeSmallRegular = style({
    fontFamily: tokens.kda.foundation.typography.family.codeFont,
    fontSize: '14px',
    fontWeight: tokens.kda.foundation.typography.weight.monoFont.regular,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const codeSmallBold = style({
    fontFamily: tokens.kda.foundation.typography.family.codeFont,
    fontSize: '14px',
    fontWeight: tokens.kda.foundation.typography.weight.monoFont.bold,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const codeSmallestRegular = style({
    fontFamily: tokens.kda.foundation.typography.family.codeFont,
    fontSize: tokens.kda.foundation.size.n3,
    fontWeight: tokens.kda.foundation.typography.weight.monoFont.regular,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const codeSmallestBold = style({
    fontFamily: tokens.kda.foundation.typography.family.codeFont,
    fontSize: tokens.kda.foundation.size.n3,
    fontWeight: tokens.kda.foundation.typography.weight.monoFont.bold,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const codeBaseRegular = style({
    fontFamily: tokens.kda.foundation.typography.family.codeFont,
    fontSize: tokens.kda.foundation.size.n4,
    fontWeight: tokens.kda.foundation.typography.weight.monoFont.regular,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const codeBaseBold = style({
    fontFamily: tokens.kda.foundation.typography.family.codeFont,
    fontSize: tokens.kda.foundation.size.n4,
    fontWeight: tokens.kda.foundation.typography.weight.monoFont.bold,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const fontH1Regular = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n10,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.regular,
    lineHeight: tokens.kda.foundation.size.n14,
    letterSpacing: '0.125rem',
    '@media': {
        '(width >= 48rem)': {
            fontSize: tokens.kda.foundation.size.n12,
            lineHeight: tokens.kda.foundation.size.n17,
        },
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n15,
            lineHeight: tokens.kda.foundation.size.n20,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n18,
            lineHeight: tokens.kda.foundation.size.n25,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n20,
            lineHeight: tokens.kda.foundation.size.n30,
        },
    },
});
export const fontH1Bold = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n10,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.bold,
    lineHeight: tokens.kda.foundation.size.n14,
    letterSpacing: '0.125rem',
    '@media': {
        '(width >= 48rem)': {
            fontSize: tokens.kda.foundation.size.n12,
            lineHeight: tokens.kda.foundation.size.n17,
        },
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n15,
            lineHeight: tokens.kda.foundation.size.n20,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n18,
            lineHeight: tokens.kda.foundation.size.n25,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n20,
            lineHeight: tokens.kda.foundation.size.n30,
        },
    },
});
export const fontH2Regular = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n9,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.regular,
    lineHeight: tokens.kda.foundation.size.n13,
    letterSpacing: '0.125rem',
    '@media': {
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n11,
            lineHeight: tokens.kda.foundation.size.n16,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n13,
            lineHeight: tokens.kda.foundation.size.n19,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n15,
            lineHeight: tokens.kda.foundation.size.n20,
        },
    },
});
export const fontH2Bold = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n9,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.bold,
    lineHeight: tokens.kda.foundation.size.n13,
    letterSpacing: '0.125rem',
    '@media': {
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n11,
            lineHeight: tokens.kda.foundation.size.n16,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n13,
            lineHeight: tokens.kda.foundation.size.n19,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n15,
            lineHeight: tokens.kda.foundation.size.n20,
        },
    },
});
export const fontH3Regular = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n7,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.regular,
    lineHeight: tokens.kda.foundation.size.n11,
    letterSpacing: '0.125rem',
    '@media': {
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n9,
            lineHeight: tokens.kda.foundation.size.n13,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n10,
            lineHeight: tokens.kda.foundation.size.n15,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n11,
            lineHeight: tokens.kda.foundation.size.n17,
        },
    },
});
export const fontH3Bold = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n7,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.bold,
    lineHeight: tokens.kda.foundation.size.n11,
    letterSpacing: '0.125rem',
    '@media': {
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n9,
            lineHeight: tokens.kda.foundation.size.n13,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n10,
            lineHeight: tokens.kda.foundation.size.n15,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n11,
            lineHeight: tokens.kda.foundation.size.n17,
        },
    },
});
export const fontH4Regular = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n6,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.regular,
    lineHeight: tokens.kda.foundation.size.n9,
    letterSpacing: tokens.kda.foundation.spacing.no,
    '@media': {
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n7,
            lineHeight: tokens.kda.foundation.size.n11,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n8,
            lineHeight: tokens.kda.foundation.size.n12,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n9,
            lineHeight: tokens.kda.foundation.size.n13,
        },
    },
});
export const fontH4Bold = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n6,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.bold,
    lineHeight: tokens.kda.foundation.size.n9,
    letterSpacing: tokens.kda.foundation.spacing.no,
    '@media': {
        '(width >= 64rem)': {
            fontSize: tokens.kda.foundation.size.n7,
            lineHeight: tokens.kda.foundation.size.n11,
        },
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n8,
            lineHeight: tokens.kda.foundation.size.n12,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n9,
            lineHeight: tokens.kda.foundation.size.n13,
        },
    },
});
export const fontH5Regular = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n5,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.regular,
    lineHeight: tokens.kda.foundation.size.n8,
    letterSpacing: tokens.kda.foundation.spacing.no,
    '@media': {
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n6,
            lineHeight: tokens.kda.foundation.size.n9,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n6,
            lineHeight: tokens.kda.foundation.size.n9,
        },
    },
});
export const fontH5Bold = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n5,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.bold,
    lineHeight: tokens.kda.foundation.size.n8,
    letterSpacing: tokens.kda.foundation.spacing.no,
    '@media': {
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n6,
            lineHeight: tokens.kda.foundation.size.n9,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n6,
            lineHeight: tokens.kda.foundation.size.n9,
        },
    },
});
export const fontH6Regular = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n4,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.regular,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
    '@media': {
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n5,
            lineHeight: tokens.kda.foundation.size.n7,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n5,
            lineHeight: tokens.kda.foundation.size.n7,
        },
    },
});
export const fontH6Bold = style({
    fontFamily: tokens.kda.foundation.typography.family.headingFont,
    fontSize: tokens.kda.foundation.size.n4,
    fontWeight: tokens.kda.foundation.typography.weight.headingFont.bold,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
    '@media': {
        '(width >= 80rem)': {
            fontSize: tokens.kda.foundation.size.n5,
            lineHeight: tokens.kda.foundation.size.n7,
        },
        '(width >= 96rem)': {
            fontSize: tokens.kda.foundation.size.n5,
            lineHeight: tokens.kda.foundation.size.n7,
        },
    },
});
export const bodySmallRegular = style({
    fontFamily: tokens.kda.foundation.typography.family.bodyFont,
    fontSize: '14px',
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.regular,
    lineHeight: tokens.kda.foundation.size.n4,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const bodySmallBold = style({
    fontFamily: tokens.kda.foundation.typography.family.bodyFont,
    fontSize: '14px',
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.bold,
    lineHeight: tokens.kda.foundation.size.n4,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const bodySmallestRegular = style({
    fontFamily: tokens.kda.foundation.typography.family.bodyFont,
    fontSize: tokens.kda.foundation.size.n3,
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.regular,
    lineHeight: tokens.kda.foundation.size.n4,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const bodySmallestBold = style({
    fontFamily: tokens.kda.foundation.typography.family.bodyFont,
    fontSize: tokens.kda.foundation.size.n3,
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.bold,
    lineHeight: tokens.kda.foundation.size.n4,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const bodyBaseRegular = style({
    fontFamily: tokens.kda.foundation.typography.family.bodyFont,
    fontSize: tokens.kda.foundation.size.n4,
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.regular,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
export const bodyBaseBold = style({
    fontFamily: tokens.kda.foundation.typography.family.bodyFont,
    fontSize: tokens.kda.foundation.size.n4,
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.bold,
    lineHeight: tokens.kda.foundation.size.n6,
    letterSpacing: tokens.kda.foundation.spacing.no,
});
//# sourceMappingURL=styles.css.js.map