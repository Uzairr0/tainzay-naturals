import Image from 'next/image';
import Link from 'next/link';
import { ABOUT_PAGE } from '@/lib/about-content';
import { cloudinaryLoader } from '@/lib/cloudinary';
import { HEALTH_CONCERNS } from '@/lib/concerns';

export default function AboutStorySection() {
  const { storyBlocks } = ABOUT_PAGE;

  return (
    <section className="about-stories" aria-label="About Tainzay story">
      {storyBlocks.map((block, index) => {
        const reversed = block.imagePosition === 'right';

        return (
          <article
            key={block.title}
            className={`about-story-block ${reversed ? 'is-reversed' : ''} ${
              index % 2 === 1 ? 'is-muted' : ''
            }`}
          >
            <div className="container-wide">
              <div className="about-story-panel">
                <div className="about-story-media">
                  <Image
                    src={cloudinaryLoader({ src: block.image, width: 800 })}
                    alt={block.alt}
                    width={600}
                    height={600}
                    className="about-story-image"
                    sizes="(max-width: 1023px) 100vw, 42vw"
                  />
                </div>

                <div className="about-story-content">
                  <h2 className="about-story-title">{block.title}</h2>

                  {block.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="about-story-text">
                      {paragraph}
                    </p>
                  ))}

                  {'showCategories' in block && block.showCategories && (
                    <div className="about-story-tags">
                      {HEALTH_CONCERNS.slice(0, 6).map((concern) => (
                        <Link
                          key={concern.href}
                          href={concern.href}
                          className="pill-tag"
                        >
                          {concern.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {'cta' in block && block.cta && (
                    <Link href={block.cta.href} className="btn-primary-dark about-story-cta">
                      {block.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
