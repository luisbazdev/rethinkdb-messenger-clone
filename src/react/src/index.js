import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";

import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
  
root.render(
  <AuthProvider>
    <ChatProvider>
      <App/>
    </ChatProvider>
  </AuthProvider>

);