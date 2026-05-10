// Link dipakai untuk kembali ke halaman login.
import Link from "next/link";
// Form lupa password membuat draft email ke admin.
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

// Halaman lupa password untuk user yang tidak bisa login.
export default function ForgotPasswordPage() {
  return (
    <div className="login-shell">
      <div className="stack">
        <ForgotPasswordForm />
        <Link className="button ghost" href="/login">Kembali ke Login</Link>
      </div>
    </div>
  );
}
