import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { withBlitz } from "app/blitz-client"
import { createClient, WagmiConfig, configureChains, defaultChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LoginModalProvider } from "app/auth/components/LoginModal"
import { LocalizationProvider } from "@mui/x-date-pickers"

const { chains, provider } = configureChains(defaultChains, [publicProvider()])

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
})

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <WagmiConfig client={client}>
          <LoginModalProvider>{getLayout(<Component {...pageProps} />)}</LoginModalProvider>
        </WagmiConfig>
      </LocalizationProvider>
    </ErrorBoundary>
  )
}

export default withBlitz(MyApp)
