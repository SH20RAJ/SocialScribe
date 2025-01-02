"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";

export default function Menubar() {
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [useEmojis, setUseEmojis] = useState(false);
  const [useHashtags, setUseHashtags] = useState(false);
  const [useCTA, setUseCTA] = useState(false);
  const [sentiment, setSentiment] = useState(50);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          platform,
          context,
          tone,
          length,
          useEmojis,
          useHashtags,
          useCTA,
          sentiment
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full md:max-w-5xl space-y-6 p-4 border rounded-lg bg-card">
      {/* Content Type and Platform Selection */}
      <div className="flex items-center space-x-4">
        <Select onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="post">Post 📝</SelectItem>
            <SelectItem value="comment">Comment 💬</SelectItem>
            <SelectItem value="dm">Direct Message 📩</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Context */}
      <Textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Enter your content context here..."
        className="min-h-[100px]"
      />

      {/* Content Style Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Select onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="official">Official 👔</SelectItem>
              <SelectItem value="casual">Casual 😊</SelectItem>
              <SelectItem value="flirty">Flirty 😘</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select onValueChange={setLength}>
            <SelectTrigger>
              <SelectValue placeholder="Content Length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short 📏</SelectItem>
              <SelectItem value="medium">Medium 📏📏</SelectItem>
              <SelectItem value="long">Long 📏📏📏</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Toggle aria-label="Toggle emojis" pressed={useEmojis} onPressedChange={setUseEmojis}>Emojis 😄</Toggle>
        <Toggle aria-label="Toggle hashtags" pressed={useHashtags} onPressedChange={setUseHashtags}>Hashtags #️⃣</Toggle>
        <Toggle aria-label="Toggle CTA" pressed={useCTA} onPressedChange={setUseCTA}>Call to Action 📢</Toggle>
      </div>

      {/* Sentiment Slider */}
      <div className="space-y-2">
        <label>Sentiment Control</label>
        <Slider value={[sentiment]} onValueChange={(value) => setSentiment(value[0])} max={100} step={1} />
      </div>

      {/* Generate Button */}
      <Button 
        className="w-full" 
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Content 🚀"}
      </Button>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="mt-4 p-4 border rounded-md bg-muted relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            className="min-h-[150px] bg-transparent border-none focus-visible:ring-0"
          />
        </div>
      )}
    </div>
  );
}
