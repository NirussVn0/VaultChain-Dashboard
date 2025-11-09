"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

export default function AuthIndexPage() {
  redirect("/auth/login" as Route);
}
