import { useId } from 'react';
import './Logo.css';

const PATH = 'M3 51 H11 L17 36 H25 L31 21';

function Logo({ height = 46 }) {
  const maskId = 'logo-mask-' + useId().replace(/:/g, '');

  return (
    <span className="logo" style={{ gap: height * 0.065 }}>
      <svg
        className="logo__mark"
        viewBox="6.5 9.9 29.6 55"
        style={{ height, width: height * 0.54 }}
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-40" y="-40" width="130" height="140">
            <rect x="-40" y="-40" width="130" height="140" fill="white" />
            <path d={PATH} fill="none" stroke="black" strokeWidth="6.8" />
          </mask>
        </defs>
        <g transform="rotate(-25 22 28)">
          <path d={PATH} className="logo__outer" mask={`url(#${maskId})`} />
          <path d={PATH} className="logo__inner" />
        </g>
      </svg>
      <span
        className="logo__text"
        style={{ fontSize: height * 0.64, top: height * 0.04 }}
      >
        Devcompass
      </span>
    </span>
  );
}

export default Logo;