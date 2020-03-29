import { makeStyles } from '../components/theme'

export default () => {
	const styles = useStyles()
	return <h1 className={styles.foo}>Hello World</h1>
}

const useStyles = makeStyles($ => ({
	foo: $.compose(
		$.m(1, 2, 3),
		$.p(2, 3, 4),
		$.bg($.colors.gray),
		$.c($.colors.fontLight),
	),
}))
