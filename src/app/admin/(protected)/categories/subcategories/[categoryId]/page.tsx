import SubcategoryManagementPage from "@/components/SubcategoryManagement";
import { getCategory, getSubcats } from "@/lib/actions/category";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SubCategory",
};
export default async function Page(props: {
  params: Promise<{ categoryId: string }>;
}) {
  const params = await props.params;
  const id = params.categoryId;

  const category = await getCategory(id);

  const subcategories = await getSubcats(id);

  return (
    <SubcategoryManagementPage
      // category={{ _id: category._id, name: category.name }}
      category={category}
      subCats={subcategories}
    />
  );
}
