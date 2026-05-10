// Tipe pesan dibatasi agar style notifikasi konsisten.
type FlashMessageType = "success" | "error";

// Props notifikasi menerima tipe dan isi pesan.
type FlashMessageProps = {
  type: FlashMessageType;
  message: string;
};

// Komponen notifikasi kecil untuk hasil tambah, ubah, hapus, dan update status.
export function FlashMessage({ type, message }: FlashMessageProps) {
  // Pilih class CSS berdasarkan tipe pesan.
  const className = type === "success" ? ui.successMessage : ui.errorMessage;

  return <p className={className}>{message}</p>;
}
// Utility Tailwind bersama untuk pesan sukses dan error.
import { ui } from "@/lib/ui";
