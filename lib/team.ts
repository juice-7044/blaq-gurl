import type { TribeId } from './tribes'

export type TeamMember = {
  name: string
  role: string
  tribe: TribeId
  bio: string
}

export const team: TeamMember[] = [
  {
    name: 'Carly',
    role: 'CEO',
    tribe: 'A',
    bio: "Carly's ultimate goal is to own a Sports, Entertainment, and IP full-service agency. A former professional basketball player, she is launching the Black Economic Coalition to encourage entrepreneurship and financial literacy in the Black community. She earned her MBA in Media Management and believes life is meant to be lived, loved, and thoroughly enjoyed.",
  },
  {
    name: 'S. Nicole',
    role: 'COO',
    tribe: 'A',
    bio: 'Lovingly known as Nickey, she is an enterprising, detail-oriented account and business management specialist with five degrees, including a Master in Accountancy and an MBA. With over 20 years in customer service and project management, she travels the world to indulge in local culture and give back to others.',
  },
  {
    name: 'Jillian',
    role: 'CFO',
    tribe: 'A',
    bio: 'An experienced Accounting Manager with a demonstrated history in the consumer goods industry, skilled in internal audit, fixed assets, and account reconciliation. She holds an M.S. in Accounting and has been a vital part of a Fortune 500 accounting department for over 10 years.',
  },
  {
    name: 'Brittany',
    role: 'Education & Family Initiative Officer',
    tribe: 'B',
    bio: 'A former teacher and fervent advocate for educational reform to drive socioeconomic equity in public schools. She consults with administrators nationwide on strategies to improve teacher training. Brittany holds a BA in Neuroscience from Harvard University and is mother to Laila.',
  },
  {
    name: 'Ann',
    role: 'CIO',
    tribe: 'B',
    bio: 'As CEO of JMG, Ann brings a wealth of knowledge and creativity, positioning the company as a leader in online branding strategy. A serial entrepreneur and licensed insurance broker, she also serves as Executive Director of Lola Louis\u2019 Creative and Performing Arts, a 501(c)(3) in the Bronx.',
  },
  {
    name: 'Darlene',
    role: 'Spiritual & Holistic Advisor',
    tribe: 'B',
    bio: 'An operations professional with over 20 years of experience, "Goodie" ushers people of color into the technology and real estate industries. A co-host of the Termagant Talk podcast and founder of Until I Ascend, she is dedicated to the spiritual evolution of the masses.',
  },
  {
    name: 'Nia',
    role: 'Head of Travel & Itinerary',
    tribe: 'C',
    bio: 'A medical professional with 16 years of experience turned mini serial entrepreneur. Co-founder of JNS Commercial and Realty and Tranquil Hearts, and CEO of Silvur Lining Holdings. Her lifelong love of travel led her to found Silvur Lining Travel and craft experiences you will never forget.',
  },
  {
    name: 'Erika',
    role: 'Harmony & Audacity Guide',
    tribe: 'C',
    bio: 'Erika Parker-Smith, MFA, is a veteran technologist and technical writer turned spiritual and pleasure-based herbalist and death doula with Rebelmancy. A public speaker with She Has Audacity, she inspires audiences to curate harmony, audacious living, and play. As she says, "There\u2019s nothing more badass than healing."',
  },
  {
    name: 'Mocha',
    role: 'Spiritual & Holistic Advisor',
    tribe: 'D',
    bio: 'A medical professional with nearly 15 years of experience, event curator, and co-founder of The Living Room Event. A consummate student of law, journalism, and psychology, she brings spirituality, a knowledge of healing stones, meditation, and yoga to the sisterhood.',
  },
  {
    name: 'Amerrah',
    role: 'Personal Health & Hygiene Officer',
    tribe: 'D',
    bio: 'Founder and creator of four skincare and cosmetic companies, Amerrah handcrafts vegan, organic, and natural personal care products. A domestic violence survivor and advocate, she is passionate about teaching self-love and boosting confidence through skincare \u2014 one person at a time.',
  },
  {
    name: 'Kimani',
    role: 'Health & Hygiene Officer',
    tribe: 'D',
    bio: 'A sexual health and wellness expert with over ten years of study and experience, holding a BA in Psychology and an MA in Sexual Health. As founder of VForVCom, she provides free and low-cost resources to help individuals improve their intimate quality of life.',
  },
]
