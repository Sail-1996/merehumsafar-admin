import React from "react";
import "../CustomCss/Waves.css"; // Make sure to create and import the CSS file

const Waves = () => {
  return (
    <div className="header">
      {/* Content before waves */}
      <div className="inner-header flex">
        {/* Just the logo */}
        
      </div>

      {/* Waves Container */}
      <div>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="10" fill="rgba(60, 89, 217, 0.671)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(60, 89, 217, 0.671)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(60, 89, 217, 0.671)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f08080" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Waves;
