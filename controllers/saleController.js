import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import Customer from "../models/Customer.js"; // Import Customer model

// Create a Sale
const createSale = async (req, res) => {
    try {
      const { dealName, customer, property, amount, stage } = req.body;
  
      if (!dealName || !customer || !property || !amount || !stage) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if customer exists
      const existingCustomer = await Customer.findById(customer);
      if (!existingCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      // Create the sale
      const sale = new Sale({ dealName, customer, property, amount, stage });
      await sale.save();
  
      // Push sale ID to customer's purchase history
      existingCustomer.purchaseHistory.push(sale._id);
      await existingCustomer.save();
  
      res.status(201).json(sale);
    } catch (error) {
      console.error("❌ Error creating sale:", error);
      res.status(500).json({ message: "Error creating Sale" });
    }
  };

export default createSale;


// Get All Sales (Populating Customer Data)
export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate("customer", "name email"); // Populate customer details
        res.json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: "Error fetching sales" });
    }
};

// Update a Sale
export const updateSale = async (req, res) => {
    try {
        const { dealName, customer, property, amount, stage } = req.body;
        const updatedSale = await Sale.findByIdAndUpdate(
            req.params.id,
            { dealName, customer, property, amount, stage },
            { new: true }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.json(updatedSale);
    } catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).json({ message: "Error updating sale" });
    }
};

// Delete a Sale
export const deleteSale = async (req, res) => {
    try {
        const deletedSale = await Sale.findByIdAndDelete(req.params.id);
        if (!deletedSale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.json({ message: "Sale deleted successfully" });
    } catch (error) {
        console.error("Error deleting sale:", error);
        res.status(500).json({ message: "Error deleting sale" });
    }
};
