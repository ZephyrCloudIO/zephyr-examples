import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MyButton } from "./MyButton";
import React from 'react';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <h1>TSDown Example</h1>
    <MyButton />
  </StrictMode>,
);
