import React from "react";
import PageResults from "./PageResults";
import "../styles/homepage.scss";
import "rc-pagination/assets/index.css";
import "../styles/pagination.scss";

const Home = (props) => {
  console.log("Home, props" + JSON.stringify(props));
  return <div className="relative">{<PageResults {...props} />}</div>;
};

export default Home;
