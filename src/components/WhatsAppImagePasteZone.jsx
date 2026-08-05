import React, { useState } from 'react';
import { Image as ImageIcon, Clipboard, Trash2, CheckCircle2, Sparkles, Plus, MousePointerClick } from 'lucide-react';

export default function WhatsAppImagePasteZone({ photos, setPhotos }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addPhotoToState = (src, originalName = 'whatsapp_photo') => {
    setPhotos((prev) => {
      const index = prev.length + 1;
      const seqNum = index < 10 ? `0${index}` : `${index}`;
      const fileName = `${seqNum}_${originalName}_${Date.now().toString().slice(-4)}.png`;
      return [
        ...prev,
        {
          id: `photo-${Date.now()}-${Math.random()}`,
          name: fileName,
          src: src,
          order: index,
        },
      ];
    });
  };

  const processImageFile = (file) => {
    return new Promise((resolve) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          addPhotoToState(e.target.result, 'whatsapp_photo');
          resolve(true);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(false);
      }
    });
  };

  // Helper to convert Image URL / Blob URL into DataURL (For Chrome HTML Drag & Drop)
  const processImageUrl = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(false);

      if (url.startsWith('data:image/')) {
        addPhotoToState(url, 'whatsapp_image');
        return resolve(true);
      }

      // Fetch or draw to canvas for HTTP / Blob URLs in Chrome
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL('image/png');
          addPhotoToState(dataUrl, 'whatsapp_web_image');
          resolve(true);
        } catch (e) {
          // Fallback to raw URL
          addPhotoToState(url, 'whatsapp_media');
          resolve(true);
        }
      };
      img.onerror = () => {
        addPhotoToState(url, 'whatsapp_link_image');
        resolve(true);
      };
      img.src = url;
    });
  };

  // Extract HTML <img> tags (Primary Chrome Drag & Drop Path for WhatsApp Web)
  const extractImagesFromHtml = async (htmlData) => {
    if (!htmlData) return false;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
      const imgTags = doc.querySelectorAll('img');

      if (imgTags.length > 0) {
        for (let i = 0; i < imgTags.length; i++) {
          const src = imgTags[i].getAttribute('src');
          if (src) {
            await processImageUrl(src);
          }
        }
        return true;
      }
    } catch (e) {
      console.error("Failed to parse HTML image tags in Chrome", e);
    }
    return false;
  };

  // Universal Paste Handler (Chrome, Safari, Firefox)
  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    setIsProcessing(true);
    let handled = false;

    // 1. Direct Files in Clipboard (Safari & Chrome Native File Copy)
    if (clipboardData.files && clipboardData.files.length > 0) {
      for (let i = 0; i < clipboardData.files.length; i++) {
        if (clipboardData.files[i].type.startsWith('image/')) {
          await processImageFile(clipboardData.files[i]);
          handled = true;
        }
      }
    }

    // 2. Clipboard Items (Chrome & Edge DataTransferItems)
    if (!handled && clipboardData.items) {
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            await processImageFile(file);
            handled = true;
          }
        }
      }
    }

    // 3. HTML Markup (Chrome WhatsApp Web Copy Image)
    if (!handled) {
      const html = clipboardData.getData('text/html');
      if (html) {
        handled = await extractImagesFromHtml(html);
      }
    }

    // 4. Plain Text Image URL
    if (!handled) {
      const text = clipboardData.getData('text/plain');
      if (text && (text.startsWith('http') || text.startsWith('data:image/'))) {
        await processImageUrl(text.trim());
        handled = true;
      }
    }

    if (handled) {
      e.preventDefault();
    }
    setIsProcessing(false);
  };

  // Universal Drag & Drop Handler (Fixes Chrome Drag from WhatsApp Web)
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsHovered(false);
    setIsProcessing(true);

    const dataTransfer = e.dataTransfer;
    if (!dataTransfer) return;

    let handled = false;

    // 1. Direct Files Drop (Safari & Finder Drop)
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      for (let i = 0; i < dataTransfer.files.length; i++) {
        if (dataTransfer.files[i].type.startsWith('image/')) {
          await processImageFile(dataTransfer.files[i]);
          handled = true;
        }
      }
    }

    // 2. Items Drop
    if (!handled && dataTransfer.items) {
      for (let i = 0; i < dataTransfer.items.length; i++) {
        const item = dataTransfer.items[i];
        if (item.kind === 'file' || item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            await processImageFile(file);
            handled = true;
          }
        }
      }
    }

    // 3. Chrome HTML Image Drop (Chrome WhatsApp Web Drag Fix)
    if (!handled) {
      const htmlData = dataTransfer.getData('text/html');
      if (htmlData) {
        handled = await extractImagesFromHtml(htmlData);
      }
    }

    // 4. Chrome URI List Drop
    if (!handled) {
      const uriList = dataTransfer.getData('text/uri-list') || dataTransfer.getData('text/plain');
      if (uriList) {
        const urls = uriList.split('\n');
        for (let url of urls) {
          if (url.trim().startsWith('http') || url.trim().startsWith('data:image/')) {
            await processImageUrl(url.trim());
            handled = true;
          }
        }
      }
    }

    setIsProcessing(false);
  };

  // Modern Chrome Async Clipboard API Button
  const handleChromeAsyncPaste = async () => {
    if (!navigator.clipboard || !navigator.clipboard.read) {
      alert("Please use Cmd+V / Ctrl+V to paste images in your browser.");
      return;
    }

    try {
      setIsProcessing(true);
      const items = await navigator.clipboard.read();
      let found = false;

      for (let item of items) {
        for (let type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], 'whatsapp_pasted.png', { type });
            await processImageFile(file);
            found = true;
          }
        }
      }

      if (!found) {
        const text = await navigator.clipboard.readText();
        if (text && (text.startsWith('http') || text.startsWith('data:image/'))) {
          await processImageUrl(text.trim());
        } else {
          alert("No image found on clipboard. Please copy an image from WhatsApp and try again.");
        }
      }
    } catch (err) {
      console.warn("Async clipboard fallback", err);
      alert("Press Cmd+V / Ctrl+V inside the box to paste your WhatsApp image!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      for (let i = 0; i < e.target.files.length; i++) {
        await processImageFile(e.target.files[i]);
      }
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered.map((p, idx) => {
        const seqNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
        return {
          ...p,
          order: idx + 1,
          name: `${seqNum}_whatsapp_photo.png`,
        };
      });
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold">
        <label className="text-dark-light flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          Photos & Media Package (WhatsApp Drag & Drop + Chrome Copy-Paste)
        </label>
        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
          <Clipboard className="w-3 h-3 text-emerald-400 animate-pulse" /> Chrome + Safari Fully Supported
        </span>
      </div>

      {/* Paste & Drop Zone */}
      <div
        tabIndex={0}
        onPaste={handlePaste}
        onDragOver={(e) => {
          e.preventDefault();
          setIsHovered(true);
        }}
        onDragLeave={() => setIsHovered(false)}
        onDrop={handleDrop}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center space-y-3 cursor-pointer outline-none focus:border-cyan-500 ${
          isHovered
            ? 'bg-cyan-500/10 border-cyan-400 scale-[1.01]'
            : 'bg-dark-bg border-dark-border hover:border-cyan-500/60'
        }`}
      >
        <div className="flex justify-center gap-3">
          <div className="p-3 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Clipboard className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-white flex items-center justify-center gap-2">
            Drag & Drop or Paste WhatsApp Images (`Cmd + V` / `Ctrl + V`)
            {isProcessing && <span className="text-amber-400 animate-pulse">Processing...</span>}
          </h4>
          <p className="text-[11px] text-dark-muted mt-1 max-w-md mx-auto">
            Drag images directly from WhatsApp Web / Desktop or copy & paste. Automatically extracts HTML image tags in Chrome & sequences to 01, 02, 03 in Google Drive.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleChromeAsyncPaste}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-extrabold text-xs inline-flex items-center gap-1.5 transition-all shadow-glow-orange-sm"
          >
            <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
            1-Click Paste Clipboard Image (Chrome)
          </button>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="whatsappImageFileInput"
          />

          <label
            htmlFor="whatsappImageFileInput"
            className="px-4 py-2 rounded-xl bg-dark-card hover:bg-dark-cardHover border border-dark-border text-white font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            Or Browse Image Files
          </label>
        </div>
      </div>

      {/* Image Previews Grid */}
      {photos.length > 0 && (
        <div className="pt-2 space-y-2">
          <span className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">
            Pasted WhatsApp Photos ({photos.length}) — Sequenced for Google Drive
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-xl bg-dark-bg border border-dark-border p-2 space-y-1.5 group hover:border-cyan-500/50 transition-all overflow-hidden"
              >
                {/* Number Badge */}
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-cyan-500 text-white text-[10px] font-extrabold font-mono shadow-md">
                  {photo.order < 10 ? `0${photo.order}` : photo.order}
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors shadow"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="h-24 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                  <img
                    src={photo.src}
                    alt={photo.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="text-[10px] font-mono text-dark-light truncate px-1">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
