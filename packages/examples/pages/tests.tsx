import clsx from 'clsx'
import { makeStyles } from '../components/theme'

export default function TestPage() {
	const styles = useStyles()
	return (
		<article>
			<div className={clsx(styles.all, styles.responsivity)}>Hello World</div>
			<div className={clsx(styles.all, styles.content)}>main text </div>
		</article>
	)
}

const useStyles = makeStyles(($) => {
	const styles = {
		all: $.m(3),

		responsivity: $.apply({
			mx: 0,
			my: [1, 2, 3, 4],
			p: [2, 3, null, 4],
			borderWidth: ['thin', null, 'thick'],
			borderStyle: 'solid',
			boxShadow: `0 2px 3px ${$.colors.dark}`,
		}),

		content: {
			'&::after': {
				content: '"(after text)"',
				color: 'tomato',
			},
		},
	}
	console.log(JSON.stringify(styles, null, '  '))
	return styles
})
