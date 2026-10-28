import { useGetApi } from "./useApi";

import { POLICY_TYPE_NAMES } from "../static";

import { Payload, PolicyType } from "../types";

interface PolicyTypesPayload {
  data: PolicyType[];
}

/**
 * Resolves villa policy type ids from their names.
 *
 * The ids differ per environment, so anything that writes a policy has to look
 * them up rather than assume — the previous hardcoded UUIDs came from a
 * different database and broke villa creation outright.
 */
export const useVillaPolicyTypes = () => {
  const { data, isLoading, isError } = useGetApi<Payload<PolicyTypesPayload>>({
    key: ["villa-policy-types"],
    url: "villa-policy-types",
    params: { limit: 100 },
    // Policy types are configuration and change about never.
    staleTime: 30 * 60 * 1000,
  });

  const types = data?.data?.data ?? [];

  const idByName = types.reduce<Record<string, string>>((accumulator, type) => {
    accumulator[type.name] = type.id;
    return accumulator;
  }, {});

  const houseRulesId = idByName[POLICY_TYPE_NAMES.houseRules];
  const paymentTermsId = idByName[POLICY_TYPE_NAMES.paymentTerms];
  const cancellationTermsId = idByName[POLICY_TYPE_NAMES.cancellationTerms];

  return {
    isLoading,
    isError,
    houseRulesId,
    paymentTermsId,
    cancellationTermsId,
    /**
     * False when the backend is missing one of the three types. Callers use it
     * to block saving rather than send a `typeId` of `undefined`, which the API
     * rejects with a validation error the admin cannot act on.
     */
    isReady: Boolean(houseRulesId && paymentTermsId && cancellationTermsId),
  };
};
