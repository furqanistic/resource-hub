// File: client/src/components/HomePage/ContactForm.jsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/LanguageContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const ContactForm = () => {
  const { t } = useLanguage()
  const formSchema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(2, { message: t('home.validation.firstNameMin') }),
        lastName: z.string().min(2, { message: t('home.validation.lastNameMin') }),
        email: z.string().email({ message: t('home.validation.emailInvalid') }),
        feedback: z.string().min(10, { message: t('home.validation.feedbackMin') }),
      }),
    [t]
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
    setIsSubmitting(false)
    setIsSuccess(true)
    reset()
    setTimeout(() => setIsSuccess(false), 5000)
  }

  return (
    <section className="relative overflow-hidden bg-[var(--site-background)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="form-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 gap-6 rounded-[2rem] bg-[var(--site-primary-soft)]/28 p-6 sm:p-8 lg:grid-cols-12 lg:gap-7 lg:p-10">
                <div className="lg:col-span-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-4 text-2xl font-medium leading-[1.15] tracking-tight text-[var(--site-primary)] sm:text-3xl"
                  >
                    {t('home.contactTitle')}
                  </motion.h2>
                  <p className="max-w-sm text-sm leading-relaxed text-[var(--site-text-soft)] sm:text-base">{t('home.contactSubtitle')}</p>
                </div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08, duration: 0.6 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 lg:col-span-8"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-medium text-[var(--site-text)]">
                        {t('home.contactFirstName')}
                      </Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className="h-12 rounded-2xl border-transparent bg-[var(--site-background)]/90 text-[var(--site-text)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--site-primary-soft)]"
                      />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-medium text-[var(--site-text)]">
                        {t('home.contactLastName')}
                      </Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className="h-12 rounded-2xl border-transparent bg-[var(--site-background)]/90 text-[var(--site-text)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--site-primary-soft)]"
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium text-[var(--site-text)]">
                      {t('home.contactEmail')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="h-12 rounded-2xl border-transparent bg-[var(--site-background)]/90 text-[var(--site-text)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--site-primary-soft)]"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback" className="font-medium text-[var(--site-text)]">
                      {t('home.contactFeedback')}
                    </Label>
                    <Textarea
                      id="feedback"
                      {...register('feedback')}
                      className="min-h-36 rounded-2xl border-transparent bg-[var(--site-background)]/90 text-[var(--site-text)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--site-primary-soft)]"
                    />
                    {errors.feedback && <p className="text-sm text-destructive">{errors.feedback.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-full bg-[var(--site-primary)] text-base font-medium text-white transition-opacity hover:opacity-90"
                  >
                    {isSubmitting ? t('home.contactSubmitting') : t('home.contactSubmit')}
                  </Button>
                </motion.form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center space-y-4 rounded-[2rem] bg-[var(--site-primary-soft)]/28 py-16 text-center"
            >
              <CheckCircle2 className="mb-2 h-16 w-16 text-[var(--site-primary)]" />
              <h3 className="text-2xl font-semibold text-[var(--site-text)]">{t('home.contactSuccessTitle')}</h3>
              <p className="max-w-sm text-[var(--site-text-soft)]">{t('home.contactSuccessBody')}</p>
              <Button variant="link" onClick={() => setIsSuccess(false)} className="h-auto p-0 font-medium text-[var(--site-primary)]">
                {t('home.contactSendAnother')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ContactForm
