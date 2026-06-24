import { PreorderForm, type PreorderFormValues } from "../_components/PreorderForm";

const emptyValues: PreorderFormValues = {
  name: "",
  products: 1,
  preorderWhen: "out-of-stock",
  startsAt: "",
  endsAt: "",
  active: true,
};

export default function NewPreorderPage() {
  return <PreorderForm mode="create" initial={emptyValues} />;
}
