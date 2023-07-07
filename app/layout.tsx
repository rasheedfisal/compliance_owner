import { StateContextProvider } from "@/context/AppConext";
import ReactQueryWrapper from "./ReactQueryWrapper";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance",
  description: "platform for security compliance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script>0</script>
        <ReactQueryWrapper>
          <StateContextProvider>{children}</StateContextProvider>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
