import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function NoEncontrada() {
  const { session } = useAuth();

  return <Redirect href={session ? "/" : "/login"} />;
}
