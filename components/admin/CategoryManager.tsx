"use client";

import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin.actions";
import { Edit2, Loader2, Plus, Tag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Category {
  categoryId: string;
  name: string;
  subjects: string[];
}

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    startTransition(async () => {
      try {
        let res;
        if (editingCategory) {
          res = await updateCategoryAction(editingCategory.categoryId, {
            name: categoryName,
            subjects: subjects,
          });
        } else {
          res = await createCategoryAction({
            name: categoryName,
            subjects: subjects,
          });
        }

        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(`Category ${editingCategory ? "updated" : "created"}`);
          setIsModalOpen(false);
          setEditingCategory(null);
          setCategoryName("");
          setSubjects([]);
          router.refresh();
        }
      } catch {
        toast.error("Operation failed");
      }
    });
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (subjects.includes(newSubject.trim())) {
      toast.error("Subject already exists");
      return;
    }
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject("");
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Delete this category? This will fail if tutors are assigned to it.",
      )
    )
      return;

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res?.error) {
        toast.error(res.error || "Failed to delete category");
      } else {
        toast.success("Category deleted");
        router.refresh();
      }
    });
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setSubjects(category.subjects || []);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setSubjects([]);
    }
    setNewSubject("");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">
            Categories
          </h1>
          <p className="text-slate-500 font-medium">
            Manage subject categories for tutors.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.categoryId}
              className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-md transition-all ${isPending ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {cat.subjects?.length || 0} subjects
                  </p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openModal(cat)}
                  disabled={isPending}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.categoryId)}
                  disabled={isPending}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-3xl">
            No categories found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  placeholder="e.g. Mathematics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Subjects
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubject();
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    placeholder="e.g. Algebra"
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    className="px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {subjects.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSubject(s)}
                        className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {subjects.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      No subjects added yet.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Save Category"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
