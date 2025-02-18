"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md px-4">
        {/* Loading text */}
        <p className="text-neutral-600 font-light text-sm mb-4 text-center">
          Loading...
        </p>

        {/* Progress bar container */}
        <div className="h-[2px] w-full bg-neutral-200 overflow-hidden">
          {/* Animated progress bar */}
          <div className="h-full bg-neutral-800 w-1/3 animate-loading-progress" />
        </div>
      </div>
    </div>
  );
}
