"use client";
import Link from "next/link";
import "./ComponentsStyle.css";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function NavBar() {
  const [responsiveNavBarClassName, setResponsiveNavBarClassName] = useState(
    "navbar-responsive-menu-hidden"
  );

  function handleResponsiveMenu() {
    setResponsiveNavBarClassName("navbar-responsive-menu-visible");
  }
  function closeResponsiveNavbar() {
    setResponsiveNavBarClassName("navbar-responsive-menu-hidden");
  }

  return (
    <main className="navbar main-content">
      <div className="navbar-logo">
        <h1>JobCircuit.</h1>
      </div>
      <div className="navbar-menu">
        <ul className="navbar-menuList">
          <li className="list">
            <Link href="/Professionals/Welcome" className="link">
              For Professionals
            </Link>
          </li>
          <li className="list">
            <Link href="/" className="link">
              For Companies
            </Link>
          </li>
          <li className="list">
            <Link href="/" className="link">
              Blogs
            </Link>
          </li>
          <li className="list">
            <Link href="/" className="auth-link">
              Get Started
            </Link>
          </li>
          <li className="list navbar-hamburger-list">
            <button
              type="button"
              className="navbar-hamburger"
              onClick={handleResponsiveMenu}
              aria-label="Menu"
              title="Menu"
            >
              <GiHamburgerMenu className="hamburger-icon" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
      <div className={responsiveNavBarClassName}>
        <div className="responsive-menu">
          <ul className="navbar-responsive-menuList">
            <li className="responsive-list">
              <Link href="/assessment" className="link">
                For Professionals
              </Link>
            </li>
            <li className="responsive-list">
              <Link href="/" className="link">
                For Companies
              </Link>
            </li>
            <li className="responsive-list">
              <Link href="/" className="link">
                Blogs
              </Link>
            </li>
            <li className="responsive-list">
              <Link href="/" className="auth-link">
                Get Started
              </Link>
            </li>
          </ul>
          <div className="close-responsive-navbar">
            <button
              type="button"
              className="close-navbar"
              onClick={closeResponsiveNavbar}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
