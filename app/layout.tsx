import type { Metadata, Viewport } from 'next'
import './globals.css'
export const metadata:Metadata={title:'Block Blast Placement',description:'Susun papan dan cari urutan penempatan tiga blok untuk puzzle Block Blast.'}
export const viewport:Viewport={colorScheme:'light dark'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
