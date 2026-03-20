import CadastroComponent from "./components/CadastroComponent"
import LoginComponent from "./components/LoginComponent"
import { Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import Catalogo from "./components/Catalogo"
import CreateProduct from "./components/CreateProduct"
function App() {


  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/cadastro" element={<CadastroComponent />} />
      <Route path="/" element = {<MainPage/>}/>
      <Route path="/catalogo" element = {<Catalogo/>}/>
      <Route path = "/cadastroProduct" element = {<CreateProduct/>}/>
    </Routes>
    </>
  )
}

export default App
