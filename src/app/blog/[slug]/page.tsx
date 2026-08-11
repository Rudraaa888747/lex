import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, blogPosts } from "@/lib/blog-data";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Lex AI",
    };
  }

  return {
    title: `${post.title} | Lex AI Blog`,
    description: post.description,
    keywords: post.keywords,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-24 px-[var(--gutter)] max-w-3xl mx-auto w-full">
      <Link href="/blog" className="inline-flex items-center text-[var(--color-muted-foreground)] hover:text-[var(--primary)] text-sm mb-12 transition-colors font-mono">
        <ArrowLeft size={16} className="mr-2" /> Back to Blog
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">{post.title}</h1>
        <div className="flex items-center text-sm text-[var(--color-muted-foreground)] font-mono gap-4 border-y border-[var(--outline-var)] py-4">
          <span>By {post.author}</span>
          <span>&bull;</span>
          <span>{post.date}</span>
          <span>&bull;</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none
        [&>h1]:text-3xl [&>h1]:font-display [&>h1]:font-bold [&>h1]:mt-12 [&>h1]:mb-6
        [&>h2]:text-2xl [&>h2]:font-display [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4
        [&>h3]:text-xl [&>h3]:font-display [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4
        [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-[var(--on-bg-muted)]
        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-[var(--on-bg-muted)]
        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-[var(--on-bg-muted)]
        [&>strong]:font-bold [&>strong]:text-[var(--foreground)]
        [&>hr]:border-[var(--outline-var)] [&>hr]:my-12
        [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--primary)] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[var(--on-bg-muted)] [&>blockquote]:my-6
      ">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="mt-24 p-8 rounded-2xl bg-[var(--color-muted)] text-center border border-[var(--outline-var)]">
        <h3 className="text-2xl font-display font-bold mb-4">Tired of reading legal jargon?</h3>
        <p className="text-[var(--on-bg-muted)] mb-6 max-w-lg mx-auto">Let our AI read your contracts for you. Lex instantly highlights risks and explains complex clauses in plain English.</p>
        <Link href="/register" className="btn-primary inline-flex">
          Try Lex for Free
        </Link>
      </div>
    </div>
  );
}
