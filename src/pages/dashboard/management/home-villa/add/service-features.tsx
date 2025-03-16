import { useState, useEffect } from "react";
import { Button } from "../../../../../components";
import { FaEye, FaEyeSlash, FaPencil } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { FaTrashAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface Item {
  title: string;
  free: boolean;
  price: number;
  currency: string;
  hidden: boolean;
}

interface Category {
  name: string;
  items: Item[];
  isEditing: boolean;
}

const defaultCategories: string[] = ["Facilities", "Services", "Entertainment", "Meals", "Transport", "Kids"];

export const ServiceFeatures = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedData = localStorage.getItem("categories");
    return savedData ? JSON.parse(savedData) : defaultCategories.map((name) => ({ name, items: [{ title: "", free: false, price: 0, currency: "USD", hidden: false }], isEditing: false }));
  });

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addCategory = () => {
    setCategories([...categories, { name: "New Category", items: [{ title: "", free: false, price: 0, currency: "USD", hidden: false }], isEditing: false }]);
  };

  const toggleEditCategory = (index: number) => {
    setCategories(categories.map((cat, i) => (i === index ? { ...cat, isEditing: !cat.isEditing } : cat)));
  };

  const updateCategoryName = (index: number, name: string) => {
    const newCategories = [...categories];
    newCategories[index].name = name;
    setCategories(newCategories);
  };

  const finishEditingCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].isEditing = false;
    setCategories(newCategories);
  };

  const toggleItemHidden = (catIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[itemIndex].hidden = !newCategories[catIndex].items[itemIndex].hidden;
    setCategories(newCategories);
  };

  const resetCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories[index] = { name: defaultCategories[index] || "New Category", items: [{ title: "", free: false, price: 0, currency: "USD", hidden: false }], isEditing: false };
    setCategories(newCategories);
  };

  const deleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const deleteItem = (catIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[catIndex].items = newCategories[catIndex].items.filter((_, i) => i !== itemIndex);
    setCategories(newCategories);
  };

  const addItem = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].items.push({ title: "", free: false, price: 0, hidden: false, currency: "USD" });
    setCategories(newCategories);
  };

  const updateItemFree = (catIndex: number, itemIndex: number, free: boolean) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[itemIndex].free = free;
    setCategories(newCategories);
  };

  const updateItemCurrency = (catIndex: number, itemIndex: number, currency: string) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[itemIndex].currency = currency;
    setCategories(newCategories);
  };

  const resetItem = (catIndex: number, itemIndex: number) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[itemIndex] = { title: "", free: false, price: 0, currency: "USD", hidden: false };
    setCategories(newCategories);
  };

  const updateItemTitle = (catIndex: number, itemIndex: number, title: string) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[itemIndex].title = title;
    setCategories(newCategories);
  };

  const updateItemPrice = (catIndex: number, itemIndex: number, price: number) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[itemIndex].price = price;
    setCategories(newCategories);
  };

  return (
    <div className="p-8 space-y-8 border rounded-b bg-light border-dark/20">
      <div className="flex items-center justify-between">
        <h2 className="heading">Service & Features</h2>
        <Button onClick={addCategory} className="btn-primary">
          + Add New Category
        </Button>
      </div>
      {categories.map((category, index) => (
        <div key={index} className="p-4 mt-4 border-b border-dark/20">
          <div className="flex items-center justify-between">
            {category.isEditing ? (
              <div className="max-w-60">
                <input type="text" value={category.name} onChange={(e) => updateCategoryName(index, e.target.value)} onBlur={() => finishEditingCategory(index)} className="input-text" autoFocus />
              </div>
            ) : (
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{category.name}</span>
                <button onClick={() => toggleEditCategory(index)}>
                  <FaPencil />
                </button>
              </div>
            )}
            <div className="flex gap-4">
              <Button className="btn-primary" onClick={() => addItem(index)}>
                + Add Item
              </Button>
              <Button className="flex items-center gap-1 btn-blue" onClick={() => resetCategory(index)}>
                <GrPowerReset /> Reset
              </Button>
              <Button className="flex items-center gap-1 btn-red" onClick={() => deleteCategory(index)}>
                <FaTrashAlt /> Delete
              </Button>
            </div>
          </div>
          <div>
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex w-full gap-12 p-2 mt-2">
                <div className="w-full space-y-1">
                  <label className="block text-sm">Title *</label>
                  <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateItemTitle(index, itemIndex, e.target.value)} className="input-text" />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm">Free *</label>
                  <div className="flex items-center gap-8 pt-1.5">
                    <label className="flex items-center gap-2">
                      Yes <input type="checkbox" className="accent-primary size-4" checked={item.free} onChange={() => updateItemFree(index, itemIndex, true)} />
                    </label>
                    <label className="flex items-center gap-2">
                      No <input type="checkbox" className="accent-primary size-4" checked={!item.free} onChange={() => updateItemFree(index, itemIndex, false)} />
                    </label>
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <label className="block text-sm">Price *</label>
                  <div className="flex items-center gap-2">
                    <select value={item.currency} onChange={(e) => updateItemCurrency(index, itemIndex, e.target.value)} className="input-select min-w-20" disabled={item.free}>
                      <option value="USD">$</option>
                      <option value="IDR">Rp</option>
                    </select>
                    <input type="number" className="input-text" value={item.price} onChange={(e) => updateItemPrice(index, itemIndex, Number(e.target.value))} disabled={item.free} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm opacity-0">Action</label>
                  <div className="flex items-center gap-8 pt-2">
                    <button className="" onClick={() => toggleItemHidden(index, itemIndex)}>
                      {item.hidden ? <FaEye size={24} /> : <FaEyeSlash size={24} />}
                    </button>
                    <button className="" onClick={() => resetItem(index, itemIndex)}>
                      <GrPowerReset size={24} />
                    </button>
                    <button className="" onClick={() => deleteItem(index, itemIndex)}>
                      <RxCross2 size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Save and Cancel Buttons */}
      <div className="flex justify-end gap-4">
        <Button className="btn-outline">Reset</Button>
        <Button className="btn-primary">Save</Button>
      </div>
    </div>
  );
};
