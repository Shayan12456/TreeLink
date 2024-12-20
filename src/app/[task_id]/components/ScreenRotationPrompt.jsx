"use client";

import React, { useEffect, useState } from "react";

const ScreenRotationPrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  const checkOrientation = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  };

  useEffect(() => {
    // Check orientation on load
    checkOrientation();

    // Add event listener for orientation changes
    window.addEventListener("resize", checkOrientation);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return (
    <>
      {isPortrait && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.message}>Please rotate your device</h2>
            <p style={styles.subtext}>This page is best viewed in landscape mode.</p>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    width: "80%",
    maxWidth: "400px",
  },
  message: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  subtext: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#666",
  },
};

export default ScreenRotationPrompt;