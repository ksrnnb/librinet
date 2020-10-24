import React from 'react';

export default function Errors(props) {
  const errors = props.errors;
  if (errors) {
    const errorElement = errors.map((error) => {
      return (
        <h5 className="error text-danger mb-5" key={error}>
          {error}
        </h5>
      );
    });

    return errorElement;
  } else {
    return <></>;
  }
}
