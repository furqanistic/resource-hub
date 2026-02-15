import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(data);
        setIsSubmitting(false);
        reset();
    };

    return (
        <section className="bg-background py-12 px-6">
            <div className="container mx-auto max-w-2xl text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-semibold text-foreground mb-12"
                >
                    Do you have a suggested resource that we should know about? Let us know!
                </motion.h2>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 text-left"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-foreground">First name</Label>
                            <Input
                                id="firstName"
                                {...register("firstName")}
                                className="bg-card border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                            />
                            {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-foreground">Last name</Label>
                            <Input
                                id="lastName"
                                {...register("lastName")}
                                className="bg-card border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                            />
                            {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="bg-card border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all text-foreground"
                        />
                        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feedback" className="text-foreground">Feedback</Label>
                        <Textarea
                            id="feedback"
                            {...register("feedback")}
                            className="bg-card border-white/10 focus-visible:ring-primary focus-visible:border-primary min-h-37.5 transition-all text-foreground"
                        />
                        {errors.feedback && <p className="text-destructive text-sm">{errors.feedback.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_-3px_var(--primary)] hover:shadow-[0_0_25px_-5px_var(--primary)] transition-all duration-300"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </motion.form>
            </div>
        </section>
    );
};

export default ContactForm;
