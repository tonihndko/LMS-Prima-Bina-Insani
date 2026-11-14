export const demoAccounts = {
  admin: "admin@primecaps.test",
  teacher: "pengajar@primecaps.test",
  student: "peserta@primecaps.test",
  partner: "peserta2@primecaps.test",
  // Default hanya untuk lokal; instance yang di-deploy wajib mengisi DEMO_PASSWORD.
  password: process.env.DEMO_PASSWORD || "PrimeCapsDemo2026!",
};
