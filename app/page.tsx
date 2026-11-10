import { redirect } from "next/navigation";
import { getViewer } from "@/lib/access";

export default async function Home() {
  const user = await getViewer();
  redirect(user ? (user.role === "ADMIN" ? "/admin" : "/kelas") : "/masuk");
}
