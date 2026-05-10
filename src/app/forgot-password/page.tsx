// Link dipakai untuk kembali ke halaman login.
import Link from "next/link";
// Form lupa password membuat draft email ke admin.
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
// Utility Tailwind bersama untuk layout login.
import { ui } from "@/lib/ui";

// Halaman lupa password untuk user yang tidak bisa login.
export default function ForgotPasswordPage() {
  return (
    <div className={ui.loginShell}>
      <div className={ui.stack}>
        <ForgotPasswordForm />
        <Link className={ui.ghostButton} href="/login">Kembali ke Login</Link>
      </div>
    </div>
  );
}
