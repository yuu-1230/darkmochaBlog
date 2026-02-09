"use client";

import React from "react";
import { ReactTyped } from "react-typed";

export const Typewriter = () => {
  return (
    <div className="text-xl font-mono text-primary">
      <span>I am </span>
      <ReactTyped
        strings={["Darkmocha", "Yuto", "Blogger"]}
        typeSpeed={100}
        backSpeed={30}
        backDelay={5000}
        loop
        showCursor
        cursorChar="_"
        className="font-bold text-primary"
      />
    </div>
  );
};
