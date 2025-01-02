import React from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex items-center space-x-6 w-full">
            <NavigationMenuItem className="mr-auto">
              <NavigationMenuLink href="/" className="font-bold text-xl">
                SocialScribe ✍️
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <div className="flex items-center space-x-6">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink href="/features/customization">
                      Post Customization 🎯
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/features/platforms">
                      Platform-Specific Content 📱
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/features/types">
                      Content Types 💬
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/features/targeting">
                      Audience Targeting 🧑‍🤝‍🧑
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>How It Works</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink href="/how-it-works#input">
                      1. Input Your Content 🖊️
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/how-it-works#customize">
                      2. Customize Your Post 🎨
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/how-it-works#generate">
                      3. Generate Your Post 🤖
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/how-it-works#publish">
                      4. Review and Publish 📣
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="https://socialscribe.pages.dev" className="text-primary">
                  Get Started
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="mailto:sh20raj@gmail.com">
                  Contact 📧
                </NavigationMenuLink>
              </NavigationMenuItem>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
