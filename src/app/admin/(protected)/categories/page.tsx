import AdminCategoriesPage from "@/components/AdminCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Category",
};
export default function Page() {
  return <AdminCategoriesPage />;
}
