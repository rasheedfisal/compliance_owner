"use client";
import React, { useState } from "react";
import { useStateContext } from "@/context/AppConext";
import { usePathname, useRouter } from "next/navigation";
import useUpdateEffect from "@/hooks/useUpdateEffect";

const ExludedRoutes = ["/home", "/verified"];

type Props = {
  children: React.ReactNode;
};
const Verified = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const stateContext = useStateContext();
  const [isVerified, setIsVerified] = useState(true);

  useUpdateEffect(() => {
    if (!ExludedRoutes.includes(pathname)) {
      if (stateContext.state.authUser?.email_verified_at === null) {
        setIsVerified(false);
      }
    }
  }, [pathname]);

  return <>{isVerified ? children : router.push("/verified")}</>;
};

export default Verified;
