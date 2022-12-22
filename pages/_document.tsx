import { Html, Head, Main, NextScript } from 'next/document'

// @material-tailwind/react
import { ThemeProvider } from "@material-tailwind/react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='bg-gray-50'>
        <ThemeProvider>
          <Main />
          <NextScript />
        </ThemeProvider>
      </body>
    </Html>
  )
}
