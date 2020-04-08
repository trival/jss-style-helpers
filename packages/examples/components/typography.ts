import clsx from 'clsx'
import { createElement } from 'react'
import { makeStyles, Theme } from './theme'

interface Props {
	as?: string
	variant?: keyof Theme['textStyles']
	color?: keyof Theme['colors']
	italic?: boolean
	bold?: boolean
	uppercase?: boolean
	className?: string
}

const useStyles = makeStyles($ => ({
	typography: (props: Props) =>
		$.compose(
			props.variant ? $.textStyles[props.variant] : {},
			props.color ? $.color(props.color) : {},
			props.italic ? { fontStyle: 'italic' } : {},
			props.bold ? { fontWeight: 'bold' } : {},
			props.uppercase ? { textTransform: 'uppercase' } : {},
		),
}))

export const Typography: React.FC<Props> = props => {
	const cs = useStyles(props)
	return createElement(
		props.as || 'p',
		{ className: clsx(cs.typography, props.className) },
		props.children,
	)
}
