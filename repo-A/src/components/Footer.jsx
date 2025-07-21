"use client";

import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { useState } from "react";

import SlideUpAnimation from "@/wrappers/AnimationWrappers/SlideUpAnimation";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the form data here
  };

  return (
    <div className="footer-content main-content">
      <div className="footer-topcontent">
        <div className="logo-div top-div">
          <SlideUpAnimation delay={0.5}>
            <h1>JobCircuit.</h1>
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.6}>
            <p>Join our newsletter today!</p>
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.7}>
            <form
              className="newsletter-form"
              onSubmit={handleSubmit}
              name="newsletter"
              id="newsletter"
            >
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={handleChange}
                className="newsletter-input"
                name="newletter-input"
              />
              <button type="submit" className="newsletter-submit">
                Subscribe now
              </button>
            </form>
          </SlideUpAnimation>
        </div>
        <div className="implinks-div top-div">
          <SlideUpAnimation delay={0.5}>
            <h3>IMPORTANT LINKS</h3>
          </SlideUpAnimation>
          <ul>
            <li>
              <SlideUpAnimation delay={0.6}>
                <Link href="">For Professionals</Link>
              </SlideUpAnimation>
            </li>
            <li>
              <SlideUpAnimation delay={0.7}>
                <Link href="">For Companies</Link>
              </SlideUpAnimation>
            </li>

            <li>
              <SlideUpAnimation delay={0.8}>
                <Link href="">Blogs</Link>
              </SlideUpAnimation>
            </li>

            <li>
              <SlideUpAnimation delay={0.9}>
                <Link href="">Sign in</Link>
              </SlideUpAnimation>
            </li>
          </ul>
        </div>
        <div className="uselinks-div top-div">
          <SlideUpAnimation delay={0.5}>
            <h3>USEFUL LINKS</h3>
          </SlideUpAnimation>
          <ul>
            <li>
              <SlideUpAnimation delay={0.6}>
                <Link href="">Privacy Policy</Link>
              </SlideUpAnimation>
            </li>

            <li>
              <SlideUpAnimation delay={0.7}>
                <Link href="">Terms and Conditions</Link>
              </SlideUpAnimation>
            </li>

            <li>
              <SlideUpAnimation delay={0.8}>
                <Link href="">Refunds</Link>
              </SlideUpAnimation>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottomcontent">
        <div className="contactus-content">
          <div className="contactus-topcontent">
            <div className="contactus-heading">
              <SlideUpAnimation delay={0.5}>
                <h3>Contact Us</h3>
              </SlideUpAnimation>
            </div>
            <div className="contactus-contentdiv">
              <div className="address contact-div">
                <div className="info">
                  <SlideUpAnimation delay={0.5}>
                    <h3 className="info-heading">Address</h3>
                  </SlideUpAnimation>

                  <SlideUpAnimation delay={0.6}>
                    <p>
                      2458 Manchester Areat, Near Brookefield Square,
                      <br />
                      United States of America
                    </p>
                  </SlideUpAnimation>
                </div>
              </div>
              <div className="call contact-div">
                <div className="info">
                  <SlideUpAnimation delay={0.5}>
                    <h3 className="info-heading">Call us at</h3>
                  </SlideUpAnimation>

                  <SlideUpAnimation delay={0.6}>
                    <p>+(125) 645 7712</p>
                  </SlideUpAnimation>

                  <SlideUpAnimation delay={0.7}>
                    <p>+(444) 859 9965</p>
                  </SlideUpAnimation>
                </div>
              </div>
              <div className="mail contact-div">
                <div className="info">
                  <SlideUpAnimation delay={0.5}>
                    <h3 className="info-heading">Mail us at</h3>
                  </SlideUpAnimation>

                  <SlideUpAnimation delay={0.6}>
                    <p>help@jobcircuit.com</p>
                  </SlideUpAnimation>

                  <SlideUpAnimation delay={0.7}>
                    <p>info@jobcircuit.com</p>
                  </SlideUpAnimation>
                </div>
              </div>
            </div>
          </div>
          <div className="contactus-bottomcontent">
            <div className="socialmedia-div">
              <SlideUpAnimation delay={0.5}>
                <h3>Connect with us</h3>
              </SlideUpAnimation>
              <div className="socialmediaicons">
                <SlideUpAnimation delay={0.6}>
                  <FaInstagram className="social-icons" />
                </SlideUpAnimation>

                <SlideUpAnimation delay={0.7}>
                  <FaLinkedin className="social-icons" />
                </SlideUpAnimation>

                <SlideUpAnimation delay={0.8}>
                  <FaTwitter className="social-icons" />
                </SlideUpAnimation>
              </div>
            </div>

            <div className="copyright">
              Copyright © 2023. All rights reserved. Made with ❤️ by Job Circuit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
