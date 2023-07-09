import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkIIProps = {
  title: string;
  icon: JSX.Element;
  path: string;
};

function NavLinkII({ title, icon, path }: NavLinkIIProps) {
  const pathname = usePathname();

  return (
    <div>
      <Link
        href={path}
        className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-primary-100 dark:hover:bg-primary ${
          pathname === path ? "bg-primary-100 dark:bg-primary" : ""
        }`}
        role="button"
        aria-haspopup="true"
        aria-expanded={pathname === path ? true : false}
      >
        <span aria-hidden="true">{icon}</span>
        <span className="ml-2 text-sm"> {title} </span>
      </Link>
    </div>
  );
}

export default NavLinkII;
