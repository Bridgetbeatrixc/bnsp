import { describe, expect, it } from "vitest";
import {
  canManageMasterData,
  canUpdateBorrowingStatus,
  canViewBorrowing,
  resolveBorrowerIdForBorrowing
} from "@/lib/access";

describe("role-based access rules", () => {
  it("allows only admin to manage borrower, room, and equipment CRUD", () => {
    expect(canManageMasterData("ADMIN")).toBe(true);
    expect(canManageMasterData("MAHASISWA")).toBe(false);
    expect(canManageMasterData("DOSEN")).toBe(false);
  });

  it("allows only admin to update borrowing status", () => {
    expect(canUpdateBorrowingStatus("ADMIN")).toBe(true);
    expect(canUpdateBorrowingStatus("MAHASISWA")).toBe(false);
    expect(canUpdateBorrowingStatus("DOSEN")).toBe(false);
  });

  it("allows admin to view every borrowing history", () => {
    expect(canViewBorrowing("ADMIN", null, "borrower-other")).toBe(true);
  });

  it("allows mahasiswa and dosen to view only their own borrowing history", () => {
    expect(canViewBorrowing("MAHASISWA", "borrower-1", "borrower-1")).toBe(true);
    expect(canViewBorrowing("DOSEN", "borrower-2", "borrower-2")).toBe(true);
    expect(canViewBorrowing("MAHASISWA", "borrower-1", "borrower-2")).toBe(false);
    expect(canViewBorrowing("DOSEN", "borrower-2", "borrower-1")).toBe(false);
  });

  it("uses selected borrower when admin creates a borrowing", () => {
    expect(resolveBorrowerIdForBorrowing("ADMIN", null, "borrower-selected")).toBe("borrower-selected");
  });

  it("uses own borrower profile when mahasiswa or dosen creates a borrowing", () => {
    expect(resolveBorrowerIdForBorrowing("MAHASISWA", "borrower-mahasiswa", "borrower-other")).toBe(
      "borrower-mahasiswa"
    );
    expect(resolveBorrowerIdForBorrowing("DOSEN", "borrower-dosen", "borrower-other")).toBe(
      "borrower-dosen"
    );
  });
});
