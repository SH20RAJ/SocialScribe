import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie", // storing auth tokens in cookies
  urls: {
    signIn: "/handler/sign-in/sign-in",
    signUp: "/handler/sign-up/sign-up",
    afterSignIn: "/",
    afterSignUp: "/welcome",
    afterSignOut: "/",
  }
});