import { makeStyleTheme } from './index'

describe('style system', () => {
	describe('style theme functions', () => {
		const spacing = [0, '1px', '2px', '3px'] as const
		const breakpoints = ['20em', '40em', '60em']
		const colors = {
			red: 'tomato',
			blue: '#123456',
		}
		const sizes = {
			full: '100%',
			half: '50%',
			third: '33.33333%',
		}

		const { theme } = makeStyleTheme({
			spacing,
			breakpoints,
			colors,
			sizes,
		})

		it('picks margins from defined spacing', () => {
			expect(theme.m(0)).toMatchInlineSnapshot(`
			Object {
			  "margin": 0,
			}
		`)
			expect(theme.m(1)).toMatchInlineSnapshot(`
			Object {
			  "margin": "1px",
			}
		`)
			expect(theme.m(2)).toMatchInlineSnapshot(`
			Object {
			  "margin": "2px",
			}
		`)
			expect(theme.m(3)).toMatchInlineSnapshot(`
			Object {
			  "margin": "3px",
			}
		`)
			expect(theme.m(4)).toMatchInlineSnapshot(`
			Object {
			  "margin": 4,
			}
		`)
			expect(theme.m('not in spaces')).toMatchInlineSnapshot(`
					Object {
					  "margin": "not in spaces",
					}
				`)
		})

		it('can get responsive parameters', () => {
			const style = theme.m(1, 2, 3)
			expect(style).toEqual({
				margin: '1px',
				'@media screen and (min-width: 20em)': {
					margin: '2px',
				},
				'@media screen and (min-width: 40em)': {
					margin: '3px',
				},
			})
		})

		it('can get responsive arrays', () => {
			const style = theme.m([1, 2, 3])
			expect(style).toEqual(theme.m(1, 2, 3))
			expect(style).toEqual({
				margin: '1px',
				'@media screen and (min-width: 20em)': {
					margin: '2px',
				},
				'@media screen and (min-width: 40em)': {
					margin: '3px',
				},
			})
		})

		it('handles margin, padding, and positionsing', () => {
			expect(theme.m(2)).toMatchInlineSnapshot(`
			Object {
			  "margin": "2px",
			}
		`)
			expect(theme.mt(2)).toMatchInlineSnapshot(`
			Object {
			  "marginTop": "2px",
			}
		`)
			expect(theme.mb(2)).toMatchInlineSnapshot(`
			Object {
			  "marginBottom": "2px",
			}
		`)
			expect(theme.ml(2)).toMatchInlineSnapshot(`
			Object {
			  "marginLeft": "2px",
			}
		`)
			expect(theme.mr(2)).toMatchInlineSnapshot(`
			Object {
			  "marginRight": "2px",
			}
		`)
			expect(theme.mx(2)).toMatchInlineSnapshot(`
			Object {
			  "marginLeft": "2px",
			  "marginRight": "2px",
			}
		`)
			expect(theme.my(2)).toMatchInlineSnapshot(`
			Object {
			  "marginBottom": "2px",
			  "marginTop": "2px",
			}
		`)
			expect(theme.p(2)).toMatchInlineSnapshot(`
			Object {
			  "padding": "2px",
			}
		`)
			expect(theme.pt(2)).toMatchInlineSnapshot(`
			Object {
			  "paddingTop": "2px",
			}
		`)
			expect(theme.pb(2)).toMatchInlineSnapshot(`
			Object {
			  "paddingBottom": "2px",
			}
		`)
			expect(theme.pl(2)).toMatchInlineSnapshot(`
			Object {
			  "paddingLeft": "2px",
			}
		`)
			expect(theme.pr(2)).toMatchInlineSnapshot(`
			Object {
			  "paddingRight": "2px",
			}
		`)
			expect(theme.px(2)).toMatchInlineSnapshot(`
			Object {
			  "paddingLeft": "2px",
			  "paddingRight": "2px",
			}
		`)
			expect(theme.py(2)).toMatchInlineSnapshot(`
			Object {
			  "paddingBottom": "2px",
			  "paddingTop": "2px",
			}
		`)
			expect(theme.t(2)).toMatchInlineSnapshot(`
			Object {
			  "top": "2px",
			}
		`)
			expect(theme.b(2)).toMatchInlineSnapshot(`
			Object {
			  "bottom": "2px",
			}
		`)
			expect(theme.l(2)).toMatchInlineSnapshot(`
			Object {
			  "left": "2px",
			}
		`)
			expect(theme.r(2)).toMatchInlineSnapshot(`
			Object {
			  "right": "2px",
			}
		`)
		})

		it('can create color styles', () => {
			expect(theme.c('red')).toEqual({
				color: 'tomato',
			})
			expect(theme.c(theme.colors.red)).toEqual({
				color: 'tomato',
			})
			expect(theme.c(theme.colors.red, 'blue', '#fff')).toEqual({
				color: 'tomato',
				'@media screen and (min-width: 20em)': {
					color: '#123456',
				},
				'@media screen and (min-width: 40em)': {
					color: '#fff',
				},
			})
			expect(theme.bg('red')).toEqual({
				backgroundColor: 'tomato',
			})
			expect(theme.bc('red')).toEqual({
				borderColor: 'tomato',
			})
		})

		it('has size helpers', () => {
			expect(theme.w('full')).toEqual(theme.w(theme.sizes.full))
			expect(theme.w('full')).toMatchInlineSnapshot(`
			Object {
			  "width": "100%",
			}
		`)
			expect(theme.h('half')).toMatchInlineSnapshot(`
			Object {
			  "height": "50%",
			}
		`)
			expect(theme.hMin('half')).toMatchInlineSnapshot(`
			Object {
			  "minHeight": "50%",
			}
		`)
			expect(theme.hMax('half')).toMatchInlineSnapshot(`
			Object {
			  "maxHeight": "50%",
			}
		`)
			expect(theme.wMin('half')).toMatchInlineSnapshot(`
			Object {
			  "minWidth": "50%",
			}
		`)
			expect(theme.wMax('half')).toMatchInlineSnapshot(`
			Object {
			  "maxWidth": "50%",
			}
		`)
			expect(theme.w('full', 'half', 'third')).toEqual({
				width: '100%',
				'@media screen and (min-width: 20em)': {
					width: '50%',
				},
				'@media screen and (min-width: 40em)': {
					width: '33.33333%',
				},
			})
		})

		it('has position and display functions', () => {
			expect(theme.position('absolute', null, 'relative', 'fixed'))
				.toMatchInlineSnapshot(`
			Object {
			  "@media screen and (min-width: 40em)": Object {
			    "position": "relative",
			  },
			  "@media screen and (min-width: 60em)": Object {
			    "position": "fixed",
			  },
			  "position": "absolute",
			}
		`)
			expect(theme.display('block', null, 'inline-block', 'inline'))
				.toMatchInlineSnapshot(`
			Object {
			  "@media screen and (min-width: 40em)": Object {
			    "display": "inline-block",
			  },
			  "@media screen and (min-width: 60em)": Object {
			    "display": "inline",
			  },
			  "display": "block",
			}
		`)
		})

		it('has aliases', () => {
			expect(theme.m).toBe(theme.margin)
			expect(theme.mt).toBe(theme.marginTop)
			expect(theme.mb).toBe(theme.marginBottom)
			expect(theme.ml).toBe(theme.marginLeft)
			expect(theme.mr).toBe(theme.marginRight)
			expect(theme.mx).toBe(theme.marginHorizontal)
			expect(theme.my).toBe(theme.marginVertical)
			expect(theme.p).toBe(theme.padding)
			expect(theme.pt).toBe(theme.paddingTop)
			expect(theme.pb).toBe(theme.paddingBottom)
			expect(theme.pl).toBe(theme.paddingLeft)
			expect(theme.pr).toBe(theme.paddingRight)
			expect(theme.px).toBe(theme.paddingHorizontal)
			expect(theme.py).toBe(theme.paddingVertical)
			expect(theme.t).toBe(theme.top)
			expect(theme.b).toBe(theme.bottom)
			expect(theme.l).toBe(theme.left)
			expect(theme.r).toBe(theme.right)
			expect(theme.w).toBe(theme.width)
			expect(theme.wMin).toBe(theme.minWidth)
			expect(theme.wMax).toBe(theme.maxWidth)
			expect(theme.h).toBe(theme.height)
			expect(theme.hMin).toBe(theme.minHeight)
			expect(theme.hMax).toBe(theme.maxHeight)
			expect(theme.d).toBe(theme.display)
			expect(theme.pos).toBe(theme.position)
			expect(theme.c).toBe(theme.color)
			expect(theme.bg).toBe(theme.backgroundColor)
			expect(theme.bc).toBe(theme.borderColor)
			expect(theme.fs).toBe(theme.fontSize)
		})

		it('creates custom responsive values', () => {
			expect(
				theme.responsive('position', 'absolute', null, 'relative', 'fixed'),
			).toMatchInlineSnapshot(`
			Object {
			  "@media screen and (min-width: 40em)": Object {
			    "position": "relative",
			  },
			  "@media screen and (min-width: 60em)": Object {
			    "position": "fixed",
			  },
			  "position": "absolute",
			}
		`)
		})
	})

	describe('makeStyleTheme', () => {
		const spacing = [0, '1px', '2px', '3px'] as const
		const breakpoints = ['20em', '40em', '60em']

		it('create the helper object', () => {
			const { theme } = makeStyleTheme({ spacing, breakpoints })
			expect(typeof theme.m).toBe('function')
			expect(typeof theme.c).toBe('function')
			expect(typeof theme.px).toBe('function')
			expect(typeof theme.t).toBe('function')
			expect(typeof theme.compose).toBe('function')
		})

		it('creates mediaqueries', () => {
			const { theme } = makeStyleTheme({ spacing, breakpoints })
			expect(theme.mediaQueries).toMatchObject({
				0: '@media screen and (min-width: 20em)',
				1: '@media screen and (min-width: 40em)',
				2: '@media screen and (min-width: 60em)',
			})
			const theme2 = makeStyleTheme({
				spacing,
				breakpoints: Object.assign(breakpoints, {
					sm: breakpoints[0],
					md: breakpoints[1],
					lg: [breakpoints[2]],
				}),
			}).theme

			expect(theme2.mediaQueries).toMatchObject({
				0: '@media screen and (min-width: 20em)',
				1: '@media screen and (min-width: 40em)',
				2: '@media screen and (min-width: 60em)',
				sm: '@media screen and (min-width: 20em)',
				md: '@media screen and (min-width: 40em)',
				lg: '@media screen and (min-width: 60em)',
			})

			expect(theme2.mediaQueries[0]).toEqual(
				'@media screen and (min-width: 20em)',
			)
			expect(theme2.mediaQueries.sm).toEqual(
				'@media screen and (min-width: 20em)',
			)
			expect(theme2.breakpoints.sm).toEqual('20em')
			expect(theme2.breakpoints[0]).toEqual('20em')
		})

		describe('compose', () => {
			const { theme } = makeStyleTheme({ spacing, breakpoints })
			const $ = theme

			it('composes responsive styles', () => {
				const styleObj = $.compose(
					$.m(1, 2, 3),
					$.p(1, 2, 3),
					$.t(1, 2, 3),
					$.responsive('display', 'block', 'inline-block', null, 'flex'),
				)
				expect(styleObj).toMatchInlineSnapshot(
					{
						top: '1px',
						margin: '1px',
						padding: '1px',
						display: 'block',
						'@media screen and (min-width: 20em)': {
							top: '2px',
							margin: '2px',
							padding: '2px',
						},
						'@media screen and (min-width: 40em)': {
							top: '3px',
							margin: '3px',
							padding: '3px',
						},
					},
					`
			Object {
			  "@media screen and (min-width: 20em)": Object {
			    "display": "inline-block",
			    "margin": "2px",
			    "padding": "2px",
			    "top": "2px",
			  },
			  "@media screen and (min-width: 40em)": Object {
			    "margin": "3px",
			    "padding": "3px",
			    "top": "3px",
			  },
			  "@media screen and (min-width: 60em)": Object {
			    "display": "flex",
			  },
			  "display": "block",
			  "margin": "1px",
			  "padding": "1px",
			  "top": "1px",
			}
		`,
				)
			})

			it('is communicative', () => {
				const style1 = $.compose($.p(1), { foo: 'bar' }, $.p(1, 2, 3))
				const style2 = $.compose({ foo: 'bar' }, $.p(1, 2, 3), $.p(1))
				expect(style1).toEqual(style2)
			})

			it('can handle empty and falsy values', () => {
				expect($.compose()).toEqual({})
				expect($.compose(undefined)).toEqual({})
				expect($.compose(null)).toEqual({})
				expect($.compose(null, undefined, false, 0, '')).toEqual({})
				expect(
					$.compose(null, { foo: 'bar' }, undefined, false, 0, ''),
				).toEqual({ foo: 'bar' })
			})

			it('composes nested styles', () => {
				const composed = $.compose(
					{
						'@media': {
							'&&': $.p(3),
						},
					},
					{
						'@media': {
							'&&': $.m(3),
						},
					},
				)
				console.log(composed)
				expect(composed).toEqual({
					'@media': {
						'&&': $.compose($.p(3), $.m(3)),
					},
				})
			})
		})

		describe('fromProps', () => {
			const { theme } = makeStyleTheme({ spacing, breakpoints })
			const $ = theme

			it('can compose styles form a props object', () => {
				expect($.fromProps({ p: [1, 2], m: 3 })).toMatchInlineSnapshot(`
			Object {
			  "@media screen and (min-width: 20em)": Object {
			    "padding": "2px",
			  },
			  "margin": "3px",
			  "padding": "1px",
			}
		`)
			})

			it('omits keys that are not helper functions', () => {
				const styles = $.fromProps({ m: 1, foo: 'bar', borderWidth: 'kuku' })
				expect('foo' in styles).toBe(false)
				expect('borderWidth' in styles).toBe(false)
			})
		})

		describe('apply', () => {
			const { theme } = makeStyleTheme({ spacing, breakpoints })
			const $ = theme

			it('can apply helpers to a style object', () => {
				const styles = $.apply({
					m: [1, 2, 3],
					p: [2, 3],
					borderWidth: ['1rem', '2rem', '3rem'],
					borderStyle: 'dashed',
				})
				expect(styles).toMatchInlineSnapshot(`
			Object {
			  "@media screen and (min-width: 20em)": Object {
			    "borderWidth": "2rem",
			    "margin": "2px",
			    "padding": "3px",
			  },
			  "@media screen and (min-width: 40em)": Object {
			    "borderWidth": "3rem",
			    "margin": "3px",
			  },
			  "borderStyle": "dashed",
			  "borderWidth": "1rem",
			  "margin": "1px",
			  "padding": "2px",
			}
		`)
			})
		})
	})
})
