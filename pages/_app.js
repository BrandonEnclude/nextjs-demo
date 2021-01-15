import { CookiesProvider } from "react-cookie"
import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <div className="container">
        <main>
          <Component {...pageProps} />
        </main>
        <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>
      </div>
    </CookiesProvider>
  )
}