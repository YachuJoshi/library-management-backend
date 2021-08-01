import express from "express";
import { getAllBooks, getBookByISBN, getAvailableBooks } from "./books.queries";
import { leaseBook } from "./books.controller";

const router = express.Router();
router.get("/", getAllBooks);
router.get("/available", getAvailableBooks);
router.get("/:isbn", getBookByISBN);
router.post("/:isbn/lease", leaseBook);

export default router;
