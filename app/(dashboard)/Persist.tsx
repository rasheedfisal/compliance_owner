"use client";
import React, { useEffect, useState } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import Cookies from "js-cookie";
import { useStateContext } from "@/context/AppConext";

type Props = {
  children: React.ReactNode;
};
const Persist = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useAccessToken();
  const stateContext = useStateContext();
  const token = Cookies.get("AT");

  useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        await accessToken();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    stateContext.state.authUser === null && token
      ? verifyAccessToken()
      : setIsLoading(false);
  }, []);

  return <>{isLoading ? <p>Loading...</p> : children}</>;
};

export default Persist;
