import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const LandingFooter = () => {
  const screenWidth = useWindowDimensions().width;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    screenWidth > 376 ? setIsMobile(false) : setIsMobile(true);
  }, [screenWidth]);

  return (
    <footer className={styles.footer}>
      <div className={styles.body}>
        <div className={styles.logo}>CC:0</div>
        <div className={styles.text}>
          This DAO exists to accelerate the entire creative world to the long
          overdue, very near future when control over creative works no longer
          ruin so many lives.
        </div>
      </div>
      <div className={styles.links}>
        <a href="https://twitter.com/cc0dao" target="_blank" rel="noreferrer">
          Twitter
        </a>
        <a href="https://discord.gg/RWj3xrsMjb" target="_blank" rel="noreferrer">
          Discord
        </a>
        <a href="https://github.com/cc0dao" target="_blank" rel="noreferrer">
          Github
        </a>
        <a href="https://docs.cc0dao.xyz/" target="_blank" rel="noreferrer">
          Documentation
        </a>
        <a href="https://cc0dao.medium.com/" target="_blank" rel="noreferrer">
          Medium
        </a>
        <a href="https://mirror.xyz/cc0dao.eth" target="_blank" rel="noreferrer">
          Mirror
        </a>
      </div>
    </footer>
  );
};

export default LandingFooter;
