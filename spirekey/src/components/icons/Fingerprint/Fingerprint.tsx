import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import * as styles from './Fingerprint.css';

interface FingerprintProps {
  size?: number;
  animating: boolean;
  success: boolean;
  onSuccessAnimationEnd?: () => void;
}

const Fingerprint: React.FC<FingerprintProps> = ({
  size = 64,
  animating,
  success,
  onSuccessAnimationEnd,
}) => {
  const [isAnimating, setIsAnimating] = useState(animating);
  const [isSuccesful, setIsSuccesful] = useState(success);

  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svgElement = lineRef.current;
    if (svgElement && !animating) {
      const handleAnimationEnd = () => {
        if (success) {
          setIsSuccesful(true);

          svgElement.addEventListener('animationend', () => {
            onSuccessAnimationEnd?.();
          });
        }
        setIsAnimating(false);
      };

      svgElement.addEventListener('animationiteration', handleAnimationEnd);

      return () => {
        svgElement.removeEventListener(
          'animationiteration',
          handleAnimationEnd,
        );
      };
    }
  }, [animating, lineRef]);

  useEffect(() => {
    if (animating) {
      setIsAnimating(true);
    }
  }, [animating]);

  return (
    <svg
      data-style="animated"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn({
        [styles.animating]: isAnimating,
        [styles.success]: isSuccesful,
      })}
      data-testid="fingerprint-icon"
    >
      <g>
        <path
          className={styles.backgroundLine}
          d="M17.3162078,4.6708828c-1.8191685-.9380068-3.4027032-1.338229-5.294928-1.338229-1.8982987,0-3.6832671.452115-5.3053192,1.3437738"
        />
        <path
          className={styles.backgroundLine}
          d="M19.7624073,9.4463113c-.8402316-1.1894287-1.9671858-2.1668207-3.260908-2.8290676-1.3480065-.6904367-2.902145-1.0554217-4.4943355-1.0554217-1.5998728,0-3.1574822.3684346-4.5044305,1.0654531-1.2958386.6669664-2.3946876,1.6233007-3.2651407,2.8419773"
        />
        <path
          className={styles.backgroundLine}
          d="M9.950372,20.5079007h0ZM9.9497159,20.5008744c-.7605935-.7606147-1.1736196-1.2502525-1.7627468-2.3142242-.5919208-1.0551677-.9041664-2.3517681-.9041664-3.7517732,0-2.4716803,2.1215732-4.4825263,4.7293345-4.4825263s4.7293134,2.010846,4.7293134,4.4825263"
        />
        <path
          className={styles.backgroundLine}
          d="M17.5372813,18.7140437l-.0061374.0011428c-.5118679.0987993-2.1566108.306481-3.6041158-.6339302-1.2583842-.8175438-1.9825081-2.2046398-1.9825081-3.6463792"
        />
        <path
          className={styles.backgroundLine}
          d="M5.5718218,17.8963723c-.751349-1.971901-.8725172-4.5271337-.0593635-6.2328924,1.1438638-2.3994917,3.6809815-3.9505828,6.4631085-3.9505828,3.9131658,0,7.0967425,3.0113696,7.0967425,6.7128373,0,1.2368348-1.0636331,2.2430726-2.371048,2.2430726-1.3073938,0-2.371048-1.0062378-2.371048-2.2430726,0-1.2227611-1.0521837-2.2175495-2.3455038-2.2175495s-2.3455038.9947884-2.3455038,2.2175495c0,1.6846113.6537181,3.260654,1.8407129,4.4378502.9320387.9222189,1.8244806,1.4278562,3.1833651,1.8037616"
        />
      </g>
      <g>
        <path
          className={styles.line}
          d="M17.3162078,4.6708828c-1.8191685-.9380068-3.4027032-1.338229-5.294928-1.338229-1.8982987,0-3.6832671.452115-5.3053192,1.3437738"
          ref={lineRef}
        />
        <path
          className={styles.line}
          d="M19.7624073,9.4463113c-.8402316-1.1894287-1.9671858-2.1668207-3.260908-2.8290676-1.3480065-.6904367-2.902145-1.0554217-4.4943355-1.0554217-1.5998728,0-3.1574822.3684346-4.5044305,1.0654531-1.2958386.6669664-2.3946876,1.6233007-3.2651407,2.8419773"
        />
        <path
          className={styles.line}
          d="M9.950372,20.5079007h0ZM9.9497159,20.5008744c-.7605935-.7606147-1.1736196-1.2502525-1.7627468-2.3142242-.5919208-1.0551677-.9041664-2.3517681-.9041664-3.7517732,0-2.4716803,2.1215732-4.4825263,4.7293345-4.4825263s4.7293134,2.010846,4.7293134,4.4825263"
        />
        <path
          className={styles.line}
          d="M17.5372813,18.7140437l-.0061374.0011428c-.5118679.0987993-2.1566108.306481-3.6041158-.6339302-1.2583842-.8175438-1.9825081-2.2046398-1.9825081-3.6463792"
        />
        <path
          className={styles.line}
          d="M5.5718218,17.8963723c-.751349-1.971901-.8725172-4.5271337-.0593635-6.2328924,1.1438638-2.3994917,3.6809815-3.9505828,6.4631085-3.9505828,3.9131658,0,7.0967425,3.0113696,7.0967425,6.7128373,0,1.2368348-1.0636331,2.2430726-2.371048,2.2430726-1.3073938,0-2.371048-1.0062378-2.371048-2.2430726,0-1.2227611-1.0521837-2.2175495-2.3455038-2.2175495s-2.3455038.9947884-2.3455038,2.2175495c0,1.6846113.6537181,3.260654,1.8407129,4.4378502.9320387.9222189,1.8244806,1.4278562,3.1833651,1.8037616"
        />
      </g>
    </svg>
  );
};

export default Fingerprint;
