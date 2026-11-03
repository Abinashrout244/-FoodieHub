import { useState } from "react";
import { FiUpload, FiImage, FiChevronDown } from "react-icons/fi";
import { productAPI } from "../services/api";
import toast from "react-hot-toast";

const categories = [
  "Salad",
  "Pizza",
  "Burger",
  "Pasta",
  "Dessert",
  "Drinks",
  "Sandwich",
  "Biryani",
];

// Shared Tailwind classes for inputs
const inputClass =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 hover:border-white/20 focus:border-primary/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-primary/10";
const labelClass =
  "block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Pizza",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image");
      return;
    }
    if (!formData.name || !formData.description || !formData.price) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("image", image);

      await productAPI.add(data);
      toast.success("Product added successfully! 🎉");
      setFormData({ name: "", description: "", category: "Pizza", price: "" });
      setImage(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Add New{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Item
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new dish for your menu
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* Image Upload */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-dark-lighter p-5 shadow-xl shadow-black/20">
          <label className={labelClass}>Product Image</label>
          <div
            onClick={() => document.getElementById("image-upload").click()}
            className="group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20">
                    <FiUpload size={16} />
                    Change image
                  </span>
                </div>
              </>
            ) : (
              <div className="px-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                  <FiImage size={28} />
                </div>
                <p className="text-sm font-medium text-gray-300">
                  Click to upload image
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  JPG, PNG, WEBP (max 5MB)
                </p>
              </div>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Details */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-dark-lighter p-5 sm:p-6 shadow-xl shadow-black/20">
          {/* Name */}
          <div className="mb-5">
            <label className={labelClass}>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Margherita Pizza"
              className={inputClass}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the dish..."
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Category */}
            <div>
              <label className={labelClass}>Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-dark-lighter">
                      {cat}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className={labelClass}>Price (₹)</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299"
                  className={`${inputClass} pl-9`}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <FiUpload size={18} />
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
