import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

// 1. Adicionamos o 'role' na tipagem do Usuário
interface User {
  id: string; 
  name: string;
  email: string;
  token: string;
  role?: string; // <-- NOVO: Perfil do usuário (ex: 'admin' ou 'user')
}

// 2. Avisamos ao TypeScript tudo que nosso Contexto vai exportar
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null; // <-- NOVO
  role: string | null;  // <-- NOVO
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider que vai envolver a aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // Lemos o localStorage logo no valor inicial para não "piscar" a tela de login ao dar F5
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@Bereshit:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Atualiza o LocalStorage automaticamente sempre que o estado 'user' mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('@Bereshit:user', JSON.stringify(user));
    } else {
      localStorage.removeItem('@Bereshit:user');
    }
  }, [user]);

  // Função para logar o usuário
  const login = (userData: User) => {
    setUser(userData);
  };

  // Função para deslogar
  const logout = () => {
    setUser(null);
  };

  // 3. Extraímos o token e a role de dentro do 'user' com segurança (se o user for null, eles viram null)
  const token = user?.token || null;
  const role = user?.role || null;

  return (
    // Agora sim! Passamos as variáveis certinhas pro Provider
    <AuthContext.Provider value={{ user, login, logout, token, role, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do Contexto nos componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthProvider;