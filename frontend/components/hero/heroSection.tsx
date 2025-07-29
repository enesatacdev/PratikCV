"use client";
import React from "react";
import Link from "next/link";
import { Typewriter } from 'react-simple-typewriter'

export default function heroSection() {
  return (
    <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-1 before:transform before:-translate-x-1/2 h-screen flex items-center">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative">
        {/* Announcement Banner */}
        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-x-2 bg-white border border-yellow-500 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-600"
          >
            Pratik ile Hemen Ücretsiz CV Oluştur!
            <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full from-yellow-500 to-amber-600 bg-linear-to-tl font-semibold text-sm text-white dark:bg-yellow-500 dark:text-white">
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
        </div>
        {/* End Announcement Banner */}

        {/* Title */}
        <div className="mt-5 max-w-2xl text-center mx-auto">
          <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl sm:text-3xl xs:text-2xl w-xs:text-2xl dark:text-neutral-200">
            CV Hazırlamak Hiç Bu <br/> Kadar&nbsp;
            <span className="bg-clip-text bg-linear-to-tl from-yellow-500 to-amber-600 text-transparent">
              <Typewriter
                words={['Pratik', 'Hızlı', 'Kolay']}
                loop={5}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
             Olmamıştı!
            
          </h1>
        </div>
        {/* End Title */}

        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            Yapay zekamız ile sohbet ederek, CV'nizi saniyeler içinde oluşturun. Pratik CV, iş başvurularınızı kolaylaştırmak için tasarlandı.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 gap-3 flex justify-center">
          <Link
            href="/auth/login"
            className="inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-hidden focus:from-yellow-500 focus:to-amber-600 py-3 px-4"
          >
            Kayıt Ol
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <Link
            href="/auth/login"
            className="relative group p-2 ps-3 inline-flex items-center gap-x-2 text-sm font-mono rounded-lg border border-yellow-500 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 trransition transform ease-in-out duration-300"
          >
            Hemen Başla
            
          </Link>
          
        </div>
       <div className="hero-image absolute w-full " style={{ bottom: '-400px' }}>
            <img src="/hero-resume.png" alt="Hero Image" className="w-full" />
          </div>
      </div>
    </div>
  );
}
