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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  baseFormSchema,
  FormData,
  DjFormProps,
  DjFormRef,
} from "@/types/forms";

const DjForm = forwardRef<DjFormRef, DjFormProps>(({ onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  const tl = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.reset();
    },
  }));

  useGSAP(() => {
    if (!formRef.current) return;

    gsap.set(".dj-form-field", {
      opacity: 0,
      y: 100,
    });

    tl.current = gsap.timeline({});
    tl.current.to(".dj-form-field", {
      delay: 0.15,
      duration: 0.2,
      stagger: 0.05,
      y: 0,
      opacity: 1,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-3 md:w-[550px]"
      >
        <p className="dj-form-field text-pretty font-hypatia text-customCream opacity-0">
          Thank you for your interest to DJ at Legend Has It. Please take a
          minute to fill out the form below so we can get to know you and your
          style. Below, please provide as much detail as possible in regard to
          your music style/genre(s), past experience, etc.
        </p>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="dj-form-field w-full opacity-0">
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
            <FormItem className="dj-form-field w-full opacity-0">
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
            <FormItem className="dj-form-field w-full opacity-0">
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
          name="message"
          render={({ field }) => (
            <FormItem className="dj-form-field w-full opacity-0">
              <FormLabel className="font-bigola text-customCream">
                Experience, style, etc
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
          className="dj-form-field mx-auto w-full rounded-lg border border-customGold bg-customNavy p-3 font-bigola text-2xl text-customCream opacity-0 sm:w-fit md:p-6 md:hover:bg-customCream md:hover:text-customNavy"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
});

export default DjForm;
