"use client";

export default function NewsletterCTA() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="input-base flex-1"
      />
      <button type="submit" className="btn-accent whitespace-nowrap">
        Subscribe Free →
      </button>
    </form>
  );
}
