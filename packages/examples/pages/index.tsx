import { makeStyles } from '../components/theme'

export default () => {
	const styles = useStyles()
	return <h1 className={styles.foo}>Hello World</h1>
}

const useStyles = makeStyles($ => ({
	foo: $.compose(
		// compose your helpers

		// reset horizontal margin: {marginLeft: 0, marginRight: 0}
		$.mx(0),

		// responsive vertical margin, respects the 3 defined breakpoints
		$.my(1, 2, 3, 4),

		// responsive padding
		$.p(2, 3, 4),

		// backgroundColor
		$.bg($.colors.red),

		// color string is read from `colors` theme property
		$.c('light'),

		// use other react-jss style properties
		{
			boxShadow: `0 2px 3px ${$.colors.dark}`,
		},
	),
}))
