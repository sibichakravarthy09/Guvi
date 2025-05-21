import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- import AuthContext
import Apartment from "../images/Apartment.jpg";
import Duplex from "../images/Duplex.jpg";
import Townhouse from "../images/Town house.jpg";
import Villa from "../images/villa.jpg";
import Penthouse from "../images/Penthhouse.jpg";
import Plot from "../images/plot.jpg";
import Agriculture from "../images/agri.jpg";
import "../styles/Property.css";

const propertyData = [
  { title: "Apartment", image: Apartment, properties: 449 },
  { title: "Duplex", image: Duplex, properties: 58 },
  { title: "Townhouse", image: Townhouse, properties: 120 },
  { title: "Villa", image: Villa, properties: 131 },
  { title: "Penthouse", image: Penthouse, properties: 109 },
  { title: "Plot", image: Plot, properties: 109 },
  { title: "Agriculture Land", image: Agriculture, properties: 109 },
];

const Property = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // <-- get the logged-in user

  const handleMessageClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/message");
    } else if (user?.role === "lead") {
      navigate("/lead/message");
    } else {
      navigate("/customer/message"); // default for users
    }
  };

  return (
    <div className="property-container">
      <h2>Explore Our Service Types</h2>
      <div className="property-grid">
        {propertyData.map((item, index) => (
          <div className="property-card" key={index}>
            <img src={item.image} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.properties} Properties</p>
          </div>
        ))}
      </div>

      {/* Message us link */}
      <div className="query-message">
        <p>
          If you have any queries,{" "}
          <span className="message-link" onClick={handleMessageClick}>
            message us
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default Property;
