"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/auth/supabase";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setIsSent(true);
      toast.success("Check your email for the magic link!");
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Hopeland Petcare</CardTitle>
        </CardHeader>
        <CardContent>
          {isSent ? (
            <div className="text-center">
              <p className="mb-4">
                Magic link sent! Check your email to sign in.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSent(false)}
                className="w-full"
              >
                Try again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
