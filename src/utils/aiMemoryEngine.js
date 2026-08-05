// Autonomous AI Memory Base Engine v3.0

export const DEFAULT_AI_MEMORIES = [
  {
    id: 'mem-01',
    category: 'TITLE',
    title: 'FashionReps / Yupoo Post Title Pattern',
    pattern: '[QC/Review] {Item_Name} from {Seller_Name} - {Key_Detail} (In-hand thoughts & High-Res Drive Photos inside)',
    description: 'Organic title structure used for clothing/reps reviews with seller attribution and in-hand photo notes.'
  },
  {
    id: 'mem-02',
    category: 'TITLE',
    title: 'Tech & App Launch Title Pattern',
    pattern: 'Showcase: Built {App_Name} - {Key_Benefit} with zero-trust microservices [Walkthrough + Live Demo]',
    description: 'Natural title structure for developer showcase and product launches on r/SideProject.'
  },
  {
    id: 'mem-03',
    category: 'TITLE',
    title: 'Auto Repair & Off-Road Title Pattern',
    pattern: 'Honest review after 6 months: Testing {Part_Name} on my {Vehicle_Model} [Before & After Photos]',
    description: 'Authentic mechanic/car enthusiast review title without hype words.'
  },
  {
    id: 'mem-04',
    category: 'SUBREDDIT',
    title: 'Fashion & Yupoo Album Subreddits',
    pattern: 'r/FashionReps, r/FlexReps, r/DesignerReps, r/RepSneakers',
    description: 'Primary target subreddits for Yupoo album product links and streetwear reviews.'
  },
  {
    id: 'mem-05',
    category: 'SUBREDDIT',
    title: 'Tech, SaaS & Side Project Subreddits',
    pattern: 'r/SideProject, r/technology, r/webdev, r/SaaS',
    description: 'Target subreddits for developer tools, SaaS applications, and tech discussions.'
  },
  {
    id: 'mem-06',
    category: 'BODY',
    title: 'Yupoo / Clothing Product Review Body Layout',
    pattern: `Hey everyone! Received my package from {Seller_Name} recently.\n\n` +
             `**Item / Link**: {Product_URL}\n` +
             `**Size / Fit**: TTS (True to Size), relaxed fit.\n` +
             `**Quality & Material**: Stitching is clean, heavy fabric weight (400gsm), graphics are sharp.\n` +
             `**Shipping Time**: 8 days via Line-B.\n\n` +
             `All detailed photos are uploaded in exact order (01, 02, 03) in the attached Google Drive folder link!`,
    description: 'Structured body template with specs, fit, shipping time, and Google Drive photo link notes.'
  },
  {
    id: 'mem-07',
    category: 'BODY',
    title: 'Non-Humanish General Body Copy Guidelines',
    pattern: 'Use natural conversational tone. Avoid hype words like "revolutionary", "game-changer", "best ever". Include realistic pros/cons and clear photo sequence notes.',
    description: 'Core instruction for synthesizing non-robotic, authentic Reddit user text.'
  },
  {
    id: 'mem-08',
    category: 'FLAIR',
    title: 'Standard Reddit Post Flairs',
    pattern: '[QC], [Review], [In-Hand], [Showcase], [Discussion], [Guide/Tutorial]',
    description: 'Community flairs applied to post titles and tag metadata.'
  }
];

export function getStoredAiMemories() {
  try {
    const saved = localStorage.getItem('th_ai_memory_base');
    if (!saved) return DEFAULT_AI_MEMORIES;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_AI_MEMORIES;
  } catch (e) {
    return DEFAULT_AI_MEMORIES;
  }
}

export function saveAiMemories(memories) {
  try {
    localStorage.setItem('th_ai_memory_base', JSON.stringify(memories));
  } catch (e) {
    console.error("Failed to save AI memories", e);
  }
}
