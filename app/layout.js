import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Query PDF",
  description: "Upload a PDF or ask a question related to the content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="https://www.svgrepo.com/show/255818/pdf.svg" type="image/x-icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
