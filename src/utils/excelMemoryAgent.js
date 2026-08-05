// Robust Excel & Spreadsheet Memory Ingestion Engine v3.0

export async function parseExcelOrCsvFile(file) {
  if (!file) return [];

  const fileName = file.name.toLowerCase();

  // If file is CSV / TSV / TXT
  if (fileName.endsWith('.csv') || fileName.endsWith('.tsv') || fileName.endsWith('.txt')) {
    const text = await file.text();
    return parseTextSpreadsheet(text);
  }

  // If file is Binary Excel (.xlsx / .xls)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const textContent = decoder.decode(arrayBuffer);

    // Extract strings & URLs from binary stream
    return parseBinaryExcelStrings(textContent);
  } catch (err) {
    console.error("Error reading binary Excel file:", err);
    return [];
  }
}

function parseBinaryExcelStrings(binaryText) {
  // Extract visible ASCII / UTF8 text strings and URLs from binary Excel XML stream
  const urls = binaryText.match(/https?:\/\/[^\s"<>\0]+/gi) || [];
  const cleanStrings = binaryText.match(/[a-zA-Z0-9_\-\.\s/]{4,}/g) || [];

  const tasksParsed = [];
  const subreddits = cleanStrings.filter(s => s.toLowerCase().includes('r/') || s.toLowerCase().includes('reddit')).slice(0, 10);

  urls.forEach((url, idx) => {
    let sub = subreddits[idx % subreddits.length] || 'r/Reddit';
    if (!sub.startsWith('r/')) sub = `r/${sub.replace(/[^a-zA-Z0-9_]/g, '') || 'Reddit'}`;

    tasksParsed.push({
      id: `excel-bin-task-${Date.now()}-${idx}`,
      type: 'REDDIT_COMMENT',
      subreddit: sub,
      targetPostUrl: url,
      teaserText: `Extracted Excel Task #${idx + 1}`,
      contentToPost: `Auto-parsed Excel copy task for ${url}`,
      reward: 1.00,
      timeLimitMins: 360,
      guidelines: 'Account age > 30 days. Comment must stay live.',
      source: 'Binary Excel Parser'
    });
  });

  return tasksParsed;
}

function parseTextSpreadsheet(fileContent) {
  if (!fileContent || typeof fileContent !== 'string') return [];

  const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const tasksParsed = [];
  let headers = [];

  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes('|') ? '|' : ',';

  headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
    if (row.length < 2) continue;

    let subreddit = 'r/Reddit';
    let targetPostUrl = '';
    let contentToPost = '';
    let teaserText = '';
    let type = 'REDDIT_COMMENT';
    let reward = 1.00;
    let guidelines = 'Account age > 30 days. Comment must stay live.';

    row.forEach((val, idx) => {
      const header = headers[idx] || '';
      if (header.includes('sub') || header.includes('subreddit')) {
        subreddit = val.startsWith('r/') ? val : `r/${val}`;
      } else if (header.includes('url') || header.includes('link') || val.startsWith('http')) {
        targetPostUrl = val;
      } else if (header.includes('comment') || header.includes('post') || header.includes('content') || header.includes('text')) {
        contentToPost = val;
      } else if (header.includes('teaser') || header.includes('title')) {
        teaserText = val;
      } else if (header.includes('type')) {
        type = val.toUpperCase().includes('POST') ? 'REDDIT_POST' : 'REDDIT_COMMENT';
      } else if (header.includes('reward') || header.includes('price') || header.includes('payout')) {
        const num = parseFloat(val.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) reward = num;
      } else if (header.includes('rule') || header.includes('guideline')) {
        guidelines = val;
      }
    });

    if (!targetPostUrl) {
      const urlCol = row.find(c => c.startsWith('http'));
      if (urlCol) targetPostUrl = urlCol;
    }

    if (!contentToPost) {
      const nonUrlCol = row.find(c => !c.startsWith('http') && c.length > 5);
      if (nonUrlCol) contentToPost = nonUrlCol;
    }

    if (targetPostUrl || contentToPost) {
      tasksParsed.push({
        id: `excel-csv-task-${Date.now()}-${i}`,
        type,
        subreddit: subreddit || 'r/Reddit',
        targetPostUrl: targetPostUrl || 'https://www.reddit.com',
        teaserText: teaserText || contentToPost || `Task from Excel sheet`,
        contentToPost: contentToPost || `Required copy from Excel spreadsheet`,
        reward: reward || (type === 'REDDIT_POST' ? 2.00 : 1.00),
        timeLimitMins: 360,
        guidelines,
        source: 'Excel CSV Ingestion Engine'
      });
    }
  }

  return tasksParsed;
}
