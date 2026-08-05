import React, { useState } from 'react';
import { useApp, autoDetectSubreddit } from '../context/AppContext';
import { X, Edit3, Wand2, Save } from 'lucide-react';

export default function EditTaskModal({ task, onClose }) {
  const { updateTask } = useApp();

  const [type, setType] = useState(task.type || 'REDDIT_COMMENT');
  const [subreddit, setSubreddit] = useState(task.subreddit || '');
  const [targetPostUrl, setTargetPostUrl] = useState(task.targetPostUrl || '');
  const [teaserText, setTeaserText] = useState(task.teaserText || '');
  const [driveLink, setDriveLink] = useState(task.driveLink || '');
  const [reward, setReward] = useState(task.reward || 1.00);
  const [timeLimitMins, setTimeLimitMins] = useState(task.timeLimitMins || 360);
  const [guidelines, setGuidelines] = useState(task.guidelines || '');
  const [status, setStatus] = useState(task.status || 'AVAILABLE');

  const handleUrlChange = (url) => {
    setTargetPostUrl(url);
    const detected = autoDetectSubreddit(url);
    if (detected) {
      setSubreddit(detected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetPostUrl || !contentToPost) {
      alert("Please fill in required task fields.");
      return;
    }

    const finalSub = subreddit || autoDetectSubreddit(targetPostUrl) || 'r/reddit';

    updateTask({
      id: task.id,
      type,
      subreddit: finalSub,
      targetPostUrl,
      teaserText: teaserText || `Reddit task in ${finalSub}`,
      contentToPost,
      driveLink,
      reward: parseFloat(reward),
      timeLimitMins: parseInt(timeLimitMins, 10),
      guidelines,
      status
    });

    alert(`Task ${task.id} updated successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-dark-card border border-brand-500/40 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-bg text-dark-muted hover:text-white border border-dark-border transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/40">
              <Edit3 className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-extrabold text-white">Edit Task ({task.id})</h3>
          </div>
          <p className="text-xs text-dark-muted">
            Modify task details, target Reddit URL, reward pricing, copy text, or availability status.
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Task Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('REDDIT_COMMENT')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  type === 'REDDIT_COMMENT'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                    : 'bg-dark-bg text-dark-muted border-dark-border'
                }`}
              >
                Reddit Comment Task
              </button>
              <button
                type="button"
                onClick={() => setType('REDDIT_POST')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  type === 'REDDIT_POST'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-dark-bg text-dark-muted border-dark-border'
                }`}
              >
                Reddit Post Task
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-light">Target Reddit URL</label>
              {subreddit && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" /> Subreddit: {subreddit}
                </span>
              )}
            </div>
            <input
              type="url"
              required
              placeholder="https://www.reddit.com/r/technology/comments/..."
              value={targetPostUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Subreddit</label>
              <input
                type="text"
                required
                placeholder="r/technology"
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Reward ($ USD)</label>
              <input
                type="number"
                step="0.25"
                required
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-light">Timer (Mins)</label>
              <input
                type="number"
                required
                value={timeLimitMins}
                onChange={(e) => setTimeLimitMins(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Pre-Claim Teaser Text</label>
            <input
              type="text"
              placeholder="Public teaser visible before claim..."
              value={teaserText}
              onChange={(e) => setTeaserText(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Exact Copy Text</label>
            <textarea
              rows={3}
              required
              placeholder="Exact comment/post content user must copy..."
              value={contentToPost}
              onChange={(e) => setContentToPost(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Google Drive Link (Post Images / Assets)</label>
            <input
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-light">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="AVAILABLE">AVAILABLE (Listed on Feed)</option>
              <option value="CLAIMED">CLAIMED (Locked by User)</option>
              <option value="PENDING_APPROVAL">PENDING_APPROVAL (In Review)</option>
              <option value="APPROVED">APPROVED (Completed & Paid)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-dark-muted hover:text-white font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-glow-orange flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
