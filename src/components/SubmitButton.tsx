// Komponen tombol submit sederhana yang bisa dipakai ulang.
export function SubmitButton({ children = "Simpan" }: { children?: React.ReactNode }) {
  return <button type="submit">{children}</button>;
}
