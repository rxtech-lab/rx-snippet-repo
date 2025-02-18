import { SpecLink } from "@/components/SpecLink";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8"
      style={{ viewTransitionName: "page" }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <h1 className="text-2xl font-light text-neutral-900 mb-3">
            Spec Visualization
          </h1>
          <p className="text-base text-neutral-600">
            Select a specification to explore its visual representation
          </p>
        </header>

        {/* Spec List */}
        <nav className="space-y-8">
          <SpecLink href="/spec/repository" title="Repository Spec" />
        </nav>
      </div>
    </div>
  );
}
