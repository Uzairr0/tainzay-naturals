import { ABOUT_PAGE } from '@/lib/about-content';

export default function AboutPromiseSection() {
  const { promise } = ABOUT_PAGE;

  return (
    <section className="about-promise" aria-labelledby="about-promise-title">
      <div className="container-wide about-promise-inner">
        <p id="about-promise-title" className="about-promise-eyebrow">
          {promise.eyebrow}
        </p>
        <blockquote className="about-promise-statement">
          <p>{promise.statement}</p>
        </blockquote>
      </div>
    </section>
  );
}
