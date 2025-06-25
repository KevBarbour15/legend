import { LoadingProps } from "@/data/loading.ts";

import { Progress } from "@/components/ui/progress";

const Loading: React.FC<LoadingProps> = ({
  progress,
  message,
  textColor,
  borderColor,
}) => {
  return (
    <div
      className={`z-20 flex h-[50vh] w-full flex-col items-center justify-center ${textColor}`}
    >
      <h2 className="mb-3 text-center text-3xl drop-shadow-text md:text-4xl">
        {message}
      </h2>
      <Progress
        value={progress}
        className={`w-[75vw] max-w-[350px] border border-customNavy/20 drop-shadow-card`}
      />
    </div>
  );
};

export default Loading;
