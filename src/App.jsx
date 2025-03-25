import "./App.css";
import {Header,Footer} from './components'
import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./backend/auth";
import {login,logout} from './store/authSlice'
import './index.css'; 
//import {RSA} from "./cryptography/rsa";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <div>Loading</div>
  ) : (
    <div className="bg-gradient-to-r from-gold-500 via-white-500 to-orange-500 min-h-screen flex flex-col">
  {/* Header with bottom margin */}
  <Header className="mb-6" />
  {/* Main Content with vertical padding */}
  <div className="flex-grow py-6">
    <Outlet />
  </div>

  {/* Footer with top margin */}
  <Footer className="mt-6" />
</div>

  );
}

export default App;
