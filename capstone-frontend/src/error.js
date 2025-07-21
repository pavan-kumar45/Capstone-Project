"use client";

export default function error({ error, reset }) {
  return (
    <div className="error-page">
      <img src="../error.svg" />
      <p>
        There is an internal error. Please try again later or contact <br />
        <b>administrator@jobcircuit.com</b>
      </p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
