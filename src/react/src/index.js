import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Main from "./components/Main";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
  
root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
          <Route path='t' element={<Main/>} >
            <Route path=':userID' element={<Main/>} />
          </Route>
      </Routes>
    </BrowserRouter>
);