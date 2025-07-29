"use client";
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProfileForm from "@/components/profileForm/profileForm";
import Breadcrumb from "@/components/ui/breadcrumb";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profil", current: true },
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
     
      <div className="global-container">
        <ProfileForm />
      </div>
    </div>
  );
}
