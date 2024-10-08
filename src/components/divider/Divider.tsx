import React from "react";

import { DividerProps } from "@/types/divider";

const Divider: React.FC<DividerProps> = ({ borderColor }) => {
  return (
    <div className="flex w-full items-center px-3 md:mx-6">
      <div
        className={`w-full border-t border-dashed ${borderColor}`}
        aria-hidden="true"
      ></div>
    </div>
  );
};

export default Divider;
