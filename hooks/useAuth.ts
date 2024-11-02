import { supabase } from "@/lib/supabase";
import { AuthError, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticed, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<AuthError>();

  useEffect(() => {
    setIsAuthLoading(true);
    supabase.auth.getSession().then(({ data, error }) => {
      if (data) {
        setIsAuthenticated(true);
        setUser(data.session?.user);
        setError(undefined);
        return;
      }
      if (error) {
        setIsAuthenticated(false);
        setUser(undefined);
        setError(error);
      }
      setIsAuthLoading(false);
    });
  }, []);

  return { isAuthLoading, isAuthenticed, user, error };
}
