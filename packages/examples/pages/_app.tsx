import { AppProps } from 'next/app'
import { useEffect } from 'react'
import { ThemeProvider } from 'react-jss'
import { theme } from '../components/theme'

export default function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		const style = document.getElementById('server-side-styles')

		if (style) {
			style.parentNode.removeChild(style)
		}
	}, [])

	return (
		<ThemeProvider theme={theme}>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}
