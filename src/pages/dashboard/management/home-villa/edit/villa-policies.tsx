import * as React from "react";
import { usePersistentData } from "../../../../../hooks";

import { SectionPolicy } from "../../../../../components/ui";
import { Button, ToastMessage } from "../../../../../components";

import { FaEdit, FaEye } from "react-icons/fa";

import { baseCancellationTerms, baseHouseRules, basePaymentTerms } from "../../../../../static";

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

export const VillaPoliciesTab: React.FC<{ onChange?: (hasChanges: boolean) => void }> = ({ onChange }) => {
  // store data to session storage
  const useStore = usePersistentData<Villa>("get-villa");
  const useEdit = usePersistentData<Villa>("edit-villa");

  const { data: dataBeforeEdit } = useStore();
  const { setData, data: dataAfterEdit } = useEdit();

  const data = React.useMemo(() => {
    return dataAfterEdit.policies ? dataAfterEdit : dataBeforeEdit;
  }, [dataAfterEdit, dataBeforeEdit]);

  const defaultHouseRules =
    data.policies?.filter((policy) => policy.typeId === baseHouseRules).map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) ||
    houseRulesLists.map((title) => ({ id: crypto.randomUUID(), icon: { key: "key", url: "url" }, title, value: "" }));

  const defaultPaymentTerms =
    data.policies?.filter((policy) => policy.typeId === basePaymentTerms).map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];
  const defaultCancellationTerms =
    data.policies?.filter((policy) => policy.typeId === baseCancellationTerms).map((policy) => ({ id: crypto.randomUUID(), icon: policy.icon, title: policy.name, value: policy.description })) || [];

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [houseRules, setHouseRules] = React.useState<Policies[]>(defaultHouseRules);
  const [paymentTerms, setPaymentTerms] = React.useState<Policies[]>(defaultPaymentTerms);
  const [cancellationTerms, setCancellationTerms] = React.useState<Policies[]>(defaultCancellationTerms);

  const updatePolicies = (policies: Policies[], typeId: string) => {
    if (typeId === basePaymentTerms) {
      setPaymentTerms(policies);
    } else if (typeId === baseCancellationTerms) {
      setCancellationTerms(policies);
    } else if (typeId === baseHouseRules) {
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

    const filledHouseRules = houseRules.filter((rule) => rule.value.trim() !== "");
    const isHouseRulesComplete = filledHouseRules.length === 3;

    if (!isHouseRulesComplete) return;

    const dataToSave = {
      policies: [
        ...houseRules.map((rule) => ({
          name: rule.title,
          typeId: baseHouseRules,
          description: rule.value,
          icon: { key: "key", url: "url" },
        })),
        ...cancellationTerms.map((rule) => ({
          name: rule.title,
          typeId: baseCancellationTerms,
          description: rule.value,
          icon: { key: "key", url: "url" },
        })),
        ...paymentTerms.map((term) => ({
          name: term.title,
          typeId: basePaymentTerms,
          description: term.value,
          icon: { key: "key", url: "url" },
        })),
      ] as Villa["policies"],
    };

    setData(dataToSave);
    ToastMessage({ message: "Success saving edit villa policies...", color: "#22c55e" });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <>
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
    </>
  );
};
