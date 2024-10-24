import { useRef } from "react";
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
import { eventFormSchema, EventFormData } from "@/types/forms.ts";

type EventFormProps = {
  onSubmit: (values: EventFormData) => Promise<void>;
};

export default function EventForm({ onSubmit }: EventFormProps) {
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

  useGSAP(() => {
    if (!formRef.current) return;

    gsap.set(".form-field", {
      x: "50%",
      opacity: 0,
      rotateX: 45,
    });

    gsap.to(".form-field", {
      delay: 0.15,
      duration: 0.2,
      stagger: 0.075,
      x: 0,
      opacity: 1,
      rotateX: 0,
    });
  }, []);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-3 md:w-[550px]"
      >
        <p className="form-field text-pretty font-hypatia text-customCream opacity-0">
          Thank you for inquiring about hosting your special event at Legend Has
          It. We appreciate your interest and look forward to helping you create
          a memorable experience. Please complete this form to give us a better
          understanding of your needs and requests. We will get back to you
          shortly with any additional questions, information and/or associated
          fees.
        </p>
        <div className="form-field w-full opacity-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Email</FormLabel>
              <FormControl>
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Phone</FormLabel>
              <FormControl>
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Date of event</FormLabel>
              <FormControl>
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Time of interest: (1-4 pm, 3-10 pm, etc.)</FormLabel>
              <FormControl>
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Type of event</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="meeting">
                    Meeting / Workspace (2 hour minimum)
                  </SelectItem>
                  <SelectItem value="birthday">
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Number of guests</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Music options</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dj">
                    I am interested in having a DJ (Additional cost associated).
                  </SelectItem>
                  <SelectItem value="personal">
                    I will play music from my personal device.
                  </SelectItem>
                  <SelectItem value="house">
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
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>What else should we know?</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="form-field mx-auto w-full rounded-lg border border-customGold bg-customNavy p-3 font-bigola text-2xl text-customGold opacity-0 sm:w-fit md:p-6 md:hover:bg-customCream md:hover:text-customNavy"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
