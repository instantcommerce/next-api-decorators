import { Provider } from 'next-auth/client'

export default function App({ Component, pageProps }: any) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}