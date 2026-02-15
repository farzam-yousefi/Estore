import CreateCategoryForm from "@/components/CreateEditCategoryForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Category",
};
export default function Page() {
  return <CreateCategoryForm />;
}
