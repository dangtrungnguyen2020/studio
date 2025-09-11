interface UserClaims {
  uid: string;
  email: string;
  role?: "admin" | "editor" | "viewer";
}
