import { MessageCardProps } from "@/data/messages";
import Divider from "../divider/Divider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MessageDetailContent from "./MessageDetailContent";

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  fetchMessages,
  index,
}) => {
  return (
    <AccordionItem
      value={`Message #${index}`}
      className="border-t-2 border-black"
    >
      <AccordionTrigger>
        <div className="flex w-full justify-between text-nowrap pr-3 text-base font-semibold capitalize md:pr-6 md:text-xl">
          <div className="flex gap-1">
            <p>{message.name}</p>
          </div>
          <Divider borderColor="grey" />
          <div>
            <p className="flex items-center gap-3 md:gap-6">
              {new Date(message.sentAt).toLocaleDateString("en-US", {
                timeZone: "UTC",
              })}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-black py-3">
        <MessageDetailContent message={message} fetchMessages={fetchMessages} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default MessageCard;
