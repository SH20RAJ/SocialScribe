import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center text-sm">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} SocialScribe by{" "}
          <Link
            href="https://shaswat.live"
            target="_blank"
            className="font-medium text-primary hover:underline"
          >
            SH20RAJ
          </Link>
        </p>
      </div>
    </footer>
  );
}
