import { useState, useEffect } from "react";
import { FaCalendar, FaPlus, FaSave } from "react-icons/fa";
import { Button } from "../../../../../components";
import { Layout } from "../../../../../components/ui";

// Types
interface Villa {
  id: string;
  name: string;
}

interface PriceRule {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  season: string;
  isDiscount: boolean;
  discount: number;
  isActive: boolean;
  villaIds: string[];
}

// Mock API functions
const mockFetchVillas = (): Promise<Villa[]> => {
  return Promise.resolve([
    { id: "villa-1", name: "Luxury Villa 1" },
    { id: "villa-2", name: "Seaside Villa 2" },
    { id: "villa-3", name: "Garden Villa 3" },
  ]);
};

const mockSavePriceRule = (priceRule: PriceRule): Promise<PriceRule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...priceRule,
        id: priceRule.id || `rule-${Math.random().toString(36).substring(2, 9)}`,
      });
    }, 800);
  });
};

// Seasons options
const SEASONS = ["Low Season", "Normal Season", "High Season", "Peak Season"];

export const PriceRulePage = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [priceRules, setPriceRules] = useState<PriceRule[]>([]);
  const [currentRule, setCurrentRule] = useState<PriceRule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);

  // Fetch villas on mount
  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const villaData = await mockFetchVillas();
        setVillas(villaData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVillas();
  }, []);

  const handleAddNewRule = () => {
    setCurrentRule({
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      season: SEASONS[0],
      isDiscount: false,
      discount: 0,
      isActive: true,
      villaIds: [],
    });
    setIsAddingRule(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentRule) return;

    const { name, value } = e.target;
    let newValue: any = value;

    if (name === "isDiscount" || name === "isActive") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === "discount") {
      newValue = parseInt(value) || 0;
    }

    setCurrentRule({
      ...currentRule,
      [name]: newValue,
    });
  };

  const handleVillaSelection = (villaId: string) => {
    if (!currentRule) return;

    const newVillaIds = currentRule.villaIds.includes(villaId) ? currentRule.villaIds.filter((id) => id !== villaId) : [...currentRule.villaIds, villaId];

    setCurrentRule({
      ...currentRule,
      villaIds: newVillaIds,
    });
  };

  const handleSaveRule = async () => {
    if (!currentRule) return;

    try {
      if (!currentRule.name) {
        return;
      }

      if (!currentRule.villaIds.length) {
        return;
      }

      if (currentRule.isDiscount && (currentRule.discount <= 0 || currentRule.discount > 100)) {
        return;
      }

      const savedRule = await mockSavePriceRule(currentRule);

      // Add to existing rules or update
      if (currentRule.id) {
        setPriceRules((rules) => rules.map((r) => (r.id === currentRule.id ? savedRule : r)));
      } else {
        setPriceRules((rules) => [...rules, savedRule]);
      }

      setCurrentRule(null);
      setIsAddingRule(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setCurrentRule(null);
    setIsAddingRule(false);
  };

  // Fill with sample data for demonstration
  useEffect(() => {
    // Demo data matching the example from the backend
    const demoRule: PriceRule = {
      id: "demo-rule-1",
      name: "High Season For Some Villa",
      description: "Applying High Season Daily Price to Some Villa",
      startDate: "2025-06-01",
      endDate: "2025-06-30",
      season: "Low Season",
      isDiscount: true,
      discount: 10,
      isActive: true,
      villaIds: ["villa-1"],
    };

    setPriceRules([demoRule]);
  }, []);

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Villa & Home Management</h1>

        <Button onClick={handleAddNewRule} className="flex items-center gap-2 btn-primary">
          <FaPlus /> Add New Rules
        </Button>
      </header>

      {/* Rule form */}
      {isAddingRule && currentRule && (
        <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="pb-2 mb-4 text-xl font-semibold text-blue-700 border-b">Create New Price Rule</h2>

          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Rule Name</label>
              <input
                type="text"
                name="name"
                value={currentRule.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g. Summer High Season 2025"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Season</label>
              <select name="season" value={currentRule.season} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                {SEASONS.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={currentRule.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Describe the purpose of this price rule"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
              <div className="relative">
                <input type="date" name="startDate" value={currentRule.startDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                <FaCalendar className="absolute w-5 h-5 text-gray-400 right-3 top-2" />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
              <div className="relative">
                <input type="date" name="endDate" value={currentRule.endDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                <FaCalendar className="absolute w-5 h-5 text-gray-400 right-3 top-2" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input type="checkbox" id="isDiscount" name="isDiscount" checked={currentRule.isDiscount} onChange={handleInputChange} className="w-4 h-4 mr-2" />
              <label htmlFor="isDiscount" className="text-sm font-medium text-gray-700">
                Apply Discount
              </label>
            </div>

            {currentRule.isDiscount && (
              <div className="pl-6">
                <label className="block mb-1 text-sm font-medium text-gray-700">Discount Percentage</label>
                <div className="relative">
                  <input type="number" name="discount" value={currentRule.discount} onChange={handleInputChange} min="0" max="100" className="w-32 p-2 pr-8 border border-gray-300 rounded-md" />
                  <span className="absolute text-gray-500 right-3 top-2">%</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={currentRule.isActive}
                  onChange={handleInputChange}
                  className="absolute block w-6 h-6 bg-white border-4 rounded-full opacity-0 appearance-none cursor-pointer"
                />
                <label htmlFor="isActive" className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${currentRule.isActive ? "bg-green-400" : ""}`}>
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${currentRule.isActive ? "translate-x-4" : "translate-x-0"}`}
                  ></span>
                </label>
              </div>
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-lg font-medium text-blue-700">Select Villas</h3>
            <div className="p-4 rounded-md bg-blue-50">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {villas.map((villa) => (
                  <div key={villa.id} className="flex items-center p-2 bg-white border border-blue-100 rounded">
                    <input
                      type="checkbox"
                      id={`villa-${villa.id}`}
                      checked={currentRule.villaIds.includes(villa.id)}
                      onChange={() => handleVillaSelection(villa.id)}
                      className="w-4 h-4 mr-2 accent-blue-600"
                    />
                    <label htmlFor={`villa-${villa.id}`} className="text-sm text-gray-700">
                      {villa.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button onClick={handleCancelEdit} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button onClick={handleSaveRule} className="flex items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
              <FaSave className="w-5 h-5 mr-2" />
              Save Rule
            </button>
          </div>
        </div>
      )}

      {/* List of price rules */}
      <div>
        <h2 className="mb-3 text-xl font-semibold text-gray-700">Current Price Rules</h2>

        {priceRules.length === 0 ? (
          <div className="py-6 text-center text-gray-500 rounded-md bg-gray-50">No price rules have been created yet.</div>
        ) : (
          <div className="space-y-4">
            {priceRules.map((rule) => (
              <div key={rule.id} className="relative p-4 bg-white border rounded-md shadow-sm">
                {/* Inactive overlay */}
                {!rule.isActive && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 rounded-md bg-opacity-60">
                    <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full">Inactive Rule</span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 mb-3 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">{rule.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{rule.description}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500">{rule.isActive ? "Active" : "Inactive"}</div>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" checked={rule.isActive} readOnly className="absolute block w-6 h-6 bg-white border-4 rounded-full opacity-0 appearance-none cursor-pointer" />
                      <label className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${rule.isActive ? "bg-green-400" : ""}`}>
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${rule.isActive ? "translate-x-4" : "translate-x-0"}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-3 md:grid-cols-3">
                  <div className="p-3 rounded bg-gray-50">
                    <span className="block mb-1 text-xs font-medium text-gray-500 uppercase">Season</span>
                    <span className="font-medium">{rule.season}</span>
                  </div>

                  <div className="p-3 rounded bg-gray-50">
                    <span className="block mb-1 text-xs font-medium text-gray-500 uppercase">Period</span>
                    <span className="font-medium">
                      {new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-gray-50">
                    <span className="block mb-1 text-xs font-medium text-gray-500 uppercase">Discount</span>
                    <span className="font-medium">{rule.isDiscount ? <span className="text-green-600">{rule.discount}% Off</span> : <span className="text-gray-600">No discount</span>}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-blue-50">
                  <span className="block mb-1 text-xs font-medium text-blue-700 uppercase">Applied to</span>
                  <div className="flex flex-wrap gap-2">
                    {villas
                      .filter((v) => rule.villaIds.includes(v.id))
                      .map((v) => (
                        <span key={v.id} className="px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded">
                          {v.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
