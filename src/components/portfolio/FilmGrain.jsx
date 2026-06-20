import { useEffect, useRef } from 'react';

export default function FilmGrain() {
  const svgRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    let lastTime = 0;
    const fps = 12;
    const interval = 1000 / fps;

    function animate(time) {
      if (time - lastTime >= interval) {
        lastTime = time;
        frame++;
        if (svgRef.current) {
          const turbulence = svgRef.current.querySelector('feTurbulence');
          if (turbulence) {
            turbulence.setAttribute('seed', frame % 10);
          }
        }
      }
      requestAnimationFrame(animate);
    }
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="film-grain">
      <svg ref={svgRef} width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="0" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}