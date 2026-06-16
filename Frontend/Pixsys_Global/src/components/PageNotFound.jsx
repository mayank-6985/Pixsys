import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const PageNotFound = () => {
  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      padding: "20px",
      textAlign: "center",
    },
    code: {
      fontSize: "8rem",
      fontWeight: "800",
      color: "#000000",
      margin: 0,
    },
    message: {
      fontSize: "1.5rem",
      color: "#4b5563",
      marginBottom: "2rem",
    },
    button: {
      padding: "12px 30px",
      backgroundColor: "#ffd8d8",
      color: "#000000",
      fontWeight: "bold",
      textDecoration: "none",
      borderRadius: "4px",
      border: "1px solid #000000",
    },
    footer: {
      backgroundColor: "#0f172a",
      color: "#ffffff",
      padding: "40px",
      textAlign: "center",
    },
  };
  return (
    <div style={styles.wrapper}>
      <main style={styles.main}>
        <h1 style={styles.code}>404</h1>
        <p style={styles.message}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" style={styles.button}>
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default PageNotFound;
