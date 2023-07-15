import { StateContextProvider } from "@/context/AppConext";
import ReactQueryWrapper from "./ReactQueryWrapper";

import "datatables.net-dt/css/jquery.dataTables.min.css";
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
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css"
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
