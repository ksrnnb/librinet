import React from 'react';

export default function Errors(props) {
  const errors = props.errors;
  if (errors) {
    const errorElement = errors.map((error) => {
      return (
        <p className="error text-danger" key={error}>
          {error}
        </p>
      );
    });

    return errorElement;
  } else {
    return <></>;
  }
}
