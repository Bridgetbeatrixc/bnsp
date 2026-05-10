"use client";

// FormEvent dipakai untuk menangani submit form tanpa reload halaman.
import type { FormEvent } from "react";
// useState dipakai untuk menyimpan input user sebelum dibuat email.
import { useState } from "react";
// Utility Tailwind bersama untuk form dan tombol.
import { cx, ui } from "@/lib/ui";

// Email admin tujuan permintaan reset password.
const adminEmail = "admin@universitasxyz.ac.id";

// Form lupa password membuat draft email ke admin.
export function ForgotPasswordForm() {
  // Nama peminjam yang lupa password.
  const [name, setName] = useState("");
  // NIM/NIK peminjam untuk membantu admin mencari akun.
  const [identityNumber, setIdentityNumber] = useState("");
  // Email atau username akun yang tidak bisa login.
  const [email, setEmail] = useState("");

  // Membuat email permintaan reset password ke admin.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Cegah browser reload halaman.
    event.preventDefault();
    // Subject email dibuat jelas untuk admin.
    const subject = encodeURIComponent("Permintaan Reset Password Akun Peminjaman");
    // Body email berisi data yang perlu dicek admin.
    const body = encodeURIComponent(
      `Halo Admin,\n\nSaya lupa password akun peminjaman Universitas XYZ.\n\nNama: ${name}\nNIM/NIK: ${identityNumber}\nEmail/Username: ${email}\n\nMohon reset password akun saya.\nTerima kasih.`
    );
    // Buka aplikasi email user dengan draft yang sudah terisi.
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form className={cx(ui.panel, ui.stack, ui.formControls, "shadow-authPanel")} onSubmit={handleSubmit}>
      <div>
        <h1 className={ui.title}>Lupa Password</h1>
        <p className={ui.subtitle}>Kirim permintaan ke admin agar password akun direset.</p>
      </div>
      <label>
        Nama
        <input onChange={(event) => setName(event.target.value)} required value={name} />
      </label>
      <label>
        NIM/NIK
        <input onChange={(event) => setIdentityNumber(event.target.value)} required value={identityNumber} />
      </label>
      <label>
        Email / Username
        <input onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
      </label>
      <p className={ui.subtitle}>Admin akan mereset password dan memberi password awal kembali.</p>
      <button className={ui.button} type="submit">Kirim ke Admin</button>
    </form>
  );
}
