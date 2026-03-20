import { useNavigate } from "react-router-dom";
import api from "../api";
import "../css/login.css";
import { useState } from "react";
const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
   const submitHandler = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
           await api.post("/login", { email, password })
            alert("Login realizado com sucesso!");
            navigate("/");
        }
        catch(error){
            console.error("Erro ao realizar login:", error);
            alert("Erro ao realizar login. Verifique os dados e tente novamente.");
        }
    }

  return (
    <div id="container">
        <h2>Login</h2>
        <form onSubmit={submitHandler}>
            <div id="contTwo">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Senha:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Entrar</button>
        </form>
        <a href="/cadastro">Não tem conta? Cadastre-se</a>
    </div>
  )
}

export default LoginComponent
