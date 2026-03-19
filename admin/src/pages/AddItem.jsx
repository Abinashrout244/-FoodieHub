import { useState } from 'react';
import { FiUpload, FiImage } from 'react-icons/fi';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

const categories = ['Salad', 'Pizza', 'Burger', 'Pasta', 'Dessert', 'Drinks', 'Sandwich', 'Biryani'];

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pizza',
    price: '',
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
      toast.error('Please upload an image');
      return;
    }
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('image', image);

      await productAPI.add(data);
      toast.success('Product added successfully! 🎉');
      setFormData({ name: '', description: '', category: 'Pizza', price: '' });
      setImage(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-6">
        Add New <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Item</span>
      </h1>

      <form onSubmit={handleSubmit} className="card-glass p-6 max-w-2xl">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Product Image</label>
          <div
            onClick={() => document.getElementById('image-upload').click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-xl mx-auto" />
            ) : (
              <div className="text-gray-500">
                <FiImage size={40} className="mx-auto mb-2" />
                <p>Click to upload image</p>
                <p className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP (max 5MB)</p>
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

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Margherita Pizza"
            className="input-field"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the dish..."
            rows={3}
            className="input-field resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Category */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-dark-lighter">{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="299"
              className="input-field"
              min="0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FiUpload size={18} />
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
