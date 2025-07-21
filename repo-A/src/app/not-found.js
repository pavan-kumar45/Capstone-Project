"use client";

import "./page.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <img src="../404.svg" className="notfound-image" />
      <p>
        The page you have requested for is not found or have been permanently
        removed.
      </p>
      <div className="buttons">
        <button className="tryagain-button" type="button">
          Try Again
        </button>
        <button className="gohome-button" type="button">
          <Link href="/" className="gohome-link">
            Go Home
          </Link>
        </button>
      </div>
    </div>
  );
}
