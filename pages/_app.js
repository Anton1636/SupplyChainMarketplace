import '@/styles/globals.css'
import { TrackingProvider } from '../context/tracking'

export default function App({ Component, pageProps }) {
	return (
		<>
			<TrackingProvider>
				<Component {...pageProps} />
			</TrackingProvider>
		</>
	)
}
