"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
          >
            <Home className="w-3 h-3 me-2.5" />
            Ana Sayfa
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              {item.current ? (
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-yellow-600 md:ms-2 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;