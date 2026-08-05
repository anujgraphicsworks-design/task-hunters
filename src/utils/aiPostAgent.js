// Autonomous AI Post Content & Media Synthesis Agent v3.0
import { getStoredAiMemories } from './aiMemoryEngine';

export function synthesizePostWithAgent({ productUrl, brandMemory, imageLinksInput, globalRates }) {
  if (!productUrl && !brandMemory) return null;

  const url = productUrl ? productUrl.trim() : 'https://example.com/product';
  const userMemory = brandMemory ? brandMemory.trim() : '';

  // Load AI Memory Base Rules
  const memoryBase = getStoredAiMemories();
  const titleMemories = memoryBase.filter(m => m.category === 'TITLE');
  const subMemories = memoryBase.filter(m => m.category === 'SUBREDDIT');
  const bodyMemories = memoryBase.filter(m => m.category === 'BODY');
  const flairMemories = memoryBase.filter(m => m.category === 'FLAIR');

  // Extract Subreddit or infer from Memory Base / Memory / URL
  const subMatch = (userMemory + ' ' + url).match(/r\/([a-zA-Z0-9_]+)/i);
  let detectedSub = subMatch ? `r/${subMatch[1]}` : '';

  if (!detectedSub) {
    const lower = (userMemory + ' ' + url).toLowerCase();
    if (lower.includes('yupoo') || lower.includes('swag') || lower.includes('shoe') || lower.includes('reps') || lower.includes('jacket') || lower.includes('hoodie')) {
      detectedSub = 'r/FashionReps';
    } else if (lower.includes('jeep') || lower.includes('car') || lower.includes('repair') || lower.includes('auto')) {
      detectedSub = 'r/Wrangler';
    } else if (lower.includes('tech') || lower.includes('ai') || lower.includes('app') || lower.includes('code')) {
      detectedSub = 'r/SideProject';
    } else if (subMemories.length > 0) {
      detectedSub = 'r/FashionReps';
    } else {
      detectedSub = 'r/Reddit';
    }
  }

  // Extract Seller / Product Name from URL
  const domainMatch = url.match(/https?:\/\/(www\.)?([^\/\s]+)/i);
  const domainName = domainMatch ? domainMatch[2] : 'Product';
  
  // Pick Flair
  const availableFlairs = flairMemories.length > 0 
    ? flairMemories[0].pattern.split(',').map(f => f.trim())
    : ['[QC]', '[Review]', '[In-Hand]', '[Showcase]'];
  const chosenFlair = availableFlairs[Math.floor(Math.random() * availableFlairs.length)];

  // Synthesize Organic Non-Humanish Post Title using Memory Base Patterns
  let postTitle = '';
  if (titleMemories.length > 0 && Math.random() > 0.3) {
    const randomTitlePattern = titleMemories[Math.floor(Math.random() * titleMemories.length)].pattern;
    postTitle = randomTitlePattern
      .replace('{Item_Name}', domainName)
      .replace('{Seller_Name}', 'SwagSupply')
      .replace('{Part_Name}', 'Upgrade Component')
      .replace('{Vehicle_Model}', 'Rig Setup')
      .replace('{App_Name}', 'Task Marketplace')
      .replace('{Key_Detail}', userMemory || 'In-hand photos & detailed review')
      .replace('{Key_Spec}', 'High quality materials')
      .replace('{Key_Benefit}', 'Fast processing');
    
    if (!postTitle.startsWith('[') && chosenFlair) {
      postTitle = `${chosenFlair} ${postTitle}`;
    }
  } else {
    postTitle = `${chosenFlair} Detailed Review & In-Hand Photos: ${domainName} Setup (${userMemory || 'Full breakdown inside'})`;
  }

  // Synthesize Body Copy using Memory Base Body Layouts
  let postBody = '';
  if (bodyMemories.length > 0 && Math.random() > 0.2) {
    const randomBodyPattern = bodyMemories[0].pattern;
    postBody = randomBodyPattern
      .replace('{Seller_Name}', 'SwagSupply / Seller')
      .replace('{Product_URL}', url)
      .replace('{Context_Note}', userMemory || 'Very satisfied with build quality and accuracy.');
  } else {
    postBody = `Hey everyone! Wanted to share a detailed review and in-hand breakdown.\n\n` +
      `**Product Link**: ${url}\n\n` +
      `**Key Notes & Memory Context**:\n` +
      `• ${userMemory || 'Overall quality is top-tier. Stitching and finish are sharp.'}\n` +
      `• Fits true to size, clean packaging.\n\n` +
      `All photos are uploaded in exact numerical order (01, 02, 03) in the Google Drive folder link attached below!`;
  }

  // Generate Google Drive Photo Package & Sequenced Asset Links
  const driveFolderId = `1${Math.random().toString(36).substring(2, 12).toUpperCase()}_TaskHunters_Media`;
  const driveFolderLink = `https://drive.google.com/drive/folders/${driveFolderId}?usp=sharing`;

  const photoListStr = imageLinksInput || '01_hero_overview.png, 02_detail_view.png, 03_finished_result.png';

  const combinedContentToPost = `FLAIR: ${chosenFlair}\nTITLE: ${postTitle}\n\nBODY:\n${postBody}\n\nGOOGLE DRIVE MEDIA FOLDER (Sequential Photos):\n${driveFolderLink}\n\nPHOTO ORDER:\n${photoListStr}`;

  return {
    id: `ai-post-${Date.now()}`,
    type: 'REDDIT_POST',
    subreddit: detectedSub,
    targetPostUrl: url,
    flair: chosenFlair,
    postTitle,
    postBody,
    teaserText: `${chosenFlair} Post in ${detectedSub}: "${postTitle}"`,
    contentToPost: combinedContentToPost,
    driveFolderLink,
    reward: globalRates?.postRate || 2.00,
    timeLimitMins: globalRates?.defaultTimerMins || 360,
    guidelines: `Account age > 30 days. Upload all photos from Google Drive in exact numerical order (${photoListStr}). Must stay live.`,
    generatedBy: 'Complex AI Post & Media Synthesis Agent v3.0 (Trained on User Memory Base)'
  };
}
