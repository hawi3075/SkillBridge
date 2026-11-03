import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowUpRight } from 'lucide-react';

export const SkillCard = ({ skill }) => {
  const difficultyColors = {
    BEGINNER: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    INTERMEDIATE: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
    ADVANCED: { bg: '#FDF2F8', text: '#9D174D', border: '#FBCFE8' }
  };

  const diffStyle = difficultyColors[skill.difficulty] || difficultyColors.INTERMEDIATE;

  return (
    <div className="sb-card sb-card-hover p-4 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BookOpen size={22} />
        </div>
        <span
          className="badge"
          style={{
            backgroundColor: diffStyle.bg,
            color: diffStyle.text,
            border: `1px solid ${diffStyle.border}`,
            fontSize: '0.72rem',
            fontWeight: 600
          }}
        >
          {skill.difficulty}
        </span>
      </div>

      <h5 className="fw-bold mb-2 text-dark">{skill.name}</h5>
      <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: 1.5 }}>
        {skill.description}
      </p>

      <div className="pt-3 border-top d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-1 text-muted small" style={{ fontSize: '0.82rem' }}>
          <Users size={15} />
          <span>{skill.offeredCount || 1} offering • {skill.wantedCount || 1} learning</span>
        </div>

        <Link
          to={`/skills/${skill.slug}`}
          className="btn btn-sm btn-link p-0 text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
        >
          <span>Explore</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
