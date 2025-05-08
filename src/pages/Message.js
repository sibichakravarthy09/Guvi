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
  const [replies, setReplies] = useState({}); // reply per enquiry

  // Submit a new enquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://guvi-1j1n.onrender.com/api/messages", {
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

  // Send a reply to a specific enquiry
  const handleReply = async (enquiryId, replyText) => {
    if (!replyText) {
      setError("Reply cannot be empty.");
      return;
    }
    try {
      await axios.put(
        `https://guvi-1j1n.onrender.com/api/messages/${enquiryId}/reply`,
        { reply: replyText }
      );
      setReplies((prev) => ({ ...prev, [enquiryId]: "" }));
      fetchEnquiries();
      setSuccessMessage("Reply sent successfully.");
      setError("");
    } catch (err) {
      console.error("Error replying to message:", err);
      setError("Failed to send reply.");
    }
  };

  // Fetch enquiries for admin
  const fetchEnquiries = async () => {
    try {
      const response = await axios.get("https://guvi-1j1n.onrender.com/api/messages");
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
      <h2>{user.role === "admin" ? "Customer Enquiries" : "Your Enquiry Page"}</h2>

      {/* Enquiry Form for User */}
      {user.role === "user" && (
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
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <label>Property Type:</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    required
                  >
                    <option value="">Select Property Type</option>
                    <option value="Empty Land">Empty Land</option>
                    <option value="Agriculture Land">Agriculture Land</option>
                    <option value="Commercial Plot">Commercial Plot</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                  </select>

                  <label>Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />

                  <button type="submit">Submit Enquiry</button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Admin Enquiry Management */}
      {user.role === "admin" && (
        <div className="enquiry-list">
          {enquiries.length === 0 ? (
            <p>No enquiries found.</p>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry._id} className="enquiry-card">
                <h4>{enquiry.title}</h4>
                <p><strong>From:</strong> {enquiry.userName}</p>
                <p><strong>Type:</strong> {enquiry.propertyType}</p>
                <p><strong>Description:</strong> {enquiry.description}</p>

                <div className="reply-section">
                  <label>Reply:</label>
                  <textarea
                    value={replies[enquiry._id] || ""}
                    onChange={(e) =>
                      setReplies((prev) => ({
                        ...prev,
                        [enquiry._id]: e.target.value,
                      }))
                    }
                    placeholder="Type your reply here..."
                  />
                  <button
                    onClick={() => handleReply(enquiry._id, replies[enquiry._id])}
                  >
                    Reply
                  </button>
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
