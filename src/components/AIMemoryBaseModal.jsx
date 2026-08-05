import React, { useState } from 'react';
import { X, Brain, Plus, Trash2, Edit3, Save, RotateCcw, Check, Sparkles, Tag, Type, FileText, Layers, Hash } from 'lucide-react';
import { getStoredAiMemories, saveAiMemories, DEFAULT_AI_MEMORIES } from '../utils/aiMemoryEngine';

export default function AIMemoryBaseModal({ isOpen, onClose }) {
  const [memories, setMemories] = useState(getStoredAiMemories);
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'TITLE' | 'SUBREDDIT' | 'BODY' | 'FLAIR' | 'CUSTOM'

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('TITLE');
  const [newPattern, setNewPattern] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editPattern, setEditPattern] = useState('');

  if (!isOpen) return null;

  const filteredMemories = memories.filter(m => {
    if (activeCategory === 'ALL') return true;
    return m.category === activeCategory;
  });

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newPattern.trim()) return;

    const newObj = {
      id: `mem-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim() || `${newCategory} Custom Memory Rule`,
      pattern: newPattern.trim(),
      description: newDescription.trim() || 'Custom user memory rule added to AI Base.'
    };

    const updated = [newObj, ...memories];
    setMemories(updated);
    saveAiMemories(updated);

    // Reset Form
    setNewTitle('');
    setNewPattern('');
    setNewDescription('');
    setIsAdding(false);
  };

  const handleDeleteMemory = (id) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    saveAiMemories(updated);
  };

  const handleSaveEdit = (id) => {
    const updated = memories.map(m => {
      if (m.id === id) {
        return { ...m, pattern: editPattern };
      }
      return m;
    });
    setMemories(updated);
    saveAiMemories(updated);
    setEditingId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset AI Memory Base back to default historical writing rules?")) {
      setMemories(DEFAULT_AI_MEMORIES);
      saveAiMemories(DEFAULT_AI_MEMORIES);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'TITLE':
        return <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold flex items-center gap-1"><Type className="w-3 h-3" /> Post Title Rule</span>;
      case 'SUBREDDIT':
        return <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold flex items-center gap-1"><Layers className="w-3 h-3" /> Subreddit Mapping</span>;
      case 'BODY':
        return <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1"><FileText className="w-3 h-3" /> Body Layout</span>;
      case 'FLAIR':
        return <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1"><Tag className="w-3 h-3" /> Reddit Flair</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/40 text-[10px] font-extrabold flex items-center gap-1"><Brain className="w-3 h-3" /> Custom Rule</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-dark-card border border-brand-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-dark-card via-dark-cardHover to-dark-bg border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Autonomous AI Agent Memory & Writing Base
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs text-dark-muted">
                Feed custom post titles, flairs, body layouts, and subreddits into the AI memory base.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-dark-bg hover:bg-dark-card border border-dark-border text-dark-muted hover:text-white text-xs font-bold transition-all flex items-center gap-1"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-bg hover:bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Category Filter Tabs & Add Memory Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-bg p-3.5 rounded-2xl border border-dark-border">
            
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-dark-muted">Filter Category:</span>
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activeCategory === 'ALL' ? 'bg-brand-500 text-white font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                All Rules ({memories.length})
              </button>
              <button
                onClick={() => setActiveCategory('TITLE')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activeCategory === 'TITLE' ? 'bg-cyan-500 text-white font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Titles
              </button>
              <button
                onClick={() => setActiveCategory('BODY')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activeCategory === 'BODY' ? 'bg-emerald-500 text-white font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Body Copy
              </button>
              <button
                onClick={() => setActiveCategory('SUBREDDIT')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activeCategory === 'SUBREDDIT' ? 'bg-purple-500 text-white font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Subreddits
              </button>
              <button
                onClick={() => setActiveCategory('FLAIR')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activeCategory === 'FLAIR' ? 'bg-amber-500 text-white font-extrabold' : 'text-dark-muted hover:text-white'}`}
              >
                Flairs
              </button>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-glow-orange transition-all"
            >
              <Plus className="w-4 h-4" />
              + Feed New Memory to AI Base
            </button>

          </div>

          {/* Add New Memory Form Card */}
          {isAdding && (
            <form onSubmit={handleAddMemory} className="p-6 rounded-2xl bg-dark-bg border-2 border-brand-500/50 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-brand-400" />
                Feed New Memory Snippet into AI Agent Learning Base
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-light">Memory Title / Rule Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Streetwear / Reps Post Title Pattern"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-light">Memory Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 font-bold"
                  >
                    <option value="TITLE">Post Title Structure</option>
                    <option value="BODY">Post Body Layout & Style</option>
                    <option value="SUBREDDIT">Target Subreddit Mapping</option>
                    <option value="FLAIR">Reddit Flairs</option>
                    <option value="CUSTOM">Custom Rule / Memory</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Exact Writing Pattern / Template Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. [QC/Review] {Item_Name} from {Seller_Name} - {Key_Detail} (In-hand photos inside)"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-3.5 text-xs text-white font-mono placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-light">Short Description / Purpose (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Used for Yupoo clothing albums and streetwear reviews"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-dark-card hover:bg-dark-cardHover border border-dark-border text-dark-muted text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-glow-orange flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save & Train AI Memory
                </button>
              </div>
            </form>
          )}

          {/* Memories Cards Grid */}
          <div className="space-y-4">
            {filteredMemories.map(m => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-dark-bg border border-dark-border hover:border-brand-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(m.category)}
                    <h4 className="text-sm font-extrabold text-white">{m.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === m.id ? (
                      <button
                        onClick={() => handleSaveEdit(m.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(m.id);
                          setEditPattern(m.pattern);
                        }}
                        className="p-1.5 rounded-lg bg-dark-card hover:bg-dark-cardHover border border-dark-border text-cyan-400"
                        title="Edit Memory Pattern"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="p-1.5 rounded-lg bg-dark-card hover:bg-dark-cardHover border border-dark-border text-rose-400"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingId === m.id ? (
                  <textarea
                    rows={3}
                    value={editPattern}
                    onChange={(e) => setEditPattern(e.target.value)}
                    className="w-full bg-dark-card border border-brand-500 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-dark-card border border-dark-border/80 font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {m.pattern}
                  </div>
                )}

                {m.description && (
                  <p className="text-[11px] text-dark-muted font-sans">
                    💡 {m.description}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
