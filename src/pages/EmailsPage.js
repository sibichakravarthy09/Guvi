import React, { useState, useContext } from "react";
import { EmailContext } from "../context/EmailContext";
import "../styles/Emails.css";

const Emails = () => {
  const { emails, handleSendEmail } = useContext(EmailContext);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ recipient: "", subject: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    try {
      await handleSendEmail(form);
      setShowModal(false);
      setForm({ recipient: "", subject: "", message: "" });
    } catch (err) {
      alert("Failed to send email.");
    }
  };

  return (
    <div className="email-wrapper">
      <div className="email-header">
        <h1>📧 Emails</h1>
        <button className="compose-btn" onClick={() => setShowModal(true)}>
          COMPOSE EMAIL
        </button>
      </div>

      <div className="email-grid">
        {emails.length === 0 ? (
          <p>No emails found.</p>
        ) : (
          emails.map((email, index) => (
            <div key={index} className="email-card">
              <h4>{email.subject || "(No Subject)"}</h4>
              <p><strong>To:</strong> {email.recipient}</p>
              <p>
                <strong>Date:</strong>{" "}
                {email.dateSent
                  ? new Date(email.dateSent).toLocaleString()
                  : "Unknown"}
              </p>
              <p className="message-preview">{email.message}</p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Compose Email</h3>
            <input
              type="text"
              name="recipient"
              placeholder="Recipient"
              value={form.recipient}
              onChange={handleChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                CANCEL
              </button>
              <button className="save-btn" onClick={handleSend}>
                SEND
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emails;
