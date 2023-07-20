"use client";
import React, { useEffect, useState } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import Cookies from "js-cookie";

type Props = {
  children: React.ReactNode;
};
const Persist = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useAccessToken();
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

    token ? verifyAccessToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <p>Loading...</p> : children}</>;
};

export default Persist;
