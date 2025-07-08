import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie", // storing auth tokens in cookies
  urls: {
    signIn: "/sign-in",
    signUp: "/sign-up", 
    afterSignIn: "/",
    afterSignUp: "/welcome",
    afterSignOut: "/",
  }
});