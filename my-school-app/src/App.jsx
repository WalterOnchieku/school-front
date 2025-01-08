import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default styles
import AppRoutes from "./components/Routes";

function App() {
  return (
    <div className="App">
      <div className="pt-16">
      <AppRoutes />
      </div>
      {/* Toast container must be included once in your app */}
      <ToastContainer 
        position="top-right" // Customize position
        autoClose={3000} // Auto-close in 3 seconds
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Choose between "light", "dark", or "colored"
      />
    </div>
  );
}

export default App;
