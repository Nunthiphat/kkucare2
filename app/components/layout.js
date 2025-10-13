import Header from './layout/header'
import Footer from './layout/footer'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}