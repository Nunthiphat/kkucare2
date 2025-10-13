import Layout from './components/layout';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex-grow">
        <div className="flex flex-col min-h-screen">
          <Layout>
            {children}
          </Layout>
        </div>
      </body>
    </html>
  );
}