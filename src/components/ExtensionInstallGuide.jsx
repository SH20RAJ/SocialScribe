"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Chrome, CheckCircle, AlertCircle } from "lucide-react"

export default function ExtensionInstallGuide() {
  const [downloadStarted, setDownloadStarted] = useState(false)

  const handleDownload = () => {
    // Create a download link for the extension zip
    const link = document.createElement('a')
    link.href = '/socialscribe-extension.zip'
    link.download = 'socialscribe-extension.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadStarted(true)
  }

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleDownload}
          className="bg-gray-900 hover:bg-gray-800 text-white border-0"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Extension
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Free • No signup required • Works offline
        </p>
      </div>

      {/* Installation Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">Installation steps</h3>
        
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Download the Extension",
              description: "Click the download button above to get the extension file",
              icon: <Download className="h-4 w-4" />,
              status: downloadStarted ? "completed" : "pending"
            },
            {
              step: 2,
              title: "Open Chrome Extensions",
              description: "Go to chrome://extensions/ or Menu → More Tools → Extensions",
              icon: <Chrome className="h-4 w-4" />,
              status: "pending"
            },
            {
              step: 3,
              title: "Enable Developer Mode",
              description: "Toggle the 'Developer mode' switch in the top right corner",
              icon: <AlertCircle className="h-4 w-4" />,
              status: "pending"
            },
            {
              step: 4,
              title: "Load Unpacked Extension",
              description: "Click 'Load unpacked' and select the extracted extension folder",
              icon: <CheckCircle className="h-4 w-4" />,
              status: "pending"
            }
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                step.status === "completed" 
                  ? "bg-gray-900 text-white" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {step.status === "completed" ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  step.step
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1 text-gray-900">{step.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
              <div className="text-gray-400">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features After Installation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">What you'll get</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "AI-powered grammar fixing",
            "Instant text rewriting",
            "Tone adjustment (formal, casual, etc.)",
            "Works on Twitter, LinkedIn, Gmail",
            "Real-time suggestions",
            "No login required"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Need help?</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          If you encounter any issues during installation, make sure you have Chrome version 88+ 
          and that Developer mode is enabled. The extension will appear in your extensions list 
          once successfully installed.
        </p>
      </div>
    </div>
  )
}