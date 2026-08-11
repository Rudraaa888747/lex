import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Tech Blog | Lex AI",
  description: "Read the latest articles on legal tech, contract analysis, and how to spot hidden risks in your agreements using AI.",
  keywords: ["legal tech blog", "contract analysis tips", "AI legal advice", "legal risks"],
};

export default function BlogIndexPage() {
  return (
    <div className="py-24 px-[var(--gutter)] max-w-[var(--max-w)] mx-auto w-full">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold tracking-wide uppercase mb-6">
          <BookOpen size={14} /> Resources & Guides
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">The Lex Legal Tech Blog</h1>
        <p className="text-[var(--on-bg-muted)] max-w-2xl text-xl">
          Actionable advice on reviewing contracts, understanding complex legal jargon, and leveraging AI for smarter agreements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="group g-subtle p-6 rounded-2xl flex flex-col hover:bg-[var(--color-card)] hover:shadow-xl transition-all duration-300 border border-[var(--outline-var)]">
            <div className="text-xs text-[var(--on-bg-muted)] mb-3 flex items-center justify-between font-mono">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className="font-display font-bold text-xl mb-3 group-hover:text-[var(--primary)] transition-colors">{post.title}</h2>
            <p className="text-[var(--on-bg-muted)] text-sm leading-relaxed mb-6 flex-1">
              {post.description}
            </p>
            <div className="flex items-center text-[var(--primary)] text-sm font-semibold mt-auto">
              Read Article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
