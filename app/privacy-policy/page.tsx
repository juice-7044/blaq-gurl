import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Blaq Gurl Moves',
  description:
    'Learn how Blaq Gurl Moves collects, uses, and protects information when you visit our site, use the concierge, or reserve a trip.',
}

const sections = [
  {
    title: 'What we collect',
    paragraphs: [
      <><strong>When you contact us.</strong> Your name, email address and phone number, and anything you tell us about a trip — which trips you&apos;re interested in, whether you&apos;re sharing a room, whether you&apos;ve travelled internationally before, dietary needs, and any assistance you&apos;d like us to plan for.</>,
      <><strong>When you talk to the concierge.</strong> The concierge is an AI assistant, not a person. It keeps the questions you answer and a short summary of the conversation so someone on our team can follow up, and so the concierge recognises you if you come back. Conversations may be processed by our AI providers to generate replies, and are stored with our CRM provider.</>,
      <><strong>When you reserve a trip.</strong> The details you submit on the reservation form, and the record of the deposit if you pay one. Card payments are handled by Stripe — we never see or store your card number.</>,
      <><strong>When you simply visit.</strong> Our web host keeps standard technical logs (IP address, browser, pages requested). If we run analytics or advertising measurement, this policy will name those tools and how to opt out.</>,
    ],
  },
  {
    title: 'The “remember me” part',
    paragraphs: [
      <>If you use the concierge, your browser stores a random identifier for this site. It contains no personal details. It lets the concierge recognise you on a later visit — so you don&apos;t repeat yourself, and so we can pick up where we left off. It stays in your browser until you clear it. Choosing not to use the concierge means none of this is created.</>,
    ],
  },
  {
    title: 'What we use it for',
    paragraphs: [
      <>To answer you and follow up about the trip you asked about. To plan the trip: room sharing, dietary needs, accessibility. To send you the information you asked for, and to take a deposit if you choose to pay one. To send trip updates and marketing only if you opted in. You can opt out of marketing emails at any time using the link in any email, or by asking us.</>,
    ],
  },
  {
    title: 'Who we share it with',
    paragraphs: [
      <>We use service providers to run this: web hosting, an AI voice and chat provider for the concierge, a CRM and automation platform, an email provider, and Stripe for payments. They process data on our instructions. We do not sell your personal information.</>,
      <>We may disclose information if the law requires it, or to protect someone&apos;s safety.</>,
    ],
  },
  {
    title: 'Text messages',
    paragraphs: [
      <>If you agree to receive texts, you&apos;ll get messages about the trip you asked about. Message and data rates may apply. Reply STOP to stop. We will not text you because you gave us a phone number on a form — only if you ticked the consent box or asked us to text you.</>,
    ],
  },
  {
    title: 'Health and accessibility information',
    paragraphs: [
      <>If you tell us about a health need or assistance you require, we use it only to plan the trip and share it only with the people who need it to arrange that. You can tell us the minimum — we don&apos;t need a diagnosis.</>,
    ],
  },
  {
    title: 'How long we keep it',
    paragraphs: [
      <>Conversations and contact details are kept while you&apos;re a customer or in contact with us, and for a reasonable period afterwards for records and legal obligations. You can ask us to delete what we hold.</>,
    ],
  },
  {
    title: 'Your choices',
    paragraphs: [
      <>You can ask to see, correct, or delete the personal information we hold about you, and ask us to stop contacting you. Email <a className="font-medium text-primary underline underline-offset-4" href="mailto:info@blaqgurlmoves.com">info@blaqgurlmoves.com</a> and we&apos;ll respond within 30 days. If you&apos;re in a region with specific privacy rights (for example California or the EU/UK), you may have additional rights, including the right to object to certain processing.</>,
    ],
  },
  {
    title: 'Children',
    paragraphs: [<>Our trips are for adults. We don&apos;t knowingly collect information from anyone under 18.</>],
  },
  {
    title: 'Security',
    paragraphs: [<>Access is limited to the people who need it, and our systems require authentication. No system is perfectly secure, but we take this seriously.</>],
  },
  {
    title: 'Changes',
    paragraphs: [<>If this policy changes, we&apos;ll update the date above and, for significant changes, tell you by email.</>],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <header className="bg-primary px-4 pb-12 pt-32 text-primary-foreground md:px-8 md:pb-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">Blaq Gurl Moves</p>
            <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-primary-foreground/80">Last updated: November 25, 2026</p>
          </div>
        </header>
        <article className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
          <p className="mb-10 text-lg leading-relaxed text-foreground/80">
            Blaq Gurl Moves (&quot;we&quot;, &quot;us&quot;) runs group trips. This policy explains what we collect when you visit blaqgurlmoves.com, use the concierge, or reserve a trip — and what we do with it.
          </p>
          <div className="space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl font-bold text-foreground">{section.title}</h2>
                <div className="mt-3 space-y-4 leading-relaxed text-foreground/75">
                  {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">Contact</h2>
            <address className="mt-3 not-italic leading-relaxed text-foreground/75">
              BLAQ GURL MOVES · 5203 JUAN TABO BLVD. STE 2B, ALBUQUERQUE, NM 87111<br />
              <a className="font-medium text-primary underline underline-offset-4" href="mailto:info@blaqgurlmoves.com">INFO@BLAQGURLMOVES.COM</a> · <a className="font-medium text-primary underline underline-offset-4" href="tel:+15056662036">505-666-2036</a>
            </address>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
