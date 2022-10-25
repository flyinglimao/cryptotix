import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import { AppBar, Container, Toolbar, Typography } from "@mui/material"
import Link from "next/link"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | CryptoTix` : "CryptoTix"}</title>z
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <Link href="/" passHref>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                CryptoTix
              </Typography>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      {children}
      <style jsx global>
        {`
          html,
          body {
            margin: 0;
            padding: 0;
            font-family: Roboto;
          }
        `}
      </style>
    </>
  )
}

export default Layout
