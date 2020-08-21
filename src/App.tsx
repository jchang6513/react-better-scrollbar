import * as React from "react";
import "./styles.css";
import { BetterScrollbar } from "./better_scrollbar/BetterScrollbar";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <BetterScrollbar maxWidth={800} maxHeight={1000}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3d/LARGE_elevation.jpg"
          alt=""
        />
      </BetterScrollbar>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
