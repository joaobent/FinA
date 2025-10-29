import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "FinA",
  description: "Gerenciador de finanças com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={poppins.className} suppressHydrationWarning={true}>

        <Header/>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
