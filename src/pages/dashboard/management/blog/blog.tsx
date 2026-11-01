import * as React from "react";

import { useCreateApi, useDeleteApi, useGetApi, useSearchPagination, useUpdateApi } from "../../../../hooks";

import { DataTable, Layout, SearchBox } from "../../../../components/ui";
import { Button, Modal, Pagination } from "../../../../components";

import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

import { Category, Data, Payload } from "../../../../types";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category?: { id: string; name: string };
  author?: { id: string; name: string };
}

interface BlogForm {
  title: string;
  content: string;
  categoryId: string;
}

const EMPTY_FORM: BlogForm = { title: "", content: "", categoryId: "" };

const formatDate = (iso: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(iso));

export const BlogPage = () => {
  const { searchQuery, inputValue, setInputValue, handleSearch, currentPage, handlePageChange } = useSearchPagination();

  const [editing, setEditing] = React.useState<BlogPost | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState<BlogForm>(EMPTY_FORM);
  const [toDelete, setToDelete] = React.useState<BlogPost | null>(null);
  const [categoryName, setCategoryName] = React.useState("");

  const {
    data: respPosts,
    isPending,
    error,
  } = useGetApi<Payload<Data<BlogPost[]>>>({
    key: ["get-blogs", searchQuery, currentPage],
    url: "blogs",
    params: { search: searchQuery, page: currentPage },
  });

  const { data: respCategories } = useGetApi<Payload<Data<Category[]>>>({
    key: ["get-blog-categories"],
    url: "blog-categories",
    params: { limit: "100" },
  });

  const { mutate: createPost, isPending: isCreating } = useCreateApi<BlogForm>({ key: ["get-blogs"], url: "/blogs" });
  const { mutate: updatePost, isPending: isUpdating } = useUpdateApi<Partial<BlogForm>>({
    key: ["get-blogs"],
    url: "/blogs",
  });
  const { mutate: deletePost, isPending: isDeleting } = useDeleteApi({ key: ["get-blogs"], url: "/blogs" });

  const { mutate: createCategory } = useCreateApi<{ name: string }>({
    key: ["get-blog-categories"],
    url: "/blog-categories",
  });
  const { mutate: deleteCategory } = useDeleteApi({ key: ["get-blog-categories"], url: "/blog-categories" });

  const posts = respPosts?.data.data ?? [];
  const totalPages = respPosts?.data.meta.totalPages || 1;
  const categories = respCategories?.data.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? "" });
    setFormOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ title: post.title, content: post.content, categoryId: post.category?.id ?? "" });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: form.title.trim(), content: form.content, categoryId: form.categoryId };

    if (editing) {
      updatePost({ id: editing.id, updatedItem: payload }, { onSuccess: closeForm });
    } else {
      createPost(payload, { onSuccess: closeForm });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    createCategory({ name: categoryName.trim() }, { onSuccess: () => setCategoryName("") });
  };

  const columns = [
    { key: "title" as keyof BlogPost, header: "Title", className: "max-w-96 w-full py-3 px-4 overflow-hidden" },
    {
      key: "category" as keyof BlogPost,
      header: "Category",
      render: (post: BlogPost) => post.category?.name ?? "-",
    },
    { key: "author" as keyof BlogPost, header: "Author", render: (post: BlogPost) => post.author?.name ?? "-" },
    {
      key: "createdAt" as keyof BlogPost,
      header: "Published",
      render: (post: BlogPost) => formatDate(post.createdAt),
    },
    {
      key: "id" as keyof BlogPost,
      header: "Actions",
      render: (post: BlogPost) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Edit ${post.title}`}
            className="text-primary"
            onClick={() => openEdit(post)}
          >
            <FaRegEdit size={18} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${post.title}`}
            className="text-red-500 hover:text-red-700"
            onClick={() => setToDelete(post)}
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
        <h1 className="head-title">Blog</h1>
        <Button className="btn-primary" onClick={openCreate} disabled={categories.length === 0}>
          New post
        </Button>
      </header>

      <section className="p-6 mb-6 border rounded bg-light border-dark/30">
        <h2 className="heading">Categories</h2>
        <form className="flex items-center gap-4 mt-4" onSubmit={handleAddCategory}>
          <input
            type="text"
            className="input-text"
            placeholder="e.g. Travel Guide"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button className="btn-primary" type="submit">
            Add
          </Button>
        </form>
        {categories.length === 0 ? (
          <p className="mt-4 text-dark/60">Add a category first, then you can write posts.</p>
        ) : (
          <ul className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-2 px-3 py-1 border rounded-full border-primary/40">
                <span>{category.name}</span>
                <button
                  type="button"
                  aria-label={`Delete category ${category.name}`}
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteCategory(category.id)}
                >
                  <FaRegTrashAlt size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SearchBox value={inputValue} onChange={setInputValue} onSearch={handleSearch} />

      <div className="pb-8 mt-2 border rounded-b bg-light border-dark/30">
        <div className="pb-2 mb-4 overflow-x-auto scrollbar min-h-600">
          <DataTable
            data={posts}
            columns={columns}
            keyExtractor={(post) => post.id}
            isLoading={isPending}
            error={error}
            emptyMessage="No posts yet"
          />
        </div>
        <Pagination page={currentPage} setPage={handlePageChange} totalPage={totalPages} isNumbering />
      </div>

      {/* Create / edit */}
      <Modal isVisible={formOpen} onClose={closeForm}>
        <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
          <h2 className="heading">{editing ? "Edit post" : "New post"}</h2>

          <label className="flex flex-col gap-1">
            <span className="font-semibold">Title</span>
            <input
              className="input-text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-semibold">Category</span>
            <select
              className="input-text"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-semibold">Content (HTML)</span>
            <textarea
              className="font-mono text-sm input-text min-h-64"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="<p>Write your article here. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; and &lt;img&gt; tags.</p>"
              required
            />
            <span className="text-sm text-dark/60">
              Headings, paragraphs, lists, links and images are supported. Scripts are removed on the website.
            </span>
          </label>

          <div className="flex gap-3">
            <Button className="btn-primary" type="submit" disabled={isCreating || isUpdating}>
              {editing ? "Save changes" : "Publish"}
            </Button>
            <button type="button" className="btn-outline" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isVisible={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <div className="flex flex-col gap-4 p-4">
          <h2 className="heading">Delete this post?</h2>
          <p>
            <strong>{toDelete?.title}</strong> will be removed from the website.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-primary"
              disabled={isDeleting}
              onClick={() => {
                if (toDelete) deletePost(toDelete.id);
                setToDelete(null);
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
