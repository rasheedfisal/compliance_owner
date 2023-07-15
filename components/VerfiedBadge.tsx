import React from "react";
type VerfiedProps = {
  verfiedDate: Date | undefined;
};
const VerfiedBadge = ({ verfiedDate }: VerfiedProps) => {
  const Badge = verfiedDate ? (
    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
      Verified
    </span>
  ) : (
    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
      Not Verfied
    </span>
  );
  return Badge;
};

export default VerfiedBadge;
