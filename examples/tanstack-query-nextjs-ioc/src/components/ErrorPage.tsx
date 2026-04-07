'use client';

type Props = {
  error?: Error;
};

export const ErrorPage = ({ error }: Props) => {
  if (error) {
    console.error(error);
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.message ?? 'Unknown Error'}</i>
      </p>
    </div>
  );
};
