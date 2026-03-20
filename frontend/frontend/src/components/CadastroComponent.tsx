import "../css/login.css";
import api from "../api";
import {useState } from "react";
import { useNavigate } from "react-router-dom";

const CadastroComponent = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const submitHandler = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
           await api.post("/users", { name, email, password })
            alert("Usuário cadastrado com sucesso!");
            navigate("/login");
        }
        catch(error){
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
        }
    }

  return (
    <div id="container">
        <h2>Cadastro</h2>
        <form onSubmit={submitHandler}>
            <div>
                <label>Nome:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Senha:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Registrar</button>
        </form>
        <a href="/login">Já tem conta? Faça login</a>
    </div>
  )
}

export default CadastroComponent
