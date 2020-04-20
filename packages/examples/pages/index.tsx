import { makeStyles } from '../components/theme'
import { Typography } from '../components/typography'

export default () => {
	const styles = useStyles()
	return (
		<article>
			<h1 className={styles.foo}>Hello World</h1>
			<p className={styles.bar}>Hello apply function</p>
			<Typography variant="active">Some active text</Typography>
		</article>
	)
}

const useStyles = makeStyles(($) => ({
	foo: $.compose(
		// compose your helpers

		// reset horizontal margin: {marginLeft: 0, marginRight: 0}
		$.mx(0),

		// responsive vertical margin, respects the 3 defined breakpoints
		$.my(1, 2, 3, 4),

		// responsive padding (also possible as array)
		$.p([2, 3, 4]),

		// backgroundColor
		$.bg($.colors.red),

		// color string is looked up in the `colors` theme property
		$.c('light'),

		// borderColor - values are passed as are, if they cannot be looked up
		$.bc('#abc'),

		// style values without a dedicated helper function can use the responsive helper
		$.responsive('borderWidth', 'thin', null, 'thick'),

		// use other react-jss style properties
		{
			borderStyle: 'solid',
			boxShadow: `0 2px 3px ${$.colors.dark}`,
		},
	),

	// or use the shorthand apply function, same as above:
	bar: $.apply({
		mx: 0,
		my: [1, 2, 3, 4],
		p: [2, 3, 4],
		bg: $.colors.red,
		c: 'light',
		bc: '#abc',
		borderWidth: ['thin', null, 'thick'],
		borderStyle: 'solid',
		boxShadow: `0 2px 3px ${$.colors.dark}`,
	}),
}))
