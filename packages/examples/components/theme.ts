/* eslint-disable import/no-extraneous-dependencies */
import { makeStyleTheme } from 'jss-style-helpers'

export const fontSizeInit = '16px'

export const fontSizeBase = '1rem'
export const fontSizeSmall = '.875rem'
export const fontSizeBig = '1.4rem'
export const fontSizeEmph = '1.2rem'
export const fontSizeH1 = '2.5rem'
export const fontSizeH2 = '2rem'

export const colorWhite = '#fff'
export const colorLight = '#eee'
export const colorDark = '#222'
export const colorRed = 'tomato'
export const colorGray = '#677'
export const colorFontLight = colorLight
export const colorFontDark = colorDark

export const breakpointLarge = '1200px'
export const breakpointMedium = '920px'
export const breakpointSmall = '640px'

export const lineHight = 1.4

export const themeConfig = {
	spacing: ['0', '.25rem', '.5rem', '1rem', '2rem', '4rem'],
	fontSizes: {
		init: fontSizeInit,
		base: fontSizeBase,
		small: fontSizeSmall,
		emph: fontSizeEmph,
		big: fontSizeBig,
		h1: fontSizeH1,
		h2: fontSizeH2,
		h3: fontSizeBig,
		h4: fontSizeEmph,
		h5: fontSizeBase,
		h6: fontSizeSmall,
	},
	colors: {
		dark: colorDark,
		light: colorLight,
		fontLight: colorFontLight,
		fontDark: colorFontDark,
		white: colorWhite,
		gray: colorGray,
		red: colorRed,
	},
	borders: { basic: 'solid .125rem' },
	breakpoints: Object.assign(
		[breakpointSmall, breakpointMedium, breakpointLarge],
		{
			small: breakpointSmall,
			medium: breakpointMedium,
			large: breakpointLarge,
		},
	),
	radii: { pill: '9999px' },
	textStyles: {
		active: {
			fontSize: fontSizeBig,
			textTransform: 'uppercase',
		},
	},
}

const { theme, makeStyles } = makeStyleTheme(themeConfig)

export type Theme = typeof theme
export { theme, makeStyles }
