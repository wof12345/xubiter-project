import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toDateTimeLocalValue } from "@/lib/format";
import { PreorderForm, type PreorderFormValues } from "../../_components/PreorderForm";

export default async function EditPreorderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const preorder = await prisma.preorder.findUnique({ where: { id } });
  if (!preorder) notFound();

  const initial: PreorderFormValues = {
    name: preorder.name,
    products: preorder.products,
    preorderWhen: preorder.preorderWhen,
    startsAt: toDateTimeLocalValue(preorder.startsAt),
    endsAt: toDateTimeLocalValue(preorder.endsAt),
    active: preorder.active,
  };

  return <PreorderForm mode="edit" id={preorder.id} initial={initial} />;
}
