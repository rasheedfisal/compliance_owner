import React from "react";
type PageProps = {
  params: {
    DId: string;
  };
};
const page = ({ params: { DId } }: PageProps) => {
  return <div>{DId}</div>;
};

export default page;
