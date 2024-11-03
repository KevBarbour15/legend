import { LoadingProps } from "@/data/loading.ts";

import { Progress } from "@/components/ui/progress";

const Loading: React.FC<LoadingProps> = ({ progress, message, loading }) => {
  return (
    <div
      id="event-subheading"
      className="flex h-[50vh] w-full flex-col items-center justify-center opacity-0"
    >
      <h2
        id="loading-text"
        className="mb-6 mt-3 font-bigola text-3xl text-customCream md:text-4xl"
      >
        {message}
      </h2>
      <Progress
        value={progress}
        className="w-[75vw] max-w-[350px] text-customCream"
      />
    </div>
  );
};

export default Loading;
