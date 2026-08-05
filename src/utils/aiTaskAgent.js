// Autonomous Backend AI Task Generation Agent Module

export function parseCampaignPrompt(prompt, globalRates) {
  if (!prompt || typeof prompt !== 'string') return [];

  const text = prompt.trim();
  const tasks = [];

  // Line-by-line URL + Comment pair parser
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentUrl = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line contains a Reddit URL
    const urlMatch = line.match(/(https?:\/\/(www\.|old\.|new\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/comments\/[^\s]+)/i);

    if (urlMatch) {
      currentUrl = urlMatch[1];
    } else if (currentUrl) {
      // Current line is the comment text following a Reddit URL
      const commentText = line.replace(/^[\[\(]|[\]\)]$/g, '').trim();

      if (commentText) {
        // Extract Subreddit name
        const subMatch = currentUrl.match(/reddit\.com\/r\/([a-zA-Z0-9_]+)/i);
        const subreddit = subMatch ? `r/${subMatch[1]}` : 'r/reddit';

        // Teaser text is simply the comment content directly (no 'Drop comment in' prefix!)
        const teaserText = commentText;

        tasks.push({
          id: `ai-task-${Date.now()}-${tasks.length + 1}`,
          type: 'REDDIT_COMMENT',
          subreddit,
          targetPostUrl: currentUrl,
          teaserText,
          contentToPost: commentText,
          reward: globalRates?.commentRate || 1.00,
          timeLimitMins: globalRates?.defaultTimerMins || 360,
          guidelines: 'Account age > 30 days. Must stay live for 24h. Post comment as specified.',
          generatedBy: 'AI Agent Multi-Link Parser'
        });

        currentUrl = null; // Reset for next pair
      }
    }
  }

  // Fallback for general campaign prompt if no line-by-line pairs were found
  if (tasks.length === 0) {
    const subMatch = text.match(/r\/([a-zA-Z0-9_]+)/i);
    const detectedSub = subMatch ? `r/${subMatch[1]}` : 'r/technology';

    const urlMatch = text.match(/(https?:\/\/(www\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/comments\/[^\s]*)/i);
    const targetUrl = urlMatch ? urlMatch[1] : `https://www.reddit.com/${detectedSub}/comments/ai_task_generation`;

    const isPost = text.toLowerCase().includes('post');
    const defaultType = isPost ? 'REDDIT_POST' : 'REDDIT_COMMENT';
    const defaultReward = isPost ? (globalRates?.postRate || 2.00) : (globalRates?.commentRate || 1.00);

    tasks.push({
      id: `ai-task-${Date.now()}-1`,
      type: defaultType,
      subreddit: detectedSub,
      targetPostUrl: targetUrl,
      teaserText: text,
      contentToPost: text,
      reward: defaultReward,
      timeLimitMins: globalRates?.defaultTimerMins || 360,
      guidelines: 'Account age > 30 days. Must stay live for 24h. No spam.',
      generatedBy: 'AI Agent Single Prompt'
    });
  }

  return tasks;
}
