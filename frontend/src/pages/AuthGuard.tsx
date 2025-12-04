import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactElement, cloneElement } from "react";

interface AuthGuardProps {
  children: ReactElement; 
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();

  const user_id = Number(localStorage.getItem("bookflix-user_id"));
  const user_name = localStorage.getItem("bookflix-name");

  console.log("USER ID IN AUTH GUARD: ", user_id);
  console.log("USER NAME IN AUTH GUARD: ", user_name);

  useEffect(() => {
    if (!user_id || !user_name) {
      navigate("/signup");
    }
  }, [navigate, user_id, user_name]);

  if (!user_id || !user_name) return null;

  return cloneElement(children as ReactElement<any>, { user_id, user_name });
}