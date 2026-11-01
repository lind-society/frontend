import * as React from "react";

import { useDeleteApi, useGetApi, useSearchPagination, useUpdateApi } from "../../hooks";

import { DataTable, Layout, SearchBox, StatusBadge } from "../../components/ui";
import { Button, Modal, Pagination } from "../../components";

import { FaEnvelope, FaRegTrashAlt, FaWhatsapp } from "react-icons/fa";

import { Data, Payload } from "../../types";

type InquiryStatus = "new" | "read" | "archived";
type InquiryType = "contact" | "villa" | "property" | "activity" | "early_bird" | "manage_property";

interface Inquiry {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  referenceName: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

const STATUS_FILTERS: { label: string; value: "" | InquiryStatus }[] = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
];

const TYPE_LABELS: Record<InquiryType, string> = {
  contact: "Contact",
  villa: "Villa",
  property: "Property",
  activity: "Activity",
  early_bird: "Early bird",
  manage_property: "Manage property",
};

// Reuses the shared badge: `new` is highlighted, the rest are quiet.
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-300 text-blue-700",
  read: "bg-green-300 text-green-700",
  archived: "bg-gray-300 text-gray-700",
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const digits = (value: string | null) => (value ?? "").replace(/\D/g, "");

const humanizeKey = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");

export const InquiriesPage = () => {
  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const [status, setStatus] = React.useState<"" | InquiryStatus>("");
  const [type, setType] = React.useState<"" | InquiryType>("");
  const [selected, setSelected] = React.useState<Inquiry | null>(null);
  const [toDelete, setToDelete] = React.useState<Inquiry | null>(null);

  const params: Record<string, string | number> = { search: searchQuery, page: currentPage };
  if (status) params["filter.status"] = `$eq:${status}`;
  if (type) params["filter.type"] = `$eq:${type}`;

  const {
    data: respInquiries,
    isPending,
    error,
  } = useGetApi<Payload<Data<Inquiry[]>>>({
    key: ["get-inquiries", searchQuery, currentPage, status, type],
    url: "inquiries",
    params,
  });

  // The "New" count for the header comes from its own tiny query so it stays
  // right whichever filter is active.
  const { data: respNew } = useGetApi<Payload<Data<Inquiry[]>>>({
    key: ["get-inquiries", "new-count"],
    url: "inquiries",
    params: { limit: 1, "filter.status": "$eq:new" },
  });
  const newCount = respNew?.data.meta.totalItems ?? 0;

  const { mutate: updateInquiry } = useUpdateApi<{ status: InquiryStatus }>({
    key: ["get-inquiries"],
    url: "/inquiries",
  });
  const { mutate: deleteInquiry, isPending: isDeleting } = useDeleteApi({
    key: ["get-inquiries"],
    url: "/inquiries",
  });

  const inquiries = respInquiries?.data.data ?? [];
  const totalPages = respInquiries?.data.meta.totalPages || 1;

  const setInquiryStatus = (inquiry: Inquiry, next: InquiryStatus) => {
    updateInquiry({ id: inquiry.id, updatedItem: { status: next } });
    setSelected((current) => (current?.id === inquiry.id ? { ...current, status: next } : current));
  };

  // Opening an unread message is what "read" means.
  const openInquiry = (inquiry: Inquiry) => {
    setSelected(inquiry);
    if (inquiry.status === "new") setInquiryStatus(inquiry, "read");
  };

  const columns = [
    {
      key: "createdAt" as keyof Inquiry,
      header: "Received",
      className: "px-4 py-3.5 text-left whitespace-nowrap",
      render: (inquiry: Inquiry) => (
        <span className={inquiry.status === "new" ? "font-semibold" : ""}>{formatDate(inquiry.createdAt)}</span>
      ),
    },
    {
      key: "type" as keyof Inquiry,
      header: "Type",
      render: (inquiry: Inquiry) => TYPE_LABELS[inquiry.type] ?? inquiry.type,
    },
    { key: "name" as keyof Inquiry, header: "Name" },
    {
      key: "email" as keyof Inquiry,
      header: "Contact",
      render: (inquiry: Inquiry) => (
        <div className="flex flex-col">
          <span>{inquiry.email}</span>
          <span className="text-xs text-dark/60">{inquiry.phone}</span>
        </div>
      ),
    },
    {
      key: "referenceName" as keyof Inquiry,
      header: "About",
      render: (inquiry: Inquiry) => inquiry.referenceName || "-",
    },
    {
      key: "message" as keyof Inquiry,
      header: "Message",
      className: "max-w-72 w-full py-3 px-4 overflow-hidden",
      render: (inquiry: Inquiry) => <p className="line-clamp-2">{inquiry.message || "-"}</p>,
    },
    {
      key: "status" as keyof Inquiry,
      header: "Status",
      render: (inquiry: Inquiry) => <StatusBadge status={inquiry.status} colors={STATUS_COLORS} />,
    },
    {
      key: "id" as keyof Inquiry,
      header: "Actions",
      render: (inquiry: Inquiry) => (
        <div className="flex items-center gap-2">
          <Button className="btn-primary" onClick={() => openInquiry(inquiry)}>
            View
          </Button>
          <button
            type="button"
            aria-label={`Delete inquiry from ${inquiry.name}`}
            className="p-2 text-red-500 hover:text-red-700"
            onClick={() => setToDelete(inquiry)}
          >
            <FaRegTrashAlt size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Inquiries</h1>
        <span className="px-4 py-2 rounded bg-light">
          {newCount} new {newCount === 1 ? "message" : "messages"}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="flex gap-2" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={status === filter.value ? "btn-primary" : "btn-outline"}
              onClick={() => {
                setStatus(filter.value);
                handlePageChange(1);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <select
          className="input-text max-w-52"
          aria-label="Filter by type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as "" | InquiryType);
            handlePageChange(1);
          }}
        >
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

      <div className="pb-8 mt-2 border rounded-b bg-light border-dark/30">
        <div className="pb-2 mb-4 overflow-x-auto scrollbar min-h-600">
          <DataTable
            data={inquiries}
            columns={columns}
            keyExtractor={(inquiry) => inquiry.id}
            isLoading={isPending}
            error={error}
            emptyMessage="No inquiries yet"
          />
        </div>
        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>

      {/* Detail */}
      <Modal isVisible={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col gap-5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
              <h2 className="heading">{selected.name}</h2>
              <StatusBadge status={selected.status} colors={STATUS_COLORS} />
            </div>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-dark/60">Received</dt>
                <dd>{formatDate(selected.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-dark/60">Type</dt>
                <dd>{TYPE_LABELS[selected.type] ?? selected.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-dark/60">Email</dt>
                <dd>{selected.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-dark/60">Phone</dt>
                <dd>{selected.phone || "-"}</dd>
              </div>
              {selected.referenceName && (
                <div className="sm:col-span-2">
                  <dt className="text-sm text-dark/60">About</dt>
                  <dd>{selected.referenceName}</dd>
                </div>
              )}
              {Object.entries(selected.metadata ?? {}).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm capitalize text-dark/60">{humanizeKey(key)}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>

            <div>
              <span className="text-sm text-dark/60">Message</span>
              <p className="p-4 mt-1 whitespace-pre-wrap border rounded border-dark/20">{selected.message || "-"}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                className="flex items-center gap-2 btn-primary"
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your inquiry to LIND Society")}`}
              >
                <FaEnvelope /> Reply by email
              </a>
              {digits(selected.phone) && (
                <a
                  className="flex items-center gap-2 btn-outline"
                  href={`https://wa.me/${digits(selected.phone)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              )}
              {selected.status !== "archived" ? (
                <button type="button" className="btn-outline" onClick={() => setInquiryStatus(selected, "archived")}>
                  Archive
                </button>
              ) : (
                <button type="button" className="btn-outline" onClick={() => setInquiryStatus(selected, "read")}>
                  Restore
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal isVisible={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <div className="flex flex-col gap-4 p-4">
          <h2 className="heading">Delete this inquiry?</h2>
          <p>
            The message from <strong>{toDelete?.name}</strong> will be removed from the inbox.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-primary"
              disabled={isDeleting}
              onClick={() => {
                if (toDelete) deleteInquiry(toDelete.id);
                setToDelete(null);
                setSelected(null);
              }}
            >
              Delete
            </button>
            <button type="button" className="btn-outline" onClick={() => setToDelete(null)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
