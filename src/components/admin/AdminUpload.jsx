import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, X, Check } from 'lucide-react';

export default function AdminUpload({ onUploaded }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
      published: true,
      type: file.type.startsWith('video') ? 'video' : 'photo',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (files.length === 0) return;
    setUploading(true);

    for (const f of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: f.file });
      await base44.entities.MediaItem.create({
        type: f.type,
        file_url,
        caption: f.caption,
        published: f.published,
      });
    }

    setUploading(false);
    setSuccess(true);
    setFiles([]);
    if (onUploaded) onUploaded();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <h2 className="font-bebas text-3xl tracking-wide mb-6" style={{ color: '#1A0A00' }}>Upload Media</h2>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-orange"
        style={{ borderColor: '#f0d0b0' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <Upload size={32} style={{ color: '#FF6200', margin: '0 auto 12px' }} />
        <p className="font-syne text-sm" style={{ color: '#9A6A50' }}>Drag photos or videos here, or tap to browse</p>
        <p className="font-space text-[10px] mt-2" style={{ color: '#9A6A50', opacity: 0.7 }}>
          .jpg .png .gif .webp .mp4 .mov .webm
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {files.map((f, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-lg border" style={{ borderColor: '#f0e0d0' }}>
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {f.type === 'photo' ? (
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={f.preview} className="w-full h-full object-cover" muted />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-space text-[11px]" style={{ color: '#1A0A00' }}>{f.file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600">
                    <X size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Add caption..."
                  value={f.caption}
                  onChange={(e) => {
                    const updated = [...files];
                    updated[idx].caption = e.target.value;
                    setFiles(updated);
                  }}
                  className="w-full border-b py-1 font-space text-[12px] outline-none bg-transparent"
                  style={{ borderColor: '#e0d0c0', color: '#1A0A00' }}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={f.published}
                    onChange={(e) => {
                      const updated = [...files];
                      updated[idx].published = e.target.checked;
                      setFiles(updated);
                    }}
                    className="accent-orange-500"
                  />
                  <span className="font-space text-[10px]" style={{ color: '#9A6A50' }}>Publish to Feed</span>
                </label>
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={uploading}
            className="w-full py-3 font-bebas text-lg tracking-widest text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#FF6200' }}
            data-hover
          >
            {uploading ? 'UPLOADING...' : success ? 'SAVED ✓' : 'SAVE TO LIBRARY'}
          </button>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(255,98,0,0.1)' }}>
          <Check size={16} style={{ color: '#FF6200' }} />
          <span className="font-space text-[12px]" style={{ color: '#FF6200' }}>Media uploaded successfully!</span>
        </div>
      )}
    </div>
  );
}