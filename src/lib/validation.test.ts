import { describe, expect, it } from "vitest";
import {
  borrowerSchema,
  equipmentSchema,
  borrowingSchema,
  roomSchema,
  validateEquipmentStock
} from "@/lib/validation";

describe("critical input validation", () => {
  it("rejects empty required borrower fields", () => {
    expect(() =>
      borrowerSchema.parse({
        name: "",
        identityNumber: "22001",
        phone: "08123456789",
        accountType: "MAHASISWA"
      })
    ).toThrow();
  });

  it("rejects zero or negative duration", () => {
    expect(() =>
      borrowingSchema.parse({
        borrowerId: "borrower-1",
        roomId: "room-1",
        requestDate: "2026-05-09",
        usageDate: "2026-05-10",
        durationHours: 0,
        purpose: "Seminar",
        equipmentItems: [{ equipmentId: "equipment-1", quantity: 1 }]
      })
    ).toThrow();

    expect(() =>
      borrowingSchema.parse({
        borrowerId: "borrower-1",
        roomId: "room-1",
        requestDate: "2026-05-09",
        usageDate: "2026-05-10",
        durationHours: -1,
        purpose: "Seminar",
        equipmentItems: [{ equipmentId: "equipment-1", quantity: 1 }]
      })
    ).toThrow();
  });

  it("rejects negative room and equipment numbers", () => {
    expect(() =>
      roomSchema.parse({
        code: "KLS-001",
        name: "Ruang Kelas",
        capacity: -1,
        building: "Gedung A",
        floor: 1,
        status: "TERSEDIA"
      })
    ).toThrow();

    expect(() =>
      roomSchema.parse({
        code: "KLS-001",
        name: "Ruang Kelas",
        capacity: 30,
        building: "Gedung A",
        floor: -1,
        status: "TERSEDIA"
      })
    ).toThrow();

    expect(() =>
      equipmentSchema.parse({
        code: "CAM-001",
        name: "Kamera",
        stock: -1,
        category: "Dokumentasi"
      })
    ).toThrow();
  });

  it("rejects borrowed equipment quantity above stock", () => {
    expect(() =>
      validateEquipmentStock(
        [{ equipmentId: "camera", quantity: 3 }],
        new Map([["camera", 2]])
      )
    ).toThrow("Jumlah peralatan");
  });

  it("accepts room-only borrowing data", () => {
    expect(() =>
      borrowingSchema.parse({
        borrowerId: "borrower-1",
        roomId: "room-1",
        requestDate: "2026-05-09",
        usageDate: "2026-05-10T09:00",
        durationHours: 2,
        purpose: "Rapat himpunan",
        equipmentItems: []
      })
    ).not.toThrow();
  });

  it("accepts equipment-only borrowing data", () => {
    expect(() =>
      borrowingSchema.parse({
        borrowerId: "borrower-1",
        roomId: "",
        requestDate: "2026-05-09",
        usageDate: "2026-05-10T09:00",
        durationHours: 2,
        purpose: "Syuting konten akademik",
        equipmentItems: [{ equipmentId: "equipment-1", quantity: 1 }]
      })
    ).not.toThrow();
  });

  it("rejects borrowing without room and equipment", () => {
    expect(() =>
      borrowingSchema.parse({
        borrowerId: "borrower-1",
        roomId: "",
        requestDate: "2026-05-09",
        usageDate: "2026-05-10T09:00",
        durationHours: 2,
        purpose: "Kosong",
        equipmentItems: []
      })
    ).toThrow();
  });

  it("accepts valid borrowing data", () => {
    expect(() =>
      borrowingSchema.parse({
        borrowerId: "borrower-1",
        roomId: "room-1",
        requestDate: "2026-05-09",
        usageDate: "2026-05-10",
        durationHours: 2,
        purpose: "Rapat himpunan",
        equipmentItems: [{ equipmentId: "equipment-1", quantity: 1 }]
      })
    ).not.toThrow();
  });
});
