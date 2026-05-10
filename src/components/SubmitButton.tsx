import { ui } from "@/lib/ui";

// Komponen tombol submit sederhana yang bisa dipakai ulang.
export function SubmitButton({ children = "Simpan" }: { children?: React.ReactNode }) {
  return <button className={ui.button} type="submit">{children}</button>;
}
