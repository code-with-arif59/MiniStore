import express from "express";
import {saveAdress,getAddress,updateAddress} from "../Controller/adressController.js";

const router = express.Router();

router.post("/add", saveAdress);

router.get("/:userId", getAddress);

router.put("/:id", updateAddress);

export default router;
