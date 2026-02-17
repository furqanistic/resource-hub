// File: client/src/components/HomePage/ContactForm.jsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(data);
        setIsSubmitting(false);
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <section className="relative bg-white py-24 px-4 overflow-hidden">
            <div className="max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-14">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="text-3xl sm:text-4xl font-medium text-black tracking-tight leading-[1.2]"
                                >
                                    Do you have a suggested resource that we
                                    <br className="hidden sm:block" />
                                    should know about? Let us know!
                                </motion.h2>
                            </div>

                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.8 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-black font-medium">First name</Label>
                                        <Input
                                            id="firstName"
                                            {...register("firstName")}
                                            className="bg-white border-black/20 focus-visible:ring-1 focus-visible:ring-[#03385e] focus-visible:border-[#03385e] transition-all text-black rounded-none h-11 shadow-none"
                                        />
                                        {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-black font-medium">Last name</Label>
                                        <Input
                                            id="lastName"
                                            {...register("lastName")}
                                            className="bg-white border-black/20 focus-visible:ring-1 focus-visible:ring-[#03385e] focus-visible:border-[#03385e] transition-all text-black rounded-none h-11 shadow-none"
                                        />
                                        {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-black font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="bg-white border-black/20 focus-visible:ring-1 focus-visible:ring-[#03385e] focus-visible:border-[#03385e] transition-all text-black rounded-none h-11 shadow-none"
                                    />
                                    {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="feedback" className="text-black font-medium">Feedback</Label>
                                    <Textarea
                                        id="feedback"
                                        {...register("feedback")}
                                        className="bg-white border-black/20 focus-visible:ring-1 focus-visible:ring-[#03385e] focus-visible:border-[#03385e] min-h-40 transition-all text-black rounded-none shadow-none"
                                    />
                                    {errors.feedback && <p className="text-destructive text-sm">{errors.feedback.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#03385e] text-white hover:bg-[#03385e]/90 shadow-none h-12 transition-all rounded-none font-medium text-base"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </motion.form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-message"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="py-12 flex flex-col items-center text-center space-y-4"
                        >
                            <CheckCircle2 className="w-16 h-16 text-[#03385e] mb-2" />
                            <h3 className="text-2xl font-semibold text-black">Thank You!</h3>
                            <p className="text-slate-600 max-w-sm">
                                Your message has been sent successfully. We'll get back to you soon.
                            </p>
                            <Button 
                                variant="link" 
                                onClick={() => setIsSuccess(false)}
                                className="text-[#03385e] font-medium p-0 h-auto"
                            >
                                Send another message
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ContactForm;
