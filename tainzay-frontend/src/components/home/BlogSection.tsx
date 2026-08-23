'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { BLOG_POSTS, type BlogPost } from '@/lib/blog-posts';
import { useSwipe } from '@/hooks/useCarousel';

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card group">
      <Link href={`/blog/${post.slug}`} className="blog-card-image">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-safe"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="blog-card-body">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="blog-card-title">{post.title}</h3>
        </Link>
        <p className="blog-card-excerpt">{post.excerpt}</p>
      </div>
    </article>
  );
}

export default function BlogSection() {
  const [current, setCurrent] = useState(0);
  const total = BLOG_POSTS.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  return (
    <section className="section-padding bg-surface-white">
      <div className="container-site">
        <div className="section-heading">
          <h2 className="section-heading-text">Wellness Blog</h2>
        </div>

        <div className="flex justify-center -mt-4 mb-8 md:mb-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            View More
          </Link>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div
          className="md:hidden relative pb-10"
          aria-label="Blog articles"
          aria-roledescription="carousel"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out motion-safe"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {BLOG_POSTS.map((post, index) => (
                <div
                  key={post.id}
                  className="w-full flex-shrink-0 px-1"
                  aria-hidden={index !== current}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            Article {current + 1} of {total}
          </p>

          <div className="product-carousel-dots" role="tablist" aria-label="Blog slides">
            {BLOG_POSTS.map((post, index) => (
              <button
                key={post.id}
                type="button"
                role="tab"
                aria-label={`Go to article ${index + 1}`}
                aria-selected={index === current}
                onClick={() => goTo(index)}
                className={`product-carousel-dot ${index === current ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
