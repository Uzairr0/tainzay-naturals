import { ABOUT_PAGE } from '@/lib/about-content';

export default function AboutIntroSection() {
  const { intro } = ABOUT_PAGE;

  return (
    <section className="about-intro" aria-labelledby="about-intro-title">
      <div className="about-intro-copy">
        <h2 id="about-intro-title" className="about-intro-title">
          {intro.title}
        </h2>

        {intro.paragraphs.map((paragraph, index) => (
          <p key={index} className="about-intro-text">
            {paragraph}
          </p>
        ))}
      </div>

      <ul className="about-intro-stats" aria-label="Tainzay at a glance">
        {intro.stats.map((stat) => (
          <li key={stat.label} className="about-intro-stat">
            <span className="about-intro-stat-value">{stat.value}</span>
            <span className="about-intro-stat-label">{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
