import { StylePropsType, StyleProps } from 'jss-style-helpers'
import { Theme, makeStyles } from '../components/theme'

// Declare StyleProps
interface Props extends StyleProps<Theme, 'bg' | 'c'> {
	m?: StylePropsType<Theme['m']>
	p?: StylePropsType<Theme['p']>
}

const Box: React.FC<Props> = ({ children, ...props }) => {
	const cls = useStyles(props)
	return <div className={cls.box}>{children}</div>
}

const useStyles = makeStyles<Props>(($) => ({
	box: (props) => {
		const ofProps = $.fromProps(props)
		const styles = $.compose(ofProps, { border: '3px solid black' })
		return styles
	},
}))

export default () => (
	<div>
		<Box p="3" m="1" bg="fontDark" c="fontLight">
			1
		</Box>
		<Box m={5} p={4}>
			2
		</Box>
		{/* mediaQueries should also work, but have issues in jss
		https://github.com/cssinjs/jss/issues/1327 */}
		<Box p={['2', '3', '4']} m={['3', '4', '5']} c="fontLight" bg="red">
			3
		</Box>
	</div>
)
