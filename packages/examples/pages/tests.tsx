import clsx from 'clsx'
import { makeStyles } from '../components/theme'

export default function TestPage() {
	const styles = useStyles()
	return (
		<article>
			<div className={clsx(styles.all, styles.simpleResponsive)}>
				simple responsive
			</div>
			<div className={clsx(styles.all, styles.complexResponsive)}>
				complex responsive
			</div>
			<div className={clsx(styles.all, styles.content)}>main text </div>
		</article>
	)
}

const useStyles = makeStyles(($) => {
	const styles = {
		all: $.apply({ m: 3, border: '2px solid black' }),

		simpleResponsive: $.p(2, null, 3, 4),

		complexResponsive: $.apply({
			pos: 'relative',
			w: ['100%', null, '66.6667%'],
			mb: [5, null, 0],
			p: [2, 3, 4, 5],
		}),

		content: {
			padding: $.spacing[2],
			'&::after': {
				content: '"(after text)"',
				color: 'tomato',
			},
		},
	}
	console.log(JSON.stringify(styles, null, '  '))
	return styles
})
