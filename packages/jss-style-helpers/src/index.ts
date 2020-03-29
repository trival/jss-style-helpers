import {
	Styles,
	WithStylesOptions,
	ClassNameMap,
	CSSProperties,
	// makeStyles,
} from '@material-ui/styles'
import { DisplayProperty, PositionProperty } from 'csstype'
import { createUseStyles } from 'react-jss'

type StyleValue = number | string

export type ScaleObject = Record<StyleValue, StyleValue> | StyleValue[]

interface ThemeConfig {
	spacing?: ScaleObject
	space?: ScaleObject
	breakpoints?: ScaleObject
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

	const position = makeResponsiveStyleFn<PositionProperty>({}, 'position')
	const display = makeResponsiveStyleFn<DisplayProperty>({}, 'display')

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

export function makeStyleTheme<B extends ScaleObject, T extends ThemeConfig>(
	themeConfig: T & { breakpoints: B },
) {
	const mediaQueries: B = { ...(themeConfig.breakpoints as B) }

	for (const k in themeConfig.breakpoints as B) {
		mediaQueries[k] = atBreakpoint((themeConfig.breakpoints as B)[k])
	}

	const theme = {
		compose,
		mediaQueries,
		...makeStyleHelpers(themeConfig),
		...themeConfig,
	}

	function myMakeStyles<ClassKey extends string = string>(
		styles: Styles<typeof theme, never, ClassKey>,
		options?: Omit<WithStylesOptions<typeof theme>, 'withTheme'>,
	): (props?: any) => ClassNameMap<ClassKey>
	function myMakeStyles<
		Props extends {} = {},
		ClassKey extends string = string
	>(
		styles: Styles<typeof theme, Props, ClassKey>,
		options?: Omit<WithStylesOptions<typeof theme>, 'withTheme'>,
	): (props: Props) => ClassNameMap<ClassKey>
	function myMakeStyles<
		Props extends {} = {},
		ClassKey extends string = string
	>(styles: any, options?: any): (props?: Props) => ClassNameMap<ClassKey> {
		return createUseStyles(styles, options) as any
	}

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
