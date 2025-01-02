"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import {
  Linkedin,
  Twitter,
  Facebook,
  FileText,
  MessageCircle,
  Send,
  Briefcase,
  Coffee,
  Heart,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
  Hash,
  BellRing,
} from "lucide-react";

export default function Menubar() {
  // Initial state values without localStorage
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [useEmojis, setUseEmojis] = useState(false);
  const [useHashtags, setUseHashtags] = useState(false);
  const [useCTA, setUseCTA] = useState(false);
  const [sentiment, setSentiment] = useState(50);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Load preferences on component mount
  useEffect(() => {
    const loadPreferences = () => {
      if (typeof window !== 'undefined') {
        const savedPrefs = localStorage.getItem("userPreferences");
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs);
          setContentType(prefs?.contentType || "");
          setPlatform(prefs?.platform || "");
          setTone(prefs?.tone || "");
          setLength(prefs?.length || "");
          setUseEmojis(prefs?.useEmojis || false);
          setUseHashtags(prefs?.useHashtags || false);
          setUseCTA(prefs?.useCTA || false);
          setSentiment(prefs?.sentiment || 50);
        }
      }
    };
    loadPreferences();
  }, []);

  // Save preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preferences = {
        contentType,
        platform,
        tone,
        length,
        useEmojis,
        useHashtags,
        useCTA,
        sentiment,
      };
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
    }
  }, [contentType, platform, tone, length, useEmojis, useHashtags, useCTA, sentiment]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          sentiment,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGeneratedContent(data.content);
    } catch (error) {
      console.error("Generation failed:", error);
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
        <Select defaultValue={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="post">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Post</span>
              </div>
            </SelectItem>
            <SelectItem value="comment">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Comment</span>
              </div>
            </SelectItem>
            <SelectItem value="dm">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span>Direct Message</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </div>
            </SelectItem>
            <SelectItem value="twitter">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </div>
            </SelectItem>
            <SelectItem value="facebook">
              <div className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </div>
            </SelectItem>
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
          <Select defaultValue={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="official">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Official</span>
                </div>
              </SelectItem>
              <SelectItem value="casual">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span>Casual</span>
                </div>
              </SelectItem>
              <SelectItem value="flirty">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Flirty</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select defaultValue={length} onValueChange={setLength}>
            <SelectTrigger>
              <SelectValue placeholder="Content Length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  <span>Short</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="long">
                <div className="flex items-center gap-2">
                  <AlignRight className="h-4 w-4" />
                  <span>Long</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Toggle
          aria-label="Toggle emojis"
          defaultPressed={useEmojis}
          onPressedChange={setUseEmojis}
        >
          <Smile className="h-4 w-4 mr-2" /> Emojis
        </Toggle>
        <Toggle
          aria-label="Toggle hashtags"
          defaultPressed={useHashtags}
          onPressedChange={setUseHashtags}
        >
          <Hash className="h-4 w-4 mr-2" /> Hashtags
        </Toggle>
        <Toggle
          aria-label="Toggle CTA"
          defaultPressed={useCTA}
          onPressedChange={setUseCTA}
        >
          <BellRing className="h-4 w-4 mr-2" /> Call to Action
        </Toggle>
      </div>

      {/* Sentiment Slider */}
      <div className="space-y-2">
        <label>Sentiment Control</label>
        <Slider
          defaultValue={[sentiment]}
          onValueChange={(value) => setSentiment(value[0])}
          max={100}
          step={1}
        />
      </div>

      {/* Generate Button */}
      <Button className="w-full" onClick={handleGenerate} disabled={loading}>
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
