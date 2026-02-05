import CreateCategoryForm from "@/components/CreateCategoryForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Category",
};
export default function Page() {
  return <CreateCategoryForm />;
}
