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
  FormLabel,
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

      gsap.set("#event-form", {
        opacity: 0,
      });

      tl.current = gsap.timeline({});
      tl.current.to("#event-form", {
        delay: 0.15,
        duration: 0.25,
        opacity: 1,
        ease: "sine.inOut",
      });
    }, []);

    return (
      <Form {...form}>
        <form
          ref={formRef}
          id="event-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-3 opacity-0 md:w-[550px]"
        >
          <p className="text-pretty font-hypatia text-customCream">
            Thank you for inquiring about hosting your special event at Legend
            Has It. We appreciate your interest and look forward to helping you
            create a memorable experience. Please complete this form to give us
            a better understanding of your needs and requests. We will get back
            to you shortly with any additional questions, information and/or
            associated fees.
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Name
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Email
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Phone
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Date of event
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <DatePicker
                    value={field.value}
                    onChange={(date: Date | undefined) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Time of interest: (1-4 pm, 3-10 pm, etc.)
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Type of event
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="border border-customGold font-hypatia text-customCream">
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-screen bg-customCream font-hypatia text-customNavy">
                    <SelectItem value="meeting" className="max-w-screen">
                      Meeting / Workspace (2 hour minimum)
                    </SelectItem>
                    <SelectItem value="birthday" className="max-w-screen">
                      Birthday / Graduation / Wedding (4 hour minimum)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Number of guests
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl className="border border-customGold font-hypatia text-customCream">
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-screen bg-customCream font-hypatia text-customNavy">
                    {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="max-w-screen text-lg"
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="musicType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  Music options
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="border border-customGold font-hypatia text-customCream">
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="max-h-[80vh] max-w-[95vw] bg-customCream font-hypatia text-customNavy"
                    position="popper"
                    side="bottom"
                    align="start"
                  >
                    <SelectItem
                      value="dj"
                      className="whitespace-normal text-wrap"
                    >
                      I am interested in having a DJ (Additional cost
                      associated).
                    </SelectItem>
                    <SelectItem
                      value="personal"
                      className="whitespace-normal text-wrap"
                    >
                      I will play music from my personal device.
                    </SelectItem>
                    <SelectItem
                      value="house"
                      className="whitespace-normal text-wrap"
                    >
                      I will listen to what the bartender is playing from the
                      house vinyl collection (No requests, please).
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customCream">
                  What else should we know?
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mx-auto w-full rounded-sm border border-customGold bg-transparent p-3 font-bigola text-2xl text-customCream active:bg-customNavy active:text-customCream sm:w-fit md:p-6 md:hover:bg-customCream md:hover:text-customNavy"
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
