import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Privacy Policy | Blaq Gurl Moves',
  description:
    'Learn how Blaq Gurl Moves collects, uses, and protects your personal information.',
}

const sections = [
  {
    title: 'What we collect',
    paragraphs: [
      <><strong>When you contact us.</strong> Your name, email address and phone number, and anything you tell us about a trip — which trips you&apos;re interested in, whether you&apos;re sharing a room, whether you&apos;ve travelled internationally before, dietary needs, and any assistance you&apos;d like us to plan for.</>,
      <><strong>When you talk to the concierge.</strong> The concierge is an AI assistant, not a person. It keeps the questions you answer and a short summary of the conversation so that someone on our team can follow up, and so the concierge recognises you if you come back. Conversations may be processed by our AI providers to generate replies, and are stored with our CRM provider.</>,
      <><strong>When you reserve a trip.</strong> The details you submit on the reservation form, and the record of the deposit if you pay one. Card payments are handled by Stripe — we never see or store your card number.</>,
      <><strong>When you simply visit.</strong> Our web host keeps standard technical logs (IP address, browser, pages requested). If we run analytics or advertising measurement, this policy will name those tools and how to opt out.</>,
    ],
  },
  {
    title: 'The “remember me” part',
    paragraphs: [
      'If you use the concierge, your browser stores a random identifier for this site. It contains no personal details. It lets the concierge recognise you on a later visit — so you don’t repeat yourself, and so we can pick up where we left off. It stays in your browser until you clear it. Choosing not to use the concierge means none of this is created.',
    ],
  },
  {
    title: 'What we use it for',
    bullets: [
      'To answer you and follow up about the trip you asked about.',
      'To plan the trip: room sharing, dietary needs, accessibility.',
      'To send you the information you asked for, and to take a deposit if you choose to pay one.',
      'To send trip updates and marketing only if you opted in. You can opt out of marketing emails at any time using the link in any email, or by asking us.',
    ],
  },
  {
    title: 'Who we share it with',
    paragraphs: [
      'We use service providers to run this: web hosting, an AI voice and chat provider for the concierge, a CRM and automation platform, an email provider, and Stripe for payments. They process data on our instructions. We do not sell your personal information.',
      'We may disclose information if the law requires it, or to protect someone’s safety.',
    ],
  },
  {
    title: 'Text messages',
    paragraphs: [
      'If you agree to receive texts, you’ll get messages about the trip you asked about. Message and data rates may apply. Reply STOP to stop. We will not text you because you gave us a phone number on a form — only if you ticked the consent box or asked us to text you.',
    ],
  },
  {
    title: 'Health and accessibility information',
    paragraphs: [
      'If you tell us about a health need or assistance you require, we use it only to plan the trip and share it only with the people who need it to arrange that. You can tell us the minimum — we don’t need a diagnosis.',
    ],
  },
  {
    title: 'How long we keep it',
    paragraphs: [
      'Conversations and contact details are kept while you’re a customer or in contact with us, and for a reasonable period afterwards for records and legal obligations. You can ask us to delete what we hold (below).',
    ],
  },
  {
    title: 'Your choices',
    paragraphs: [
      'You can ask to see, correct, or delete the personal information we hold about you, and ask us to stop contacting you. Email [EMAIL] and we’ll respond within 30 days. If you’re in a region with specific privacy rights (for example California or the EU/UK), you may have additional rights, including the right to object to certain processing.',
    ],
  },
  {
    title: 'Children',
    paragraphs: ['Our trips are for adults. We don’t knowingly collect information from anyone under 18.'],
  },
  {
    title: 'Security',
    paragraphs: [
      'Access is limited to the people who need it, and our systems require authentication. No system is perfectly secure, but we take this seriously.',
    ],
  },
  {
    title: 'Changes',
    paragraphs: [
      'If this policy changes, we’ll update the date above and, for significant changes, tell you by email.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: ['[BUSINESS NAME] · [ADDRESS] · [EMAIL] · [PHONE]'],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Blaq Gurl Moves</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Draft for review. Not legal advice. Fill in the bracketed fields, have it read by someone qualified, then publish it at blaqgurlmoves.com/privacy and link it from the footer and from every form.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">Last updated: [DATE]</p>
          <p className="mt-8 border-l-2 border-primary pl-5 leading-relaxed text-foreground/80">
            Blaq Gurl Moves (&quot;we&quot;, &quot;us&quot;) runs group trips. This policy explains what we collect when you visit blaqgurlmoves.com, use the concierge, or reserve a trip — and what we do with it.
          </p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title} aria-labelledby={`privacy-${section.title}`}>
                <h2 id={`privacy-${section.title}`} className="font-serif text-2xl font-bold text-foreground">
                  {section.title}
                </h2>
                {section.paragraphs && (
                  <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-7 text-muted-foreground">
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
