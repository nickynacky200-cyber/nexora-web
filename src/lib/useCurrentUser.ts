import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, isLoggedIn } from "./api";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  profile: {
    ageRange: string | null;
    interests: string | null;
    goal: string | null;
    readinessScore: number;
    xp: number;
    level: string;
  } | null;
};

export function useCurrentUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }
    getMe()
      .then((data) => setUser(data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
