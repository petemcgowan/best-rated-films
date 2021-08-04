import React from "react";
import PageResults from "./PageResults";
import "../styles/homepage.scss";
import "rc-pagination/assets/index.css";
import "../styles/pagination.scss";
const Home = (props) => {
  console.log("Home, props" + JSON.stringify(props));

  // changePage = (page) => {
  //   this.props.homeStore.currentPage = page;
  //   console.log("changePage, page:", page);
  //   this.props.homeStore.getPageResults(this.props.homeStore.currentPage);
  //   this.scrollTop();
  // };

  // scrollTop = () => {
  //   window.scrollTo(0, 0);
  // };

  return <div className="relative">{<PageResults {...props} />}</div>;
  // return (
  //   <div className="relative">
  //     {<PageResults changePage={this.changePage} scrollTop={this.scrollTop} />}
  //   </div>
  // );
};

export default Home;
