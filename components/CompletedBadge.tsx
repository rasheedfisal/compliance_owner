import React from "react";
type CmpProps = {
  isComplete: boolean | undefined;
};
const CompletedBadge = ({ isComplete }: CmpProps) => {
  const Badge = isComplete ? (
    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
      Completed
    </span>
  ) : (
    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
      Pending
    </span>
  );
  return Badge;
};

export default CompletedBadge;
