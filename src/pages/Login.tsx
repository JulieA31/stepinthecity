import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface LoginProps {
  onClose?: () => void;
}

const Login = ({ onClose }: LoginProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté",
          });
          
          if (onClose) {
            onClose();
          } else {
            navigate("/");
          }
        }
      } else {
        if (password.length < 6) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Le mot de passe doit contenir au moins 6 caractères",
          });
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              username: email.split("@")[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Compte créé avec succès",
            description: "Vous pouvez maintenant vous connecter",
          });
          
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      }

      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose || (() => navigate(-1))}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Connexion" : "Créer un compte"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Connectez-vous à votre compte"
              : "Créez votre compte pour accéder à plus de fonctionnalités"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin
              ? "Pas encore de compte ? Créez-en un"
              : "Déjà un compte ? Connectez-vous"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Login;