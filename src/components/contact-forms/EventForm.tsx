import { useRef, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import {
  eventFormSchema,
  EventFormData,
  EventFormProps,
  EventFormRef,
} from "@/data/forms.ts";

const EventForm = forwardRef<EventFormRef, EventFormProps>(
  ({ onSubmit }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<EventFormData>({
      resolver: zodResolver(eventFormSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        message: "",
        eventDate: undefined,
        eventTime: "",
        eventType: undefined,
        guests: 1,
        musicType: undefined,
      },
    });
    const tl = useRef<gsap.core.Timeline | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        form.reset({
          name: "",
          email: "",
          phone: "",
          message: "",
          eventDate: undefined,
          eventTime: "",
          eventType: undefined,
          guests: 1,
          musicType: undefined,
        });
      },
    }));

    useGSAP(() => {
      if (!formRef.current) return;

      gsap.fromTo(
        "#event-form",
        {
          opacity: 0,
        },
        {
          delay: 0.35,
          duration: 0.25,
          opacity: 1,
          ease: "sine.inOut",
        },
      );
    }, []);

    return (
      <Form {...form}>
        <form
          ref={formRef}
          id="event-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-full flex-col space-y-3 opacity-0 lg:w-[720px]"
        >
          <p className="mb-6 text-pretty font-hypatia text-xl leading-[1.25] text-customNavy text-shadow-custom">
            Thank you for inquiring about hosting your special event at{" "}
            <span className="font-bigola">Legend Has It</span>. We appreciate
            your interest and look forward to helping you create a memorable
            experience. Please complete this form to give us a better
            understanding of your needs and requests. We will get back to you
            shortly with any additional questions, information and/or associated
            fees.
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="event-name"
                    placeholder="Name"
                    aria-label="Your full name"
                    aria-describedby="event-name-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="event-name-description" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="event-email"
                    type="email"
                    placeholder="Email"
                    aria-label="Your email address"
                    aria-describedby="event-email-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="event-email-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="event-phone"
                    type="tel"
                    placeholder="Phone"
                    aria-label="Your phone number"
                    aria-describedby="event-phone-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="event-phone-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DatePicker
                    placeholder="Date of event"
                    aria-label="Select event date"
                    aria-describedby="event-date-description"
                    value={field.value}
                    onChange={(date: Date | undefined) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage id="event-date-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="event-time"
                    placeholder="Time of interest (1-4 pm, 3-10 pm, etc.)"
                    aria-label="Preferred event time"
                    aria-describedby="event-time-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="event-time-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                    <SelectTrigger
                      id="event-type"
                      aria-label="Select event type"
                      aria-describedby="event-type-description"
                    >
                      <div className="truncate">
                        <SelectValue placeholder="Select event type..." />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-[95vw] font-bigola text-customNavy md:w-[550px]">
                    <SelectItem
                      value="meeting"
                      className="whitespace-normal text-wrap md:hover:text-customGold"
                    >
                      Meeting / Workspace (2 hour minimum)
                    </SelectItem>
                    <SelectItem
                      value="birthday"
                      className="whitespace-normal text-wrap md:hover:text-customGold"
                    >
                      Birthday / Graduation / Wedding / Holiday (4 hour minimum)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage id="event-type-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                    <SelectTrigger
                      id="event-guests"
                      aria-label="Select number of guests"
                      aria-describedby="event-guests-description"
                    >
                      <SelectValue placeholder="Select number of guests..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-[95vw] font-bigola text-customNavy md:w-[550px]">
                    {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="max-w-screen md:hover:text-customGold"
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage id="event-guests-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicType"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                    <SelectTrigger
                      id="event-music"
                      aria-label="Select music option"
                      aria-describedby="event-music-description"
                    >
                      <div className="truncate">
                        <SelectValue placeholder="Select music option..." />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="max-h-[80vh] max-w-[95vw] font-bigola text-customNavy md:w-[550px]"
                    position="popper"
                    side="bottom"
                    align="start"
                  >
                    <SelectItem
                      value="dj"
                      className="whitespace-normal text-wrap md:hover:text-customGold"
                    >
                      I am interested in having a DJ (Additional cost
                      associated).
                    </SelectItem>
                    <SelectItem
                      value="personal"
                      className="whitespace-normal text-wrap md:hover:text-customGold"
                    >
                      I will play music from my personal device.
                    </SelectItem>
                    <SelectItem
                      value="house"
                      className="whitespace-normal text-wrap md:hover:text-customGold"
                    >
                      I will listen to what the bartender is playing from the
                      house vinyl collection (No requests, please).
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage id="event-music-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Textarea
                    id="event-message"
                    placeholder="What else should we know?"
                    aria-label="Additional information"
                    aria-describedby="event-message-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="event-message-description" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mx-auto w-full rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-text sm:w-fit md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
          >
            Submit
          </Button>
        </form>
      </Form>
    );
  },
);

EventForm.displayName = "EventForm";

export default EventForm;
