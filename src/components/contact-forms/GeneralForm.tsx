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
  GeneralFormProps,
  GeneralFormRef,
} from "@/data/forms";

const GeneralForm = forwardRef<GeneralFormRef, GeneralFormProps>(
  ({ onSubmit }, ref) => {
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

    useImperativeHandle(ref, () => ({
      reset: () => {
        form.reset();
      },
    }));

    useGSAP(() => {
      if (!formRef.current) return;

      gsap.fromTo(
        "#general-form",
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
          id="general-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-3 opacity-0 md:w-[550px]"
        >
          <p className="text-pretty font-hypatia text-lg leading-[1.15] text-customNavy">
            Thank you for reaching out to Legend Has It. Please take a minute
            and fill out the form below to give us a better understanding of how
            we can help.
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customNavy">
                  Name
                </FormLabel>
                <FormControl className="border-2 border-customNavy font-hypatia text-customNavy">
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
                <FormLabel className="font-bigola text-customNavy">
                  Email
                </FormLabel>
                <FormControl className="border-2 border-customNavy font-hypatia text-customNavy">
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
                <FormLabel className="font-bigola text-customNavy">
                  Phone
                </FormLabel>
                <FormControl className="border-2 border-customNavy font-hypatia text-customNavy">
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
              <FormItem className="w-full">
                <FormLabel className="font-bigola text-customNavy">
                  Message
                </FormLabel>
                <FormControl className="border-2 border-customNavy font-hypatia text-customNavy focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mx-auto rounded-sm border-2 border-customNavy bg-transparent font-bigola text-base text-customNavy backdrop-blur-sm transition-all duration-300 active:bg-customNavy active:text-customCream sm:w-fit md:hover:bg-customNavy md:hover:text-customCream"
          >
            Submit
          </Button>
        </form>
      </Form>
    );
  },
);

GeneralForm.displayName = "GeneralForm";

export default GeneralForm;
