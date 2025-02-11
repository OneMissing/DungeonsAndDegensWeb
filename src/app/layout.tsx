import { AuthProvider } from "@/lib/useAuth";



export const metadata = {
  title: 'D&D',
  description: 'Dragons and Degenerates Intro page',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="cs">
        <body>{children}</body>
      </html>
    </AuthProvider>
    
  )
}


