import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  account: {
    create: vi.fn(),
    update: vi.fn()
  },
  borrower: {
    create: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    update: vi.fn()
  },
  borrowing: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn()
  },
  equipment: {
    create: vi.fn(),
    findFirstOrThrow: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn()
  },
  room: {
    create: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    update: vi.fn()
  }
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock
}));

import { BorrowerService } from "@/services/BorrowerService";
import { BorrowingService } from "@/services/BorrowingService";
import { EquipmentService } from "@/services/EquipmentService";
import { RoomService } from "@/services/RoomService";

const borrowerInput = {
  name: "Alya Putri",
  identityNumber: "0706012219001",
  email: "ALYA@EXAMPLE.COM",
  phone: "08123456789",
  accountType: "MAHASISWA"
};

const roomInput = {
  code: "KLS-201",
  name: "Ruang Kelas 201",
  capacity: 45,
  building: "Gedung B",
  floor: 2,
  status: "TERSEDIA"
};

const equipmentInput = {
  code: "PRJ-001",
  name: "Proyektor Epson",
  stock: 5,
  category: "Presentasi"
};

const borrowingInput = {
  borrowerId: "borrower-1",
  roomId: "room-1",
  requestDate: "2026-05-09",
  usageDate: "2026-05-10T09:00",
  durationHours: 2,
  purpose: "Rapat himpunan",
  equipmentItems: [{ equipmentId: "equipment-1", quantity: 1 }]
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BorrowerService CRUD", () => {
  it("reads all borrowers with account data", async () => {
    prismaMock.borrower.findMany.mockResolvedValue([]);

    await new BorrowerService().findAll();

    expect(prismaMock.borrower.findMany).toHaveBeenCalledWith({
      include: { account: true },
      orderBy: { createdAt: "desc" }
    });
  });

  it("reads one borrower by id", async () => {
    prismaMock.borrower.findUniqueOrThrow.mockResolvedValue({ id: "borrower-1" });

    await new BorrowerService().findById("borrower-1");

    expect(prismaMock.borrower.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: "borrower-1" } });
  });

  it("creates borrower and login account from email and NIM/NIK", async () => {
    prismaMock.borrower.create.mockResolvedValue({ id: "borrower-1" });

    await new BorrowerService().create(borrowerInput);

    const createInput = prismaMock.borrower.create.mock.calls[0][0];
    expect(createInput.data.email).toBe("alya@example.com");
    expect(createInput.data.account.create.username).toBe("alya@example.com");
    expect(createInput.data.account.create.passwordHash).not.toBe(borrowerInput.identityNumber);
    expect(createInput.data.account.create.role).toBe("MAHASISWA");
  });

  it("updates borrower and upserts account data", async () => {
    prismaMock.borrower.update.mockResolvedValue({ id: "borrower-1" });

    await new BorrowerService().update("borrower-1", borrowerInput);

    expect(prismaMock.borrower.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "borrower-1" },
        data: expect.objectContaining({
          email: "alya@example.com",
          account: expect.objectContaining({
            upsert: expect.objectContaining({
              update: { username: "alya@example.com", role: "MAHASISWA" }
            })
          })
        })
      })
    );
  });

  it("deletes borrower by id", async () => {
    prismaMock.borrower.delete.mockResolvedValue({ id: "borrower-1" });

    await new BorrowerService().delete("borrower-1");

    expect(prismaMock.borrower.delete).toHaveBeenCalledWith({ where: { id: "borrower-1" } });
  });

  it("resets existing borrower account password", async () => {
    prismaMock.borrower.findUniqueOrThrow.mockResolvedValue({
      id: "borrower-1",
      email: "alya@example.com",
      identityNumber: "0706012219001",
      accountType: "MAHASISWA",
      account: { id: "account-1" }
    });
    prismaMock.account.update.mockResolvedValue({ id: "account-1" });

    await new BorrowerService().resetPassword("borrower-1");

    expect(prismaMock.account.update).toHaveBeenCalledWith({
      where: { id: "account-1" },
      data: { passwordHash: expect.any(String) }
    });
  });

  it("creates account when reset password is requested for borrower without account", async () => {
    prismaMock.borrower.findUniqueOrThrow.mockResolvedValue({
      id: "borrower-1",
      email: "alya@example.com",
      identityNumber: "0706012219001",
      accountType: "MAHASISWA",
      account: null
    });
    prismaMock.account.create.mockResolvedValue({ id: "account-1" });

    await new BorrowerService().resetPassword("borrower-1");

    expect(prismaMock.account.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        username: "alya@example.com",
        role: "MAHASISWA",
        borrowerId: "borrower-1"
      })
    });
  });
});

describe("RoomService CRUD", () => {
  it("reads all rooms ordered by newest data", async () => {
    prismaMock.room.findMany.mockResolvedValue([]);

    await new RoomService().findAll();

    expect(prismaMock.room.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "desc" } });
  });

  it("reads one room by id", async () => {
    prismaMock.room.findUniqueOrThrow.mockResolvedValue({ id: "room-1" });

    await new RoomService().findById("room-1");

    expect(prismaMock.room.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: "room-1" } });
  });

  it("creates room after validation", async () => {
    prismaMock.room.create.mockResolvedValue({ id: "room-1" });

    await new RoomService().create(roomInput);

    expect(prismaMock.room.create).toHaveBeenCalledWith({ data: roomInput });
  });

  it("updates room after validation", async () => {
    prismaMock.room.update.mockResolvedValue({ id: "room-1" });

    await new RoomService().update("room-1", roomInput);

    expect(prismaMock.room.update).toHaveBeenCalledWith({ where: { id: "room-1" }, data: roomInput });
  });

  it("deletes room by id", async () => {
    prismaMock.room.delete.mockResolvedValue({ id: "room-1" });

    await new RoomService().delete("room-1");

    expect(prismaMock.room.delete).toHaveBeenCalledWith({ where: { id: "room-1" } });
  });
});

describe("EquipmentService CRUD", () => {
  it("reads only active equipment data", async () => {
    prismaMock.equipment.findMany.mockResolvedValue([]);

    await new EquipmentService().findAll();

    expect(prismaMock.equipment.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" }
    });
  });

  it("reads one active equipment by id", async () => {
    prismaMock.equipment.findFirstOrThrow.mockResolvedValue({ id: "equipment-1" });

    await new EquipmentService().findById("equipment-1");

    expect(prismaMock.equipment.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: "equipment-1", deletedAt: null }
    });
  });

  it("creates equipment after validation", async () => {
    prismaMock.equipment.create.mockResolvedValue({ id: "equipment-1" });

    await new EquipmentService().create(equipmentInput);

    expect(prismaMock.equipment.create).toHaveBeenCalledWith({ data: equipmentInput });
  });

  it("updates equipment after validation", async () => {
    prismaMock.equipment.update.mockResolvedValue({ id: "equipment-1" });

    await new EquipmentService().update("equipment-1", equipmentInput);

    expect(prismaMock.equipment.update).toHaveBeenCalledWith({
      where: { id: "equipment-1" },
      data: equipmentInput
    });
  });

  it("soft deletes equipment so borrowing history stays safe", async () => {
    prismaMock.equipment.update.mockResolvedValue({ id: "equipment-1" });

    await new EquipmentService().delete("equipment-1");

    expect(prismaMock.equipment.update).toHaveBeenCalledWith({
      where: { id: "equipment-1" },
      data: { deletedAt: expect.any(Date) }
    });
  });
});

describe("BorrowingService transaction flow", () => {
  it("reads borrowings with borrower, room, and equipment details", async () => {
    prismaMock.borrowing.findMany.mockResolvedValue([]);

    await new BorrowingService().findAll();

    expect(prismaMock.borrowing.findMany).toHaveBeenCalledWith({
      include: {
        borrower: true,
        room: true,
        equipmentItems: { include: { equipment: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  });

  it("creates borrowing with room and equipment details when stock is enough", async () => {
    prismaMock.equipment.findMany.mockResolvedValue([{ id: "equipment-1", stock: 2 }]);
    prismaMock.borrowing.create.mockResolvedValue({ id: "borrowing-1" });

    await new BorrowingService().create(borrowingInput);

    expect(prismaMock.equipment.findMany).toHaveBeenCalledWith({
      where: { id: { in: ["equipment-1"] }, deletedAt: null }
    });
    expect(prismaMock.borrowing.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        borrowerId: "borrower-1",
        roomId: "room-1",
        durationHours: 2,
        purpose: "Rapat himpunan",
        equipmentItems: {
          create: [{ equipmentId: "equipment-1", quantity: 1 }]
        }
      })
    });
  });

  it("creates room-only borrowing without equipment detail rows", async () => {
    prismaMock.equipment.findMany.mockResolvedValue([]);
    prismaMock.borrowing.create.mockResolvedValue({ id: "borrowing-1" });

    await new BorrowingService().create({ ...borrowingInput, equipmentItems: [] });

    expect(prismaMock.borrowing.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        roomId: "room-1",
        equipmentItems: { create: [] }
      })
    });
  });

  it("rejects borrowing when deleted or unavailable equipment has no active stock", async () => {
    prismaMock.equipment.findMany.mockResolvedValue([]);

    await expect(new BorrowingService().create(borrowingInput)).rejects.toThrow("Jumlah peralatan");
    expect(prismaMock.borrowing.create).not.toHaveBeenCalled();
  });

  it("updates borrowing status and actual return time", async () => {
    prismaMock.borrowing.update.mockResolvedValue({ id: "borrowing-1" });

    await new BorrowingService().updateStatus("borrowing-1", {
      status: "SELESAI",
      usageDate: "2026-05-10T09:00",
      durationHours: 3,
      actualReturnTime: "2026-05-10T12:00"
    });

    expect(prismaMock.borrowing.update).toHaveBeenCalledWith({
      where: { id: "borrowing-1" },
      data: {
        status: "SELESAI",
        usageDate: new Date("2026-05-10T09:00"),
        durationHours: 3,
        actualReturnTime: new Date("2026-05-10T12:00")
      }
    });
  });
});
