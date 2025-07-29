"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import "./breadcrumb.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
}

export default function Breadcrumb({
  items,
  showHome = true,
  separator,
  className = "",
}: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="w-4 h-4 text-gray-400" />;
  const breadcrumbSeparator = separator || defaultSeparator;

  const allItems = showHome
    ? [
        { label: "Ana Sayfa", href: "/", icon: <Home className="w-4 h-4" /> },
        ...items,
      ]
    : items;

  return (
    <div className="breadcrumb">
      <div className="global-container">
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center space-x-1 text-sm ${className}`}
        >
          <ol className="flex items-center space-x-1">
            {allItems.map((item, index) => {
              const isLast = index === allItems.length - 1;

              return (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 flex items-center">
                      {breadcrumbSeparator}
                    </span>
                  )}

                  {isLast ? (
                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                      {item.icon}
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:underline"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

export const BreadcrumbVariants = {
  minimal: "text-xs text-gray-500",
  default: "text-sm",
  large: "text-base",
  dark: "text-sm [&_a]:text-blue-400 [&_span]:text-gray-300",
  pill: "text-sm bg-gray-50 px-4 py-2 rounded-full",
};
