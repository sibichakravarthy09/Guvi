import { useLeads } from "../context/LeadsContext";
import { useState } from "react";
import "../styles/LeadsPage.css"; // Import the CSS file

const Leads = () => {
  const { leads, createLead, editLead, removeLead, isFetching } = useLeads();
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "" });
  const [editingLead, setEditingLead] = useState(null); // Track which lead is being edited

  const handleChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingLead) {
      // If editing, update the lead
      await editLead(editingLead._id, newLead);
      setEditingLead(null);
    } else {
      // Otherwise, create a new lead
      await createLead(newLead);
    }
    setNewLead({ name: "", email: "", phone: "" });
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setNewLead({ name: lead.name, email: lead.email, phone: lead.phone });
  };

  return (
    <div className="leads-container">
      <h1>All Leads</h1>
      <form onSubmit={handleSubmit} className="leads-form">
        <input type="text" name="name" placeholder="Name" value={newLead.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={newLead.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newLead.phone} onChange={handleChange} required />
        <button type="submit">{editingLead ? "Update Lead" : "Add Lead"}</button>
      </form>

      {isFetching ? <p>Loading leads...</p> : leads.length > 0 ? (
        <table className="leads-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead._id}>
                <td>{index + 1}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(lead)}>Edit</button>
                  <button className="delete-btn" onClick={() => removeLead(lead._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leads found.</p>
      )}
    </div>
  );
};

export default Leads;
