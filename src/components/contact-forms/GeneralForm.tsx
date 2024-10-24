import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const generalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  eventDate: z.date({
    required_error: "Date of event is required",
  }),
  message: z.string().min(1, "Message is required"),
});

type GeneralFormProps = {
  onSubmit: (values: z.infer<typeof generalFormSchema>) => Promise<void>;
};

export default function GeneralForm({ onSubmit }: GeneralFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
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
      duration: 0.4,
      stagger: 0.125,
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
          Thank you for reaching out to Legend Has It. Please take a minute and
          fill out the form below to give us a better understanding of how we
          can help.
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
          name="message"
          render={({ field }) => (
            <FormItem className="form-field w-full opacity-0">
              <FormLabel>Message</FormLabel>
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
