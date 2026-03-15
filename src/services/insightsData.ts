import { CyclePhase, InsightCategory } from "../types";

export const INSIGHTS: InsightCategory[] = [
  {
    id: "understanding",
    title: "Understanding the Cycle",
    icon: "book",
    items: [
      {
        id: "u1",
        title: "What Happens During Menstruation",
        content:
          "The uterine lining sheds, causing bleeding that typically lasts 3-7 days. Hormone levels (estrogen and progesterone) are at their lowest, which can cause fatigue, cramps, and lower energy.",
        phase: CyclePhase.Menstrual,
      },
      {
        id: "u2",
        title: "The Follicular Phase",
        content:
          "After bleeding stops, estrogen rises steadily. This triggers the growth of a new egg follicle in the ovary. Energy, mood, and creativity tend to peak. Many people feel their best during this phase.",
        phase: CyclePhase.Follicular,
      },
      {
        id: "u3",
        title: "The Luteal Phase",
        content:
          "After ovulation, progesterone rises to prepare the uterus for a potential pregnancy. This hormone shift can cause bloating, breast tenderness, mild mood changes, and food cravings.",
        phase: CyclePhase.Luteal,
      },
      {
        id: "u4",
        title: "Premenstrual Phase (PMS)",
        content:
          "In the final days before the period, both estrogen and progesterone drop sharply. This hormonal crash can trigger irritability, sadness, anxiety, headaches, and physical discomfort. Over 150 symptoms have been documented.",
        phase: CyclePhase.PMS,
      },
      {
        id: "u5",
        title: "Why Cycle Length Varies",
        content:
          "Normal cycles range from 21 to 35 days. Stress, sleep, diet, exercise, illness, and travel can all cause variations. Irregular cycles are common and usually not a cause for concern unless they're very irregular.",
      },
    ],
  },
  {
    id: "supportive",
    title: "How to Be Supportive",
    icon: "heart",
    items: [
      {
        id: "s1",
        title: "During Menstruation",
        content:
          "Offer a heating pad or hot water bottle for cramps. Suggest cozy activities like watching a movie. Don't take low energy personally. Have pain relief available. Bring her favorite comfort food.",
        phase: CyclePhase.Menstrual,
      },
      {
        id: "s2",
        title: "During the Follicular Phase",
        content:
          "This is a great time for date nights and social activities. Energy is high, so plan active outings if she's up for it. She may be more open to trying new things and having deep conversations.",
        phase: CyclePhase.Follicular,
      },
      {
        id: "s3",
        title: "During the Luteal Phase",
        content:
          "Be patient with mood shifts — they're hormonal, not personal. Offer to help with tasks that feel overwhelming. Light exercise together (a walk) can help. Don't point out mood changes; just be supportive.",
        phase: CyclePhase.Luteal,
      },
      {
        id: "s4",
        title: "During PMS",
        content:
          "Stock up on her favorite snacks. Give extra space if needed, but also be available. Avoid starting difficult conversations. Small gestures (making tea, a foot rub) go a long way. Validate her feelings.",
        phase: CyclePhase.PMS,
      },
      {
        id: "s5",
        title: "General Tips",
        content:
          "Never use the cycle to dismiss her feelings ('Are you on your period?'). Track to understand, not to control. Ask what she needs rather than assuming. Educate yourself — the fact that you're using this app is already a great step.",
      },
    ],
  },
  {
    id: "myths",
    title: "Common Myths Debunked",
    icon: "alert-circle",
    items: [
      {
        id: "m1",
        title: '"PMS is just mood swings"',
        content:
          "PMS includes over 150 documented symptoms: headaches, bloating, joint pain, insomnia, appetite changes, difficulty concentrating, and more. Mood changes are just the most visible part.",
      },
      {
        id: "m2",
        title: '"Cycles are always 28 days"',
        content:
          "28 days is just an average. Normal cycles range from 21 to 35 days, and it's common for the same person's cycle to vary by several days month to month. That's why tracking is so valuable.",
      },
      {
        id: "m3",
        title: '"Periods sync up between friends"',
        content:
          "Despite being widely believed, period syncing (the McClintock effect) has not been reliably supported by scientific studies. Apparent syncing is likely due to mathematical overlap of different cycle lengths.",
      },
      {
        id: "m4",
        title: '"Exercise makes cramps worse"',
        content:
          "Light to moderate exercise actually helps reduce cramp severity by releasing endorphins and improving blood flow. Heavy exercise isn't recommended, but walking, yoga, and stretching can provide relief.",
      },
    ],
  },
  {
    id: "medical",
    title: "When to Suggest Medical Attention",
    icon: "medkit",
    items: [
      {
        id: "d1",
        title: "Heavy or Prolonged Bleeding",
        content:
          "If periods regularly last more than 7 days, require changing a pad/tampon every hour, or include large clots, it may indicate a condition like fibroids or a hormonal imbalance worth investigating.",
      },
      {
        id: "d2",
        title: "Severe Pain",
        content:
          "Pain that prevents normal activities, doesn't respond to over-the-counter pain relief, or gets progressively worse could indicate endometriosis, adenomyosis, or other conditions. A doctor can help.",
      },
      {
        id: "d3",
        title: "Missed Periods",
        content:
          "Missing three or more consecutive periods (when not pregnant) is called amenorrhea and can be caused by stress, extreme weight changes, thyroid issues, or PCOS. It's worth a medical check-up.",
      },
      {
        id: "d4",
        title: "PMDD (Premenstrual Dysphoric Disorder)",
        content:
          "If PMS symptoms are so severe they interfere with work, relationships, or daily life — especially deep depression, anxiety, or rage — it could be PMDD, a treatable medical condition affecting 3-8% of people who menstruate.",
      },
    ],
  },
];

export function getInsightsForPhase(phase: CyclePhase): InsightCategory[] {
  return INSIGHTS.map((category) => ({
    ...category,
    items: category.items.filter((item) => !item.phase || item.phase === phase),
  })).filter((category) => category.items.length > 0);
}
