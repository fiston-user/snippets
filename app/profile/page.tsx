"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await update({ name });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your profile information and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-lg">
                {initials || session?.user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium leading-none">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Your profile picture will be shown publicly
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email || ""}
                disabled
              />
              <p className="text-sm text-muted-foreground">
                Your email address is used for sign in and notifications
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={updateProfile}
            disabled={isLoading || !name || name === session?.user?.name}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
