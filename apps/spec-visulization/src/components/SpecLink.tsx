"use client";

import Link from "next/link";

interface SpecLinkProps {
  href: string;
  title: string;
}

/**
 * A navigation link component with view transition animation
 * @param href - The destination URL
 * @param title - The title of the specification
 */
export function SpecLink({ href, title }: SpecLinkProps) {
  return (
    <Link href={href} className="group block">
      <div className="border-l-2 border-transparent pl-4 transition-all duration-200 hover:border-neutral-900 flex flex-row justify-between items-center">
        <h2
          className="text-lg text-neutral-900 mb-2"
          style={{ viewTransitionName: "header" }}
        >
          {title}
        </h2>
        <span className="text-sm text-neutral-500 group-hover:text-neutral-800 transition-colors duration-200 inline-flex items-center">
          Explore
          <span className="transform transition-transform duration-200 group-hover:translate-x-1 ml-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
