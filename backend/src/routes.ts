import { Router } from "express";
import { authMiddleware, adminMiddleware } from "./middlewares/authMiddleware";
import { createProduct, deletarProduto, listarProdutos, atualizarProduto } from "./controllers/ProductControllers";
import { criarUsuario, loginUsuario } from "./controllers/UserControllers";
import multer from "multer";
import { multerConfig } from "./multer";
const router = Router();
const upload = multer(multerConfig);
router.post("/products", upload.single("image"), createProduct);
router.delete("/products/:id", authMiddleware, adminMiddleware, deletarProduto);
router.get("/products", listarProdutos);
router.put("/products/:id", authMiddleware, adminMiddleware, upload.single("image"), atualizarProduto);
router.post("/users", criarUsuario);
router.post("/login", loginUsuario);


export default router;