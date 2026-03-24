import multer from "multer";
import path from "path";
import fs from "fs"; // Adicione o fs para lidar com pastas

// 1. Definimos o caminho exato (saindo do backend e indo pra uploads)
const uploadFolder = path.resolve(process.cwd(), "..", "uploads");

// 2. Garantimos que a pasta existe antes de tentar salvar
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

export const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder); // Aponta para a pasta garantida
    },
    filename: (req, file, cb) => {
      let ext = path.extname(file.originalname);
      
      if (!ext) {
        ext = `.${file.mimetype.split('/')[1]}`; 
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}${ext}`); 
    }
  })
};