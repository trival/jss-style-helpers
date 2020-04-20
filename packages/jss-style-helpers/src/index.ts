// import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line import/no-extraneous-dependencies
import * as JSS from 'jss'
import { createUseStyles } from 'react-jss'
import * as CSS from './cssTypes'

type StyleValue = 0 | (string & {})

export type ScaleArray =
	| readonly StyleValue[]
	| (readonly StyleValue[] & Record<string | number, StyleValue>)
export type ScaleObject = Record<string | number, StyleValue> | ScaleArray

interface ThemeConfig<
	BreakPoints extends ScaleArray = ScaleArray,
	Spacing extends ScaleObject = ScaleObject,
	Colors extends ScaleObject = ScaleObject,
	Sizes extends ScaleObject = ScaleObject,
	FontSizes extends ScaleObject = ScaleObject
> {
	spacing?: Spacing
	space?: Spacing
	breakpoints?: BreakPoints
	colors?: Colors
	fontSizes?: FontSizes
	sizes?: Sizes
}

export function makeStyleHelpers<
	BreakPoints extends ScaleArray = ScaleArray,
	Spacing extends ScaleObject = ScaleObject,
	Colors extends ScaleObject = ScaleObject,
	Sizes extends ScaleObject = ScaleObject,
	FontSizes extends ScaleObject = ScaleObject
>(config: ThemeConfig<BreakPoints, Spacing, Colors, Sizes, FontSizes>) {
	const spacing: Spacing = config.spacing || config.space || ({} as Spacing)
	const colors: Colors = config.colors || ({} as Colors)
	const sizes: Sizes = config.sizes || ({} as Sizes)
	const fontSizes: FontSizes = config.fontSizes || ({} as FontSizes)
	const breakpoints: BreakPoints =
		config.breakpoints || (([] as unknown) as BreakPoints)

	const m = makeResponsiveStyleFn(spacing, 'margin')
	const mt = makeResponsiveStyleFn(spacing, 'marginTop')
	const mb = makeResponsiveStyleFn(spacing, 'marginBottom')
	const mr = makeResponsiveStyleFn(spacing, 'marginRight')
	const ml = makeResponsiveStyleFn(spacing, 'marginLeft')
	const my = makeResponsiveStyleFn(spacing, ['marginTop', 'marginBottom'])
	const mx = makeResponsiveStyleFn(spacing, ['marginRight', 'marginLeft'])
	const p = makeResponsiveStyleFn(spacing, 'padding')
	const pt = makeResponsiveStyleFn(spacing, 'paddingTop')
	const pb = makeResponsiveStyleFn(spacing, 'paddingBottom')
	const pr = makeResponsiveStyleFn(spacing, 'paddingRight')
	const pl = makeResponsiveStyleFn(spacing, 'paddingLeft')
	const py = makeResponsiveStyleFn(spacing, ['paddingTop', 'paddingBottom'])
	const px = makeResponsiveStyleFn(spacing, ['paddingRight', 'paddingLeft'])
	const t = makeResponsiveStyleFn(spacing, 'top')
	const b = makeResponsiveStyleFn(spacing, 'bottom')
	const r = makeResponsiveStyleFn(spacing, 'right')
	const l = makeResponsiveStyleFn(spacing, 'left')

	const c = makeResponsiveStyleFn(colors, 'color')
	const bg = makeResponsiveStyleFn(colors, 'backgroundColor')
	const bc = makeResponsiveStyleFn(colors, 'borderColor')

	const w = makeResponsiveStyleFn(sizes, 'width')
	const h = makeResponsiveStyleFn(sizes, 'height')
	const wMin = makeResponsiveStyleFn(sizes, 'minWidth')
	const hMin = makeResponsiveStyleFn(sizes, 'minHeight')
	const wMax = makeResponsiveStyleFn(sizes, 'maxWidth')
	const hMax = makeResponsiveStyleFn(sizes, 'maxHeight')

	const fs = makeResponsiveStyleFn(fontSizes, 'fontSize')

	const position = makeResponsiveStyleFn<CSS.Property.Position>(
		{} as ScaleObject,
		'position',
	)
	const display = makeResponsiveStyleFn<CSS.Property.Display>(
		{} as ScaleObject,
		'display',
	)

	function responsive<PropKey extends keyof CSS.Properties>(
		cssProperty: PropKey,
		generalStyle: CSS.Properties[PropKey],
		...responsiveStyles: (CSS.Properties[PropKey] | null | undefined)[]
	) {
		return makeResponsiveStyleFn({} as ScaleObject, cssProperty)(
			generalStyle as any,
			...(responsiveStyles as any),
		)
	}

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
		bc,
		borderColor: bc,
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
		fs,
		fontSize: fs,

		responsive,

		breakpoints,
		spacing,
		colors,
		sizes,
		fontSizes,
	} as const

	function makeResponsiveStyleFn<
		S extends StyleValue = StyleValue,
		O extends ScaleObject = ScaleObject
	>(scale: O, keys: string | string[]) {
		const keysArray = Array.isArray(keys) ? keys : [keys]

		return (
			generalStyle:
				| (keyof O | S)
				| [keyof O | S, ...Array<keyof O | S | null | undefined>],
			...responsiveStyles: Array<keyof O | S | null | undefined>
		) => {
			if (Array.isArray(generalStyle)) {
				const [firstArg, ...args] = generalStyle
				generalStyle = firstArg
				responsiveStyles = args
			}
			return responsiveStyles.reduce(
				(styles, styleVal, i) =>
					styleVal != null
						? merge(styles, {
								[atBreakpoint(breakpoints[i])]: makeStyleObject(
									keysArray,
									styleVal as string,
									scale,
								),
						  })
						: styles,
				makeStyleObject(keysArray, generalStyle as string, scale),
			)
		}
	}
}

export function makeStyleTheme<
	ConfigObjects extends {} = {},
	BreakPoints extends ScaleArray = ScaleArray,
	Spacing extends ScaleObject = ScaleObject,
	Colors extends ScaleObject = ScaleObject,
	Sizes extends ScaleObject = ScaleObject,
	FontSizes extends ScaleObject = ScaleObject
>(
	themeConfig: ThemeConfig<BreakPoints, Spacing, Colors, Sizes, FontSizes> &
		ConfigObjects,
) {
	const mediaQueries = {} as BreakPoints
	if (themeConfig.breakpoints) {
		for (const k in themeConfig.breakpoints) {
			;(mediaQueries as any)[k] = atBreakpoint(themeConfig.breakpoints[k])
		}
	}

	const helpers = makeStyleHelpers(themeConfig)

	function fromProps(props: { [key: string]: any }) {
		const styleObj = Object.keys(props)
			.filter((key) => typeof (helpers as any)[key] === 'function')
			.map((key) => (helpers as any)[key](props[key]))
		return compose(...styleObj)
	}

	function apply(
		styles: { [K in keyof StyleHelpers]?: StylePropsType<typeof helpers[K]> } &
			{
				[K in keyof CSS.Properties]?:
					| CSS.Properties[K]
					| Array<CSS.Properties[K] | null | undefined>
			},
	): CSSProperties {
		const styleObj = Object.keys(styles).map((key) => {
			const val = (styles as any)[key]
			if (typeof (helpers as any)[key] === 'function') {
				return (helpers as any)[key](val)
			}
			if (Array.isArray(val)) {
				return helpers.responsive(key as any, ...(val as [any, any]))
			}
			return { [key]: val }
		})

		return compose(...styleObj)
	}

	const theme = {
		compose,
		mediaQueries,
		apply,
		fromProps,
		...helpers,
		...themeConfig,
	}

	function myMakeStyles<
		Props extends {} = {},
		ClassKey extends string = string
	>(
		styles:
			| StyleRules<Props, ClassKey>
			| ((t: typeof theme) => StyleRules<Props, ClassKey>),
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
		...keys.map((key) => ({
			[key]: get(styleVal, scale),
		})),
	)
}

function get(n: StyleValue, scale: ScaleObject) {
	return (scale as any)[n] || n
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

export type StylePropsType<T> = T extends (...args: infer R) => any
	? R[0]
	: never
export type StyleProps<
	T extends { [S in keyof StyleHelpers]: any },
	K extends keyof StyleHelpers
> = {
	[S in K]?: StylePropsType<T[S]>
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
	| PropsFunc<Props, CSSProperties>
>
