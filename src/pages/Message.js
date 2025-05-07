import React, { useState, useEffect } from "react";
import "../styles/Message.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Message = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reply, setReply] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/messages", {
        title,
        propertyType,
        description,
        userId: user._id,
        userName: user.name,
      });
      setSuccessMessage("Enquiry submitted successfully!");
      setError("");
      setTitle("");
      setPropertyType("");
      setDescription("");
      setShowModal(false);
    } catch (err) {
      setError("Failed to submit enquiry.");
    }
  };

  const handleReply = async (enquiryId) => {
    try {
      await axios.put(`/api/messages/${enquiryId}/reply`, { reply });
      setReply("");  // Clear reply input after submission
      fetchEnquiries();  // Refresh the list after replying
    } catch (err) {
      console.error("Error replying to message:", err);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get("/api/messages");
      setEnquiries(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (user.role === "admin") {
      fetchEnquiries();
    }
  }, [user]);

  return (
    <div className="message-container">
      <h2>Messages</h2>

      {/* For customers only – Enquiry Button */}
      {user.role === "customer" && (
        <>
          <button className="enquiry-btn" onClick={() => setShowModal(true)}>
            Make Enquiry
          </button>

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                <h2>Enquiry Form</h2>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                  <label>Title:</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  
                  <label>Property Type:</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
                    <option value="">Select Property Type</option>
                    <option value="Empty Land">Empty Land</option>
                    <option value="Agriculture Land">Agriculture Land</option>
                    <option value="Commercial Plot">Commercial Plot</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                  </select>

                  <label>Description:</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                  <button type="submit">Submit Enquiry</button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* For admins – Show messages list */}
      {user.role === "admin" && (
        <div className="enquiry-list">
          <h3>Customer Enquiries</h3>
          {enquiries.length === 0 ? (
            <p>No enquiries found.</p>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry._id} className="enquiry-card">
                <h4>{enquiry.title}</h4>
                <p><strong>From:</strong> {enquiry.userName}</p>
                <p><strong>Type:</strong> {enquiry.propertyType}</p>
                <p><strong>Description:</strong> {enquiry.description}</p>

                {/* Admin Reply Section */}
                <div className="reply-section">
                  <label>Reply:</label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                  />
                  <button onClick={() => handleReply(enquiry._id)}>Reply</button>
                </div>

                {enquiry.reply && (
                  <div className="reply">
                    <strong>Admin Reply:</strong>
                    <p>{enquiry.reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
