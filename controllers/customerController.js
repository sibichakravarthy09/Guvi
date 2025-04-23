import Customer from "../models/Customer.js";

// Create a Customer
export const createCustomer = async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error creating customer" });
    }
};

// Get All Customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers" });
    }
};

// Update a Customer
export const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer" });
    }
};

// Delete a Customer
export const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer" });
    }
};
