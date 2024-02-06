import '@/styles/globals.css'
import { TrackingProvider } from '../context/Tracking'
import { NavBar, Footer } from '../components'

export default function App({ Component, pageProps }) {
	return (
		<>
			<TrackingProvider>
				<NavBar />
				<Component {...pageProps} />
			</TrackingProvider>
			<Footer />
		</>
	)
}
