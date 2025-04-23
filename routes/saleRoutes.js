const express = require("express");
const router = express.Router();

const { getAllSales, createSale, updateSale, deleteSale } = require("../controllers/saleController");

router.get("/", isAdmin, getAllSales);
router.post("/", isAdmin, createSale);
router.put("/:id", isAdmin, updateSale);
router.delete("/:id", isAdmin, deleteSale);

module.exports = router;
