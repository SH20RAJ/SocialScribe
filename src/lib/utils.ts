import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ToneOption {
  value: string
  label: string
  description: string
}

export interface PlatformOption {
  value: string
  label: string
  icon: string
}

export interface ActionOption {
  value: string
  label: string
  description: string
}

export const tones: ToneOption[] = [
  { value: "formal", label: "Formal", description: "Professional and polite" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "casual", label: "Casual", description: "Relaxed and informal" },
  { value: "professional", label: "Professional", description: "Business-appropriate" },
  { value: "humorous", label: "Humorous", description: "Light and funny" },
  { value: "persuasive", label: "Persuasive", description: "Convincing and compelling" },
  { value: "empathetic", label: "Empathetic", description: "Understanding and caring" },
  { value: "confident", label: "Confident", description: "Assertive and sure" },
  { value: "flirty", label: "Flirty", description: "Playful and charming" },
  { value: "sarcastic", label: "Sarcastic", description: "Witty and ironic" }
]

export const platforms: PlatformOption[] = [
  { value: "twitter", label: "Twitter", icon: "Twitter" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "gmail", label: "Gmail", icon: "Mail" },
  { value: "medium", label: "Medium", icon: "FileText" },
  { value: "reddit", label: "Reddit", icon: "MessageCircle" },
  { value: "general", label: "General", icon: "Globe" }
]

export const actions: ActionOption[] = [
  { value: "fix_grammar", label: "Fix Grammar", description: "Correct grammar and spelling" },
  { value: "rewrite", label: "Rewrite", description: "Rewrite in different tone" },
  { value: "shorten", label: "Shorten", description: "Make it more concise" },
  { value: "expand", label: "Expand", description: "Add more detail" },
  { value: "summarize", label: "Summarize", description: "Create a summary" },
  { value: "formalize", label: "Formalize", description: "Make it more formal" }
]