import { LoadingProps } from "@/data/loading.ts";

import { mirage } from "ldrs";

mirage.register();

const Loading: React.FC<LoadingProps> = ({ message, textColor }) => {
  return (
    <div
      className={`z-20 flex h-[50vh] w-full flex-col items-center justify-center ${textColor}`}
    >
      <h2 className="mb-6 text-center text-3xl md:text-4xl">{message}</h2>
      <l-mirage size="150" speed="2.5" color="#244154"></l-mirage>
    </div>
  );
};

export default Loading;
