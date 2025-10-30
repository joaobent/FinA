'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './reveal.module.css';
import clsx from 'clsx';

export default function Reveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.2,
  once = true,
  as = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={clsx(styles.reveal, { [styles.show]: visible }, className)}
      style={{ '--d': `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
