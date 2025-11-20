"use client";
import { Event, PreloadedMedia } from "@/data/events";
import EventCard from "@/components/event-card/EventCard";

export default function EventList({
  events,
  preloadedMedia,
  eventRefs,
  emptyMessageRef,
  upcoming,
}: {
  events: Event[];
  preloadedMedia: Map<string, PreloadedMedia>;
  eventRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  emptyMessageRef: React.RefObject<HTMLDivElement>;
  upcoming: boolean;
}) {
  const message = upcoming
    ? "Stay tuned for upcoming events!"
    : "No past events found.";

  return events.length > 0 ? (
    <div className="flex flex-col gap-6">
      {events.map((event, idx) => (
        <div className="w-full" key={event._id}>
          <div
            ref={(el) => {
              if (el) {
                eventRefs.current[idx] = el;
              }
            }}
            className={`mx-auto w-full`}
          >
            <EventCard
              key={idx}
              event={event}
              preloadedMedia={preloadedMedia.get(event._id) || undefined}
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <EmptyMessage message={message} refProp={emptyMessageRef} />
    </div>
  );
}

const EmptyMessage = ({
  message,
  refProp,
}: {
  message: string;
  refProp: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={refProp}
    className="flex h-[50vh] w-full flex-col items-center justify-center"
  >
    <h2 className="my-3 text-center font-bigola text-3xl text-customNavy md:text-4xl">
      {message}
    </h2>
  </div>
);
