import type { Preorder } from "@prisma/client";
import { SelectionProvider } from "./SelectionProvider";
import { SelectAllCheckbox } from "./SelectionCheckbox";
import { PreorderRow } from "./PreorderRow";

const headers = ["Name", "Products", "Preorder when", "Starts at", "Ends at", "Status", "Actions"];

export function PreorderTable({ preorders }: { preorders: Preorder[] }) {
  return (
    <SelectionProvider ids={preorders.map((preorder) => preorder.id)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="w-10 px-4 py-0 pt-1 ">
              <SelectAllCheckbox />
            </th>
            {headers.map((header) => (
              <th key={header} className="px-4 pl-2 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preorders.length === 0 ? (
            <tr>
              <td colSpan={headers.length + 1} className="px-4 py-10 text-center text-neutral-500">
                No preorders found
              </td>
            </tr>
          ) : (
            preorders.map((preorder) => <PreorderRow key={preorder.id} preorder={preorder} />)
          )}
        </tbody>
      </table>
    </SelectionProvider>
  );
}
