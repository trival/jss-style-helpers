// import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line import/no-extraneous-dependencies
import * as JSS from 'jss'
import { createUseStyles } from 'react-jss'
import * as CSS from './cssTypes'

type StyleValue = number | string

export type ScaleObject = Record<StyleValue, StyleValue> | StyleValue[]

interface ThemeConfig<BreakPoints extends ScaleObject = ScaleObject> {
	spacing?: ScaleObject
	space?: ScaleObject
	breakpoints?: BreakPoints
	colors?: ScaleObject
	fontSizes?: ScaleObject
	sizes?: ScaleObject
}

export function makeStyleHelpers(config: ThemeConfig) {
	const spacing = config.spacing || config.space || {}
	const colors = config.colors || {}
	const sizes = config.sizes || {}
	const breakpoints = config.breakpoints || {}

	const makeSpaceFn = makeResponsiveStyleFn.bind(null, spacing)
	const makeColorFn = makeResponsiveStyleFn.bind(null, colors)
	const makeSizeFn = makeResponsiveStyleFn.bind(null, sizes)

	const m = makeSpaceFn('margin')
	const mt = makeSpaceFn('marginTop')
	const mb = makeSpaceFn('marginBottom')
	const mr = makeSpaceFn('marginRight')
	const ml = makeSpaceFn('marginLeft')
	const my = makeSpaceFn(['marginTop', 'marginBottom'])
	const mx = makeSpaceFn(['marginRight', 'marginLeft'])
	const p = makeSpaceFn('padding')
	const pt = makeSpaceFn('paddingTop')
	const pb = makeSpaceFn('paddingBottom')
	const pr = makeSpaceFn('paddingRight')
	const pl = makeSpaceFn('paddingLeft')
	const py = makeSpaceFn(['paddingTop', 'paddingBottom'])
	const px = makeSpaceFn(['paddingRight', 'paddingLeft'])
	const t = makeSpaceFn('top')
	const b = makeSpaceFn('bottom')
	const r = makeSpaceFn('right')
	const l = makeSpaceFn('left')

	const c = makeColorFn('color')
	const bg = makeColorFn('backgroundColor')

	const w = makeSizeFn('width')
	const h = makeSizeFn('height')
	const wMin = makeSizeFn('minWidth')
	const hMin = makeSizeFn('minHeight')
	const wMax = makeSizeFn('maxWidth')
	const hMax = makeSizeFn('maxHeight')

	const position = makeResponsiveStyleFn<CSS.Property.Position>({}, 'position')
	const display = makeResponsiveStyleFn<CSS.Property.Display>({}, 'display')

	return {
		m,
		margin: m,
		mt,
		marginTop: mt,
		mb,
		marginBottom: mb,
		ml,
		marginLeft: ml,
		mr,
		marginRight: mr,
		mx,
		marginHorizontal: mx,
		my,
		marginVertical: my,
		p,
		padding: p,
		pt,
		paddingTop: pt,
		pb,
		paddingBottom: pb,
		pl,
		paddingLeft: pl,
		pr,
		paddingRight: pr,
		px,
		paddingHorizontal: px,
		py,
		paddingVertical: py,
		t,
		top: t,
		b,
		bottom: b,
		l,
		left: l,
		r,
		right: r,
		c,
		color: c,
		bg,
		backgroundColor: bg,
		w,
		width: w,
		wMax,
		maxWidth: wMax,
		wMin,
		minWidth: wMin,
		h,
		height: h,
		hMax,
		maxHeight: hMax,
		hMin,
		minHeight: hMin,
		position,
		pos: position,
		display,
		d: display,
	} as const

	function makeResponsiveStyleFn<S extends StyleValue = StyleValue>(
		scale: ScaleObject,
		keys: string | string[],
	) {
		const keysArray = Array.isArray(keys) ? keys : [keys]

		return (
			generalStyle: S,
			...responsiveStyles: Array<S | null | undefined>
		) =>
			responsiveStyles.reduce(
				(styles, styleVal, i) =>
					styleVal != null
						? merge(styles, {
								[atBreakpoint(breakpoints[i])]: makeStyleObject(
									keysArray,
									styleVal,
									scale,
								),
						  })
						: styles,
				makeStyleObject(keysArray, generalStyle, scale),
			)
	}
}

export function makeStyleTheme<B extends ScaleObject, T extends ThemeConfig<B>>(
	themeConfig: T,
) {
	const mediaQueries = {} as T['breakpoints']
	if (themeConfig.breakpoints) {
		for (const k in themeConfig.breakpoints) {
			mediaQueries![k] = atBreakpoint(themeConfig.breakpoints[k])
		}
	}

	const theme = {
		compose,
		mediaQueries,
		...makeStyleHelpers(themeConfig),
		...themeConfig,
	}

	function myMakeStyles<
		Props extends {} = {},
		ClassKey extends string = string
	>(
		styles: (t?: typeof theme) => StyleRules<Props, ClassKey>,
		// | StyleRules<Props, ClassKey>,
		options?: JSS.StyleSheetFactoryOptions,
	): (props?: Props) => Record<ClassKey, string> {
		return createUseStyles(styles, options) as any
	}

	// makeStyles()

	return { theme, makeStyles: myMakeStyles }
}

export type StyleHelpers = ReturnType<typeof makeStyleHelpers>
export type ThemeHelpers = ReturnType<typeof makeStyleTheme>

// === helpers ===

function makeStyleObject(
	keys: string[],
	styleVal: StyleValue,
	scale: ScaleObject,
) {
	return compose(
		...keys.map(key => ({
			[key]: get(styleVal, scale),
		})),
	)
}

function get(n: StyleValue, scale: ScaleObject) {
	return scale[n as any] || n
}

function merge(a: any, b: any) {
	const result = { ...a, ...b }
	for (const key in b) {
		if (a[key] && typeof b[key] === 'object') {
			result[key] = Object.assign(a[key], b[key])
		}
	}
	return result
}

function compose(...args: CSSProperties[]): CSSProperties {
	return args.reduce(merge, {})
}

function atBreakpoint(s: StyleValue) {
	return `@media screen and (min-width: ${s})`
}

// Type helpers

type JSSFontface = CSS.AtRule.FontFace & { fallbacks?: CSS.AtRule.FontFace[] }

type PropsFunc<Props extends object, T> = (props: Props) => T

/**
 * Allows the user to augment the properties available
 */
export interface BaseCSSProperties extends CSS.Properties<number | string> {
	'@font-face'?: JSSFontface | JSSFontface[]
}

export interface CSSProperties extends BaseCSSProperties {
	// Allow pseudo selectors and media queries
	// `unknown` is used since TS does not allow assigning an interface without
	// an index signature to one with an index signature. This is to allow type safe
	// module augmentation.
	// Technically we want any key not typed in `BaseCSSProperties` to be of type
	// `CSSProperties` but this doesn't work. The index signature needs to cover
	// BaseCSSProperties as well. Usually you would use `BaseCSSProperties[keyof BaseCSSProperties]`
	// but this would not allow assigning React.CSSProperties to CSSProperties
	[k: string]: unknown | CSSProperties
}

type BaseCreateCSSProperties<Props extends object = {}> = {
	[P in keyof BaseCSSProperties]:
		| BaseCSSProperties[P]
		| PropsFunc<Props, BaseCSSProperties[P]>
}

interface CreateCSSProperties<Props extends object = {}>
	extends BaseCreateCSSProperties<Props> {
	// Allow pseudo selectors and media queries
	[k: string]:
		| BaseCreateCSSProperties<Props>[keyof BaseCreateCSSProperties<Props>]
		| CreateCSSProperties<Props>
}

/**
 * This is basically the API of JSS. It defines a Map<string, CSS>,
 * where
 * - the `keys` are the class (names) that will be created
 * - the `values` are objects that represent CSS rules (`React.CSSProperties`).
 *
 * if only `CSSProperties` are matched `Props` are inferred to `any`
 */
export type StyleRules<
	Props extends object = {},
	ClassKey extends string = string
> = Record<
	ClassKey,
	// JSS property bag
	| CSSProperties
	// JSS property bag where values are based on props
	| CreateCSSProperties<Props>
	// JSS property bag based on props
	| PropsFunc<Props, CreateCSSProperties<Props>>
>
