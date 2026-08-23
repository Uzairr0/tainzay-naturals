import { Construction } from 'lucide-react';

interface AdminPlaceholderProps {
  title: string;
  description: string;
}

export default function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <section className="admin-placeholder">
      <div className="admin-placeholder-icon" aria-hidden="true">
        <Construction size={28} />
      </div>
      <h2 className="admin-placeholder-title">{title}</h2>
      <p className="admin-placeholder-text">{description}</p>
    </section>
  );
}
