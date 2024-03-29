import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../../context/authContext'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yappers',
  description: 'Connect and yap away with your friends.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
        <div id="fb-root"></div>
          {children}
        
        </body>
        
      </html>
      
    </AuthProvider>
  </>
  )
}
