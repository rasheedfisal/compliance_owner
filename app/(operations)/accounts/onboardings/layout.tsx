"use client";

import { useLocalStorage } from "@/hooks/useStorage";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useLoaded } from "@/hooks/useLoaded";
import { BounceLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useLocalStorage("dark", false);
  const loaded = useLoaded();

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    // setTheme(isDark as unknown as string);
  };
  const [color, setColor] = useLocalStorage("color", "cyan");
  const setColors = (color: string) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", `var(--color-${color})`);
    root.style.setProperty("--color-primary-50", `var(--color-${color}-50)`);
    root.style.setProperty("--color-primary-100", `var(--color-${color}-100)`);
    root.style.setProperty(
      "--color-primary-light",
      `var(--color-${color}-light)`
    );
    root.style.setProperty(
      "--color-primary-lighter",
      `var(--color-${color}-lighter)`
    );
    root.style.setProperty(
      "--color-primary-dark",
      `var(--color-${color}-dark)`
    );
    root.style.setProperty(
      "--color-primary-darker",
      `var(--color-${color}-darker)`
    );
    // setSelectedColor(color);
    // window.localStorage.setItem("color", color);
    setColor(color);
    //
  };
  useUpdateEffect(() => {
    setColors(color);
  }, []);

  return (
    <div className={isDark && loaded ? "dark" : "light"}>
      {/* // <!-- Loading screen --> */}
      {!loaded && (
        <div
          // x-ref="loading"

          className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold bg-white"
          // className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-primary-darker"
        >
          {/* Loading..... */}
          <BounceLoader size={50} color="#8b8d8d" speedMultiplier={3} />
        </div>
      )}
      <div className="flex flex-col items-center justify-start min-h-screen p-4 space-y-6  antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
        {/* <!-- Brand --> */}
        <a
          href="../index.html"
          className="inline-block text-3xl font-bold tracking-wider uppercase text-primary-dark dark:text-light"
        >
          OnBoarding
        </a>
        <main>
          <ToastContainer />
          {children}
        </main>
      </div>
    </div>
  );
}
