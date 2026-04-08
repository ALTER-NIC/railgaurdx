'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="px-3 py-1.5 text-xs font-medium bg-brand-border hover:bg-brand-grey/20 text-brand-white rounded transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
