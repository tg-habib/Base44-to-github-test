export default function ProjectCard({ project, index, size }) {
  const sizeClasses = {
    large: 'md:col-span-7',
    small: 'md:col-span-5',
    equal: 'md:col-span-6',
    wide: 'md:col-span-12',
  };

  return (
    <div className={`${sizeClasses[size] || 'md:col-span-6'} group`}>
      <div
        className="relative overflow-hidden rounded-lg p-8 md:p-10 transition-all duration-500 border border-transparent hover:border-orange hover:shadow-lg hover:-translate-y-1 cursor-pointer min-h-[220px] flex flex-col justify-end"
        style={{
          background: project.cover_image
            ? `linear-gradient(to top, rgba(26,10,0,0.85), rgba(26,10,0,0.1)), url(${project.cover_image}) center/cover`
            : '#FFF7F0',
        }}
        onClick={() => project.live_url && window.open(project.live_url, '_blank')}
        data-hover
      >
        {/* Big number background */}
        <span
          className="absolute top-4 right-6 font-bebas text-[120px] leading-none pointer-events-none select-none"
          style={{ color: project.cover_image ? 'rgba(255,255,255,0.05)' : 'rgba(255,98,0,0.05)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative z-10">
          <h3
            className="font-bebas text-3xl md:text-[40px] tracking-wide"
            style={{ color: project.cover_image ? '#FFFFFF' : '#1A0A00' }}
          >
            {project.name}
          </h3>

          <p
            className="font-space text-[12px] tracking-[0.04em] mt-2 max-w-md"
            style={{ color: project.cover_image ? 'rgba(255,255,255,0.7)' : '#9A6A50' }}
          >
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {(project.tech_stack || []).map((tech) => (
              <span
                key={tech}
                className="font-space text-[10px] tracking-[0.06em] px-2 py-1 rounded-full"
                style={{
                  background: project.cover_image ? 'rgba(255,98,0,0.3)' : 'rgba(255,98,0,0.1)',
                  color: project.cover_image ? '#FF8C42' : '#FF6200',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Hover reveal */}
          <div
            className="clip-reveal font-space text-[12px] tracking-[0.1em] mt-4 flex items-center gap-2"
            style={{ color: '#FF6200' }}
          >
            OPEN →
          </div>
        </div>
      </div>
    </div>
  );
}