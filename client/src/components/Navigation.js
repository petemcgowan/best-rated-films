import React from "react";
import { observer } from "mobx-react";
import "../styles/nav.scss";

const Navigation = observer(() => {
  return (
    <header>
      <div className="menu-grid"></div>
    </header>
  );
});

export default Navigation;
