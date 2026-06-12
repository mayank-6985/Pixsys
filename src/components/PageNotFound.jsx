import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      PageNotFound
      <h1>
        <Link to={"/"}>back to home </Link>{" "}
      </h1>
    </div>
  );
};

export default PageNotFound;
