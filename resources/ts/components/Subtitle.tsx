import React from 'react';

export default function Subtitle(props: any) {
  return (
    <div className="col-12 px-0">
      <h3 className="mb-3" id="subtitle">
        {props.subtitle}
      </h3>
    </div>
  );
}
