import React, { ReactElement } from 'react';

export default function Errors(props: { errors: string[] }) {
  const errors: string[] = props.errors;
  if (errors) {
    const errorElement: ReactElement[] = errors.map((error: string) => {
      return (
        <h5 className="error text-danger mb-3" key={error}>
          {error}
        </h5>
      );
    });

    return <>{errorElement}</>;
  } else {
    return <></>;
  }
}
