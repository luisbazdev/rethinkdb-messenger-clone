import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import Login from "./components/Login";
import Main from "./components/Main";


const root = ReactDOM.createRoot(
  document.getElementById("root")
  );
  
root.render(
  <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
            <Route path='t' element={<Main/>} >
              <Route path=':userID' element={<Main/>} />
            </Route>
        </Routes>
      </BrowserRouter>
  </AuthProvider>
);