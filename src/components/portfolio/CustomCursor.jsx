import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHover = useRef(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return;

    document.body.style.cursor = 'none';

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a, button, [data-hover], input, textarea, select')) {
        isHover.current = true;
      } else {
        isHover.current = false;
      }
    };

    function animate() {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x - 4}px`;
        dotRef.current.style.top = `${pos.current.y - 4}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x - 18}px`;
        ringRef.current.style.top = `${ringPos.current.y - 18}px`;
        ringRef.current.style.transform = isHover.current ? 'scale(1.6)' : 'scale(1)';
        ringRef.current.style.opacity = isHover.current ? '0.3' : '0.5';
      }
      requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    const id = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(id);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" style={{ transition: 'transform 0.2s, opacity 0.2s' }} />
    </>
  );
}