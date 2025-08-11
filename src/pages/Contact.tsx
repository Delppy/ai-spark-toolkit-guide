
import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedButton from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
  category: string;
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
      category: '',
    },
  });

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@aitouse.app';
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    console.log('Contact form submitted:', data);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out! We'll get back to you within 24–48 hours.",
      });
      form.reset();
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-muted to-secondary/10 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <AnimatedButton asChild variant="ghost" size="sm" className="mr-2">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </AnimatedButton>
            <h1 className="text-2xl font-bold text-primary">Contact Us</h1>
          </div>

          {/* Contact Options */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <button
                onClick={handleEmailClick}
                className="w-full flex items-center p-4 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-5 h-5 mr-3 text-accent" />
                <div className="text-left">
                  <div className="font-medium text-foreground">📧 Email Us</div>
                  <div className="text-sm text-muted-foreground">support@aitouse.app</div>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    rules={{ required: "Full name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email address"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    rules={{ required: "Please select a category" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="prompt">Prompt Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us how we can help you..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AnimatedButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </AnimatedButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
