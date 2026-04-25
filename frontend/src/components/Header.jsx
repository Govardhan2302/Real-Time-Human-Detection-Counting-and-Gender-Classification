import React from "react";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          Real-Time Human Detector
        </a>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-muted" href="#insights">Insights</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-muted" href="#tests">Test Images</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-muted" href="#about">About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
