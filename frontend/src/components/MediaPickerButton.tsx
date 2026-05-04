import { useState } from "react"
import { useCmsMedia, type MediaItem } from "../hooks/useMedia"

interface Props {
  token: string | null
  onPick: (url: string) => void
}

/**
 * Reusable media picker button + modal.
 * Drop this into any form field that needs an image URL from the media library.
 */
export function MediaPickerButton({ token, onPick }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Pilih dari Media Library"
        aria-label="Pilih gambar dari media library"
        className="shrink-0 w-11 h-11 rounded-xl bg-[#2a2a2a] flex items-center justify-center hover:bg-[#53e076]/20 hover:text-[#53e076] border border-[#3d4a3d]/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">perm_media</span>
      </button>

      {open && (
        <MediaPickerModal
          token={token}
          onPick={url => { onPick(url); setOpen(false) }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function MediaPickerModal({
  token, onPick, onClose,
}: {
  token: string | null
  onPick: (url: string) => void
  onClose: () => void
}) {
  const { data, loading } = useCmsMedia(token)
  const images = data.filter((m: MediaItem) => m.mimeType?.startsWith("image/"))

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pilih gambar dari media library"
    >
      <div className="bg-[#1c1b1b] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-[#3d4a3d]/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3d4a3d]/20 shrink-0">
          <div>
            <h3 className="font-headline font-bold text-[#e5e2e1]">Media Library</h3>
            <p className="text-[#e5e2e1]/40 font-label text-[10px] uppercase tracking-widest mt-0.5">
              {images.length} gambar tersedia
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup media picker"
            className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#353534] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076]"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-6 flex-1">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#53e076] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            </div>
          )}
          {!loading && images.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-5xl text-[#e5e2e1]/20 mb-3 block" aria-hidden="true">perm_media</span>
              <p className="text-[#e5e2e1]/40 font-label text-xs uppercase tracking-widest mb-2">Belum ada gambar</p>
              <p className="text-[#e5e2e1]/25 text-sm">
                Upload gambar di halaman <strong className="text-[#53e076]">Media</strong> terlebih dahulu.
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((m: MediaItem) => (
              <button
                key={m.id}
                onClick={() => onPick(m.url)}
                aria-label={`Pilih ${m.originalName ?? m.filename}`}
                className="group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#53e076] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e076] relative"
              >
                <img
                  src={m.url}
                  alt={m.altText ?? m.originalName ?? ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                  onError={e => (e.currentTarget.style.opacity = "0.3")}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-[9px] font-label truncate leading-tight">{m.originalName ?? m.filename}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
