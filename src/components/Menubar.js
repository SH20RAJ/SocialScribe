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
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // Demo content - replace with actual API call
    setGeneratedContent(
      "🌟 Just launched an exciting new project! Check out SocialScribe - your AI-powered social media assistant! ✨\n\n" +
        "It helps create engaging content with perfect tone and style for any platform. Try it now and level up your social game! 🚀\n\n" +
        "#AI #SocialMedia #ContentCreation"
    );
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
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="post">Post 📝</SelectItem>
            <SelectItem value="comment">Comment 💬</SelectItem>
            <SelectItem value="dm">Direct Message 📩</SelectItem>
          </SelectContent>
        </Select>

        <Select>
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
        placeholder="Enter your content context here..."
        className="min-h-[100px]"
      />

      {/* Content Style Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Select>
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
          <Select>
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
        <Toggle aria-label="Toggle emojis">Emojis 😄</Toggle>
        <Toggle aria-label="Toggle hashtags">Hashtags #️⃣</Toggle>
        <Toggle aria-label="Toggle CTA">Call to Action 📢</Toggle>
      </div>

      {/* Sentiment Slider */}
      <div className="space-y-2">
        <label>Sentiment Control</label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>

      {/* Generate Button */}
      <Button className="w-full" onClick={handleGenerate}>
        Generate Content 🚀
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
