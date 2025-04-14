import * as React from "react";
import { usePersistentData } from "../../../../../hooks";

import { Button, SectionPolicy, ToastMessage } from "../../../../../components";

import { FaEdit, FaEye } from "react-icons/fa";

import { Villa } from "../../../../../types";

interface Policies {
  id: string;
  title: string;
  value: string;
  icon: { key: string; url: string };
}

const houseRulesLists = ["Add check in rules", "Add check out rules", "Add late check out rules"];
const paymentTermsLists = ["Terms 1", "Terms 2", "Terms 3"];
const cancellationTermsLists = ["Terms 1", "Terms 2", "Terms 3", "Terms 4", "Terms 5", "Terms 6"];

export const VillaPolicies: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const data = dataAfterEdit.policies ? dataAfterEdit : dataBeforeEdit;

  const defaultHouseRules =
    data.policies?.filter((policy) => policy.type === "house rules").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) ||
    houseRulesLists.map((title) => ({ id: crypto.randomUUID(), icon: { key: "key", url: "url" }, title, value: "" }));

  const defaultPaymentTerms =
    data.policies?.filter((policy) => policy.type === "payment terms").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];
  const defaultCancellationTerms =
    data.policies?.filter((policy) => policy.type === "cancellation terms").map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [houseRules, setHouseRules] = React.useState<Policies[]>(defaultHouseRules);
  const [paymentTerms, setPaymentTerms] = React.useState<Policies[]>(defaultPaymentTerms);
  const [cancellationTerms, setCancellationTerms] = React.useState<Policies[]>(defaultCancellationTerms);

  const updatePolicies = (policies: Policies[], type: string) => {
    if (type === "Payment Terms") {
      setPaymentTerms(policies);
    } else if (type === "Cancellation Terms") {
      setCancellationTerms(policies);
    } else if (type === "House Rules") {
      setHouseRules(policies);
    }
  };

  const updateHouseRuleValue = (id: string, value: string) => {
    const updatedRules = houseRules.map((rule) => (rule.id === id ? { ...rule, value } : rule));
    setHouseRules(updatedRules);
  };

  // Check if form is complete
  React.useEffect(() => {
    if (!onChange) return;

    // Check house rules
    const houseRulesChanged = houseRules.some((current, index) => {
      return index < defaultHouseRules.length && current.value !== defaultHouseRules[index].value;
    });

    // Check payment terms
    const paymentTermsChanged = paymentTerms.some((current, index) => {
      return index < defaultPaymentTerms.length && current.value !== defaultPaymentTerms[index].value;
    });

    // Check cancellation terms
    const cancellationTermsChanged = cancellationTerms.some((current, index) => {
      return index < defaultCancellationTerms.length && current.value !== defaultCancellationTerms[index].value;
    });

    const lengthChanged = houseRules.length !== defaultHouseRules.length || paymentTerms.length !== defaultPaymentTerms.length || cancellationTerms.length !== defaultCancellationTerms.length;

    const hasChanges = houseRulesChanged || paymentTermsChanged || cancellationTermsChanged || lengthChanged;

    onChange(hasChanges);
  }, [houseRules, cancellationTerms, paymentTerms]);

  const handleSubmitPolicies = async (e: React.MouseEvent) => {
    e.preventDefault();

    const formattedData = {
      policies: [
        ...houseRules.map((rule) => ({
          name: rule.title,
          type: "house rules",
          description: rule.value,
          icon: { key: "key", url: "url" },
        })),
        ...cancellationTerms.map((rule) => ({
          name: rule.title,
          type: "cancellation terms",
          description: rule.value,
          icon: { key: "key", url: "url" },
        })),
        ...paymentTerms.map((term) => ({
          name: term.title,
          type: "payment terms",
          description: term.value,
          icon: { key: "key", url: "url" },
        })),
      ] as Villa["policies"],
    };
    setData(formattedData);
    ToastMessage({ message: "Success saving edit villa policies...", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <div className="relative p-8 border rounded-b bg-light border-dark/30">
      <Button className="absolute top-6 right-8 btn-outline z-3000" onClick={() => setEditMode((prev) => !prev)}>
        {editMode ? (
          <div className="flex items-center gap-2">
            <FaEye size={18} />
            Show Mode
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaEdit size={18} />
            Edit Mode
          </div>
        )}
      </Button>
      <div className="relative">
        <div className={`absolute inset-0 ${editMode ? "-z-1" : "z-2000"}`}></div>
        <div className="mb-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="heading">House Rules</h2>
          </div>

          <div className="space-y-8">
            {houseRules.map((rule) => (
              <div key={rule.id} className="flex items-center">
                <label className="block whitespace-nowrap min-w-60">{rule.title} *</label>
                <input
                  type="text"
                  placeholder={`Enter description for ${rule.title}`}
                  value={rule.value}
                  onChange={(e) => updateHouseRuleValue(rule.id, e.target.value)}
                  className="input-text"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <SectionPolicy title="Payment Terms" categories={paymentTermsLists} defaultPolicies={paymentTerms} onUpdate={updatePolicies} />

        <SectionPolicy title="Cancellation Terms" categories={cancellationTermsLists} defaultPolicies={cancellationTerms} onUpdate={updatePolicies} />

        <div className={`justify-end gap-4 ${editMode ? "flex" : "hidden"}`} onClick={handleSubmitPolicies}>
          <Button className="btn-primary" type="submit">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
