import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

const ListItems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    price: '',
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // ✅ Edit (name removed)
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      description: product.description,
      category: product.category,
      price: product.price,
      image: null,
    });
  };

  // ✅ Change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Update (name removed)
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);

      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await productAPI.update(editingProduct._id, data);

      setProducts(products.map((p) =>
        p._id === editingProduct._id ? res.data : p
      ));

      toast.success('Product updated');
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-6">
        All <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Products</span>
        <span className="text-gray-500 text-sm font-normal ml-2">({products.length})</span>
      </h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📦</span>
          <p className="text-gray-400">No products yet. Add some items first!</p>
        </div>
      ) : (
       <>
       {/* ✅ MOBILE VIEW (NO SCROLL) */}
<div className="md:hidden space-y-4">
  {products.map((product) => (
    <div
      key={product._id}
      className="bg-gray-900 border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-center gap-3">
        <img
          src={getImageUrl(product.image)}
          className="w-14 h-14 rounded-lg object-cover"
        />

        <div className="flex-1">
          <p className="text-white font-medium">{product.name}</p>
          <p className="text-gray-400 text-sm">{product.category}</p>
          <p className="text-primary font-semibold">₹{product.price}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-3">
        <button onClick={() => handleEdit(product)}>
          <FiEdit />
        </button>
        <button onClick={() => handleDelete(product._id)}>
          <FiTrash2 />
        </button>
      </div>
    </div>
  ))}
</div>


{/* ✅ DESKTOP TABLE (UNCHANGED) */}
<div className="hidden md:block card-glass overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left px-5 py-4 text-gray-400 text-sm font-medium">Image</th>
          <th className="text-left px-5 py-4 text-gray-400 text-sm font-medium">Name</th>
          <th className="text-left px-5 py-4 text-gray-400 text-sm font-medium">Category</th>
          <th className="text-left px-5 py-4 text-gray-400 text-sm font-medium">Price</th>
          <th className="text-left px-5 py-4 text-gray-400 text-sm font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="px-5 py-3">
              <img
                src={getImageUrl(product.image)}
                className="w-14 h-14 rounded-xl object-cover"
              />
            </td>
            <td className="px-5 py-3 text-white">{product.name}</td>
            <td className="px-5 py-3 text-gray-400">{product.category}</td>
            <td className="px-5 py-3 text-primary font-semibold">₹{product.price}</td>
            <td className="px-5 py-3">
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)}>
                  <FiEdit />
                </button>
                <button onClick={() => handleDelete(product._id)}>
                  <FiTrash2 />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
       </>
      )}

      {/* ✅ LUXURY MODAL ONLY */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          
          <div className="relative w-full max-w-md p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 shadow-2xl">
            
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6">
              
              <h2 className="text-white text-xl font-semibold mb-5">
                ✨ Edit Product
              </h2>

              <div className="space-y-3">
                
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="text-gray-300 text-sm"
                />

                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    className="w-20 h-20 rounded-lg mt-2 border border-white/10"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-medium"
                >
                  Update
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ListItems;