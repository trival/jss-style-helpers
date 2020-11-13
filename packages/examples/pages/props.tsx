import { StyleProps } from 'jss-style-helpers'
import { Theme, makeStyles } from '../components/theme'

// Declare StyleProps
type Props = StyleProps<Theme, 'bg' | 'c' | 'p' | 'm'>

const Box: React.FC<Props> = ({ children, ...props }) => {
	const cls = useStyles(props)
	return <div className={cls.box}>{children}</div>
}

const useStyles = makeStyles<Props>(($) => ({
	box: (props) => {
		const ofProps = $.fromProps(props)
		const styles = $.compose(ofProps, { border: '3px solid black' })

		console.log(JSON.stringify(styles, null, '  '))

		return styles
	},
}))

export default function PropsTestPage() {
	return (
		<div>
			<Box m={[1, 2, 3, 4]} p={[4, 3, 2, 1]}>
				1
			</Box>
			<Box p={[2, 3, 5]} m="1" bg="fontDark" c="fontLight">
				2
			</Box>
			{/* Unfortunately Media queries only work on the first element :( */}
			<Box p={[2, 3, 4]} m={['3', '4', '5']} c="fontLight" bg="red">
				3
				<br /> Media queries don&apos;t work here :(
				<br /> Only in the first Box component...
			</Box>
		</div>
	)
}
