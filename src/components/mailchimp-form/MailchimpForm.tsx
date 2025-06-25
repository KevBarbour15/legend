import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailchimpFormSchema, MailchimpFormData } from "@/data/forms";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MailchimpForm = ({
  setShouldShow,
}: {
  setShouldShow: (shouldShow: boolean) => void;
}) => {
  const { toast } = useToast();

  const form = useForm<MailchimpFormData>({
    resolver: zodResolver(mailchimpFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: MailchimpFormData) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      if (response.ok) {
        form.reset();
        toast({
          title: "Thank you for subscribing!",
        });
        setShouldShow(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to subscribe to Mailchimp:", errorData.error);
      }
    } catch (error) {
      console.error("Error subscribing to Mailchimp:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full grow flex-row gap-3 font-hypatia"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl className="truncate rounded-md border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    {...field}
                    placeholder="Enter email to receive exclusive updates..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="rounded-md border border-transparent bg-customNavy font-bigola text-[#f5f5f5] transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-[#f5f5f5] md:hover:text-customNavy md:active:bg-customGold"
          >
            Subscribe
          </Button>
        </form>
      </Form>
    </>
  );
};

export default MailchimpForm;
