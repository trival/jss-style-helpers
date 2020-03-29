import { makeStyles } from '../components/theme'

export default () => {
	const styles = useStyles()
	return <h1 className={styles.foo}>Hello World</h1>
}

const useStyles = makeStyles(t => ({
	foo: t.compose(t.m(0), t.bg(t.colors.gray), t.c(t.colors.fontDark)),
}))
