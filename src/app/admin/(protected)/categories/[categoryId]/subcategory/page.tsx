import SubcategoryManagementPage from "@/components/SubcategoryManagement";
import { Metadata } from "next";

 export const metadata: Metadata = {
  title: 'SubCategory',
};
export default function Page() {
  return < SubcategoryManagementPage params={{
    categoryId: "1"
  }} />
}