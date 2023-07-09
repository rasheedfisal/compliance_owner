"use client";
import React from "react";
import { links } from "@/data/siteInfo";
import NavLinkII from "@/components/NavLinkII";
type MobileMainProps = {
  isMobileMainMenuOpen: boolean;
};
const MobileMainMenu = ({ isMobileMainMenuOpen }: MobileMainProps) => {
  return (
    <div
      className={`border-b md:hidden dark:border-primary-darker ${
        !isMobileMainMenuOpen ? "hidden" : ""
      }`}
    >
      <nav aria-label="Main" className="px-2 py-4 space-y-2">
        {/*  <!-- Dashboards links --> */}

        {links.map((item) => (
          <NavLinkII
            key={item.title}
            title={item.title}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </nav>
    </div>
  );
};

export default MobileMainMenu;
