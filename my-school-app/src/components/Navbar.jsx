import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between p-4 bg-sky-800 z-50 shadow-lg">
      <div className="flex space-x-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Students
        </NavLink>
        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Teachers
        </NavLink>
        <NavLink
          to="/classes"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Classes
        </NavLink>
        <NavLink
          to="/subjects"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Subjects
        </NavLink>
        <NavLink
          to="/scores"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Scores
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Reports
        </NavLink>
        <NavLink
          to="/fees"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Fee Structure
        </NavLink>
        <NavLink
          to="/pickup-location"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Pickup location
        </NavLink>
        <NavLink
          to="/feepayment"
          className={({ isActive }) =>
            isActive ? "text-orange-500 underline font-bold" : "text-white hover:underline font-semibold"
          }
        >
          Fee Payment
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
