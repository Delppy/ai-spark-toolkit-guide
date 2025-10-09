import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import AnimatedButton from "@/components/ui/animated-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Mail, MessageSquare, Phone } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values
      });

      if (error) {
        console.error('Error sending email:', error);
        toast.error("Failed to send message. Please try again or email us directly.");
        return;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setTimeout(() => {
        form.reset();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to send message. Please try again or email us directly.");
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Get in touch with AiToUse. We're here to help with any questions about AI tools, features, or suggestions."
      />
      <div className="min-h-screen bg-gradient-to-br from-muted to-secondary/10 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <AnimatedButton asChild variant="ghost" size="sm" className="mr-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </AnimatedButton>
          </div>

          {/* Contact Form Card */}
          <div className="bg-card rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
              <p className="text-muted-foreground">
                Have a question or feedback? We'd love to hear from you!
              </p>
            </div>

            {/* Contact Methods */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg w-full max-w-xs">
                <Mail className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Email</span>
                <span className="text-xs text-muted-foreground">delppy@aitouse.app</span>
              </div>
            </div>

            {/* Contact Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please provide as much detail as possible.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AnimatedButton
                  type="submit"
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </AnimatedButton>
              </form>
            </Form>

            {/* FAQ Link */}
            <div className="mt-8 p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Looking for quick answers?
              </p>
              <AnimatedButton asChild variant="link" size="sm">
                <Link to="/help">
                  Visit our Help Center →
                </Link>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}