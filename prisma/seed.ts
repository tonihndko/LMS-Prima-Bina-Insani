import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { db } from "../lib/db";
import { demoAccounts } from "../lib/demo";

async function seed() {
  const password = await hashPassword(demoAccounts.password);
  const [admin, teacher, student, partner] = await db.$transaction(
    [
      { email: demoAccounts.admin, name: "Dina Mahendra", role: "ADMIN" as const },
      { email: demoAccounts.teacher, name: "Rani Pratama", role: "TEACHER" as const },
      { email: demoAccounts.student, name: "Alya Putri" },
      { email: demoAccounts.partner, name: "Bima Saputra" },
    ].map(({ email, name, role }) =>
      db.user.upsert({ where: { email }, create: { email, name, role }, update: {} }),
    ),
  );

  await db.$transaction(
    [admin, teacher, student, partner].map(({ id }) =>
      db.account.upsert({
        where: { providerId_accountId: { providerId: "credential", accountId: id } },
        create: { providerId: "credential", accountId: id, userId: id, password },
        update: {},
      }),
    ),
  );

  const course = await db.course.findUnique({ where: { id: "dasar-analisis-data" } })
    ?? await db.course.create({
      data: {
        id: "dasar-analisis-data",
        title: "Dasar Analisis Data",
        description: "Latihan membaca data, merangkum temuan, dan menjelaskan hasil analisis.",
        teacherId: teacher.id,
        enrollments: { create: [student, partner].map(({ id }) => ({ studentId: id })) },
      },
    });

  const assignments = [
    {
      id: "distribusi-data",
      title: "Membaca distribusi data",
      instructions: "Jelaskan perbedaan rata-rata dan median. Berikan contoh saat median lebih mewakili data.",
    },
    {
      id: "data-kosong",
      title: "Memeriksa data kosong",
      instructions: "Tuliskan dua pemeriksaan awal untuk membedakan data kosong dari angka nol pada data aktivitas.",
    },
    {
      id: "grafik-mingguan",
      title: "Menafsirkan grafik mingguan",
      instructions: "Aktivitas tercatat turun dari 24 menjadi 12 interaksi. Jelaskan informasi tambahan yang diperlukan sebelum menafsirkan penurunan tersebut.",
    },
  ];

  await db.$transaction(
    assignments.map((assignment) =>
      db.assignment.upsert({
        where: { id: assignment.id },
        create: { ...assignment, courseId: course.id },
        update: {},
      }),
    ),
  );

  const submissions = [
    {
      assignmentId: "distribusi-data",
      studentId: student.id,
      answer: "Median lebih tahan terhadap nilai ekstrem. Pada pendapatan yang timpang, median lebih mewakili pendapatan tipikal.",
      score: 86,
      feedback: "Contohnya tepat. Tambahkan perhitungan singkat untuk memperkuat jawaban.",
    },
    {
      assignmentId: "data-kosong",
      studentId: student.id,
      answer: "Periksa definisi kolom dan bandingkan nilai kosong dengan catatan dari sumber data.",
    },
    {
      assignmentId: "distribusi-data",
      studentId: partner.id,
      answer: "Rata-rata menjumlahkan nilai dan membaginya dengan jumlah data.",
    },
  ];

  await db.$transaction(
    submissions.map((submission) =>
      db.submission.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: submission.assignmentId,
            studentId: submission.studentId,
          },
        },
        create: submission,
        update: {},
      }),
    ),
  );
  console.log("Data demo siap. Gunakan akun admin, pengajar, atau peserta di halaman masuk.");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => db.$disconnect());
