import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronDown, FiChevronRight, FiStar, FiAlertTriangle, FiList } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────
const initialRestaurantForm = {
  name: '', image: '', cuisines: '', location: '',
  deliveryTime: '30-35', deliveryFee: 0, minOrder: 149,
  priceForTwo: 500, offer: '', rating: 4.0, totalRatings: '0',
  isOpen: true, tags: '',
};

const initialItemForm = {
  name: '', price: '', description: '', image: '',
  isVeg: false, isBestseller: false, isCustomizable: false,
  rating: 4.0, reviews: 0,
};

// ─── Modal Component ──────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col pt-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Delete Dialog ────────────────────────────────────────
const ConfirmDelete = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="relative bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiAlertTriangle size={24} className="text-red-400" />
      </div>
      <h3 className="text-white font-semibold mb-2">Confirm Delete</h3>
      <p className="text-gray-400 text-sm mb-5">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-white/5 text-sm transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">Delete</button>
      </div>
    </div>
  </div>
);

// ─── Form Input ───────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-xs font-medium mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-gray-800 border border-gray-700 focus:border-primary/60 text-white text-sm rounded-xl px-4 py-2.5 outline-none placeholder-gray-600 transition-colors"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    rows={3}
    className="w-full bg-gray-800 border border-gray-700 focus:border-primary/60 text-white text-sm rounded-xl px-4 py-2.5 outline-none placeholder-gray-600 transition-colors resize-none"
  />
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={onChange}
      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-gray-700'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
    </div>
    <span className="text-gray-300 text-sm">{label}</span>
  </label>
);

// ─────────────────────────────────────────────────────────────────
//  Restaurant Form Modal
// ─────────────────────────────────────────────────────────────────
const RestaurantFormModal = ({ restaurant, onClose, onSaved }) => {
  const [form, setForm] = useState(
    restaurant
      ? { ...restaurant, cuisines: (restaurant.cuisines || []).join(', '), tags: (restaurant.tags || []).join(', ') }
      : initialRestaurantForm
  );
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        cuisines: form.cuisines.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        deliveryFee: Number(form.deliveryFee),
        minOrder: Number(form.minOrder),
        priceForTwo: Number(form.priceForTwo),
        rating: Number(form.rating),
      };
      if (restaurant) {
        await restaurantAPI.update(restaurant._id, payload);
        toast.success('Restaurant updated!');
      } else {
        await restaurantAPI.create(payload);
        toast.success('Restaurant created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving restaurant');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={restaurant ? 'Edit Restaurant' : 'Add Restaurant'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="Restaurant Name" required>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Hotel Megha" required />
        </Field>
        <Field label="Cover Image URL" required>
          <Input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." required />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Connaught Place, Delhi" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cuisines (comma separated)" required>
            <Input value={form.cuisines} onChange={e => set('cuisines', e.target.value)} placeholder="North Indian, Chicken" required />
          </Field>
          <Field label="Tags (comma separated)">
            <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Bestseller, Trending" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Delivery Time">
            <Input value={form.deliveryTime} onChange={e => set('deliveryTime', e.target.value)} placeholder="30-35" />
          </Field>
          <Field label="Delivery Fee (₹)">
            <Input type="number" value={form.deliveryFee} onChange={e => set('deliveryFee', e.target.value)} min={0} />
          </Field>
          <Field label="Min Order (₹)">
            <Input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} min={0} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price for Two (₹)">
            <Input type="number" value={form.priceForTwo} onChange={e => set('priceForTwo', e.target.value)} min={0} />
          </Field>
          <Field label="Rating">
            <Input type="number" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} />
          </Field>
        </div>
        <Field label="Offer Text">
          <Input value={form.offer} onChange={e => set('offer', e.target.value)} placeholder="50% OFF up to ₹100" />
        </Field>
        <div className="flex gap-6 mb-5 mt-1">
          <Toggle checked={form.isOpen} onChange={() => set('isOpen', !form.isOpen)} label="Currently Open" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {saving ? <><span className="animate-spin">↻</span></> : <><FiCheck /> {restaurant ? 'Update Restaurant' : 'Create Restaurant'}</>}
        </button>
      </form>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────
//  Menu Item Form Modal
// ─────────────────────────────────────────────────────────────────
const ItemFormModal = ({ restaurantId, sectionId, item, onClose, onSaved }) => {
  const [form, setForm] = useState(item ? { ...item } : initialItemForm);
  const [saving, setSaving] = useState(false);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), rating: Number(form.rating), reviews: Number(form.reviews) };
      if (item) {
        await restaurantAPI.updateItem(restaurantId, sectionId, item._id, payload);
        toast.success('Item updated!');
      } else {
        await restaurantAPI.addItem(restaurantId, sectionId, payload);
        toast.success('Item added!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={item ? 'Edit Menu Item' : 'Add Menu Item'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="Item Name" required>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Chicken Butter Masala" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)" required>
            <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} min={0} required />
          </Field>
          <Field label="Rating">
            <Input type="number" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} />
          </Field>
        </div>
        <Field label="Image URL">
          <Input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." />
        </Field>
        <Field label="Description">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the dish..." />
        </Field>
        <Field label="Reviews Count">
          <Input type="number" value={form.reviews} onChange={e => set('reviews', e.target.value)} min={0} />
        </Field>
        <div className="flex flex-col gap-3 mb-5 mt-1">
          <Toggle checked={form.isVeg} onChange={() => set('isVeg', !form.isVeg)} label="🟢 Pure Veg" />
          <Toggle checked={form.isBestseller} onChange={() => set('isBestseller', !form.isBestseller)} label="⭐ Bestseller" />
          <Toggle checked={form.isCustomizable} onChange={() => set('isCustomizable', !form.isCustomizable)} label="🔧 Customizable" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {saving ? <><span className="animate-spin">↻</span> Saving...</> : <><FiCheck /> {item ? 'Update Item' : 'Add Item'}</>}
        </button>
      </form>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────
//  Restaurant Menu Manager
// ─────────────────────────────────────────────────────────────────
const MenuManager = ({ restaurant, onRefresh }) => {
  const [addSectionName, setAddSectionName] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [itemModal, setItemModal] = useState(null); // { sectionId, item? }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddSection = async () => {
    if (!addSectionName.trim()) return;
    try {
      await restaurantAPI.addSection(restaurant._id, { category: addSectionName.trim() });
      toast.success('Section added!');
      setAddSectionName('');
      setAddingSection(false);
      onRefresh();
    } catch (err) {
      toast.error('Failed to add section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await restaurantAPI.deleteSection(restaurant._id, sectionId);
      toast.success('Section deleted');
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete section');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteItem = async (sectionId, itemId) => {
    try {
      await restaurantAPI.deleteItem(restaurant._id, sectionId, itemId);
      toast.success('Item deleted');
      onRefresh();
    } catch (err) {
      toast.error('Failed to delete item');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Menu Sections</span>
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-white border border-primary/30 hover:bg-primary px-3 py-1.5 rounded-lg transition-all"
        >
          <FiPlus size={13} /> Add Section
        </button>
      </div>

      {addingSection && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={addSectionName}
            onChange={e => setAddSectionName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddSection(); if (e.key === 'Escape') setAddingSection(false); }}
            placeholder="e.g. Chicken Specials"
            className="flex-1 bg-gray-800 border border-primary/40 text-white text-sm rounded-xl px-3 py-2 outline-none"
            autoFocus
          />
          <button onClick={handleAddSection} className="px-3 py-2 bg-primary text-white rounded-xl text-sm"><FiCheck size={14} /></button>
          <button onClick={() => setAddingSection(false)} className="px-3 py-2 bg-white/5 text-gray-400 rounded-xl text-sm"><FiX size={14} /></button>
        </div>
      )}

      {(restaurant.menu || []).map((section) => (
        <div key={section._id} className="mb-3 bg-gray-800/30 border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => toggleSection(section._id)} className="flex items-center gap-2 text-white font-medium text-sm">
              {expandedSections[section._id] ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              {section.category}
              <span className="text-gray-500 text-xs font-normal">({section.items.length} items)</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setItemModal({ sectionId: section._id })}
                className="text-xs text-green-400 hover:bg-green-400/10 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <FiPlus size={12} /> Add Item
              </button>
              <button
                onClick={() => setDeleteTarget({ type: 'section', sectionId: section._id, label: section.category })}
                className="text-gray-600 hover:text-red-400 p-1 rounded-lg transition-colors"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>

          {expandedSections[section._id] && (
            <div className="px-4 pb-3 space-y-2">
              {section.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between bg-gray-800 border border-white/5 rounded-xl px-3 py-2.5 group">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-sm border inline-block ${item.isVeg ? 'border-green-500 bg-green-500/50' : 'border-red-500 bg-red-500/50'}`} />
                        <span className="text-white text-sm font-medium">{item.name}</span>
                        {item.isBestseller && <span className="text-yellow-400 text-[10px] border border-yellow-400/30 px-1 rounded">★ Best</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-primary text-xs font-semibold">₹{item.price}</span>
                        <span className="text-gray-600 text-xs flex items-center gap-0.5"><FiStar size={9} fill="currentColor" /> {item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 transition-opacity">
                    <button
                      onClick={() => setItemModal({ sectionId: section._id, item })}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'item', sectionId: section._id, itemId: item._id, label: item.name })}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {section.items.length === 0 && (
                <p className="text-gray-600 text-xs text-center py-3">No items yet — click "Add Item" above</p>
              )}
            </div>
          )}
        </div>
      ))}

      {itemModal && (
        <ItemFormModal
          restaurantId={restaurant._id}
          sectionId={itemModal.sectionId}
          item={itemModal.item}
          onClose={() => setItemModal(null)}
          onSaved={onRefresh}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          message={`Delete "${deleteTarget.label}"? This cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget.type === 'section') handleDeleteSection(deleteTarget.sectionId);
            else handleDeleteItem(deleteTarget.sectionId, deleteTarget.itemId);
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
//  Main Restaurants List
// ─────────────────────────────────────────────────────────────────
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);
  const [restaurantModal, setRestaurantModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fullRestaurant, setFullRestaurant] = useState({});

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await restaurantAPI.getAll();
      setRestaurants(data);
    } catch {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const fetchFullRestaurant = async (id) => {
    try {
      const { data } = await restaurantAPI.getById(id);
      setFullRestaurant(prev => ({ ...prev, [id]: data }));
    } catch {
      toast.error('Failed to load menu');
    }
  };

  const toggleExpand = (id) => {
    if (expandedRestaurant === id) {
      setExpandedRestaurant(null);
    } else {
      setExpandedRestaurant(id);
      if (!fullRestaurant[id]) fetchFullRestaurant(id);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await restaurantAPI.delete(id);
      toast.success('Restaurant deleted');
      fetchRestaurants();
      if (expandedRestaurant === id) setExpandedRestaurant(null);
    } catch {
      toast.error('Failed to delete restaurant');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMenuRefresh = (id) => {
    fetchFullRestaurant(id);
    fetchRestaurants();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">
          Manage <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Restaurants</span>
          <span className="text-gray-500 text-sm font-normal ml-2">({restaurants.length})</span>
        </h1>
        <button
          onClick={() => setRestaurantModal({})}
          className="flex flex-row items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-lg"
        >
          <FiPlus size={16} /> Add Restaurant
        </button>
      </div>

      {loading ? (
           <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🍽️</span>
          <p className="text-gray-400">No restaurants yet. Add one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {restaurants.map((r) => (
            <div key={r._id} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                <div className="w-full md:w-20 md:h-16 h-40 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://placehold.co/56x56/1a1a2e/ff6b35?text=🍽️'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-semibold text-base">{r.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.isOpen ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {r.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">{(r.cuisines || []).join(' · ')}</p>
                  <p className="text-gray-600 text-xs mt-0.5">📍 {r.location}</p>
                </div>
                <div className="flex items-center justify-end gap-2 shrink-0 md:w-auto w-full border-t md:border-0 border-white/5 pt-3 md:pt-0">
                  <button
                    onClick={() => toggleExpand(r._id)}
                    className={`text-sm px-4 py-2 rounded-lg border flex flex-1 md:flex-none items-center justify-center gap-1 transition-all ${
                      expandedRestaurant === r._id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'border-gray-700 text-gray-400 hover:border-indigo-500/30 hover:text-indigo-400'
                    }`}
                  >
                    <FiList size={14} /> Menu
                  </button>
                  <button
                    onClick={() => setRestaurantModal(r)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors border border-transparent md:border-gray-700 md:hover:border-blue-400/20"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: r._id, label: r.name })}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent md:border-gray-700 md:hover:border-red-400/20"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {expandedRestaurant === r._id && fullRestaurant[r._id] && (
                <div className="overflow-hidden border-t border-white/5 px-4 bg-gray-900/50 pb-4">
                  <MenuManager
                    restaurant={fullRestaurant[r._id]}
                    onRefresh={() => handleMenuRefresh(r._id)}
                  />
                </div>
              )}
              {expandedRestaurant === r._id && !fullRestaurant[r._id] && (
                <div className="p-4 border-t border-white/5 text-center text-gray-500 text-sm animate-pulse">Loading menu...</div>
              )}
            </div>
          ))}
        </div>
      )}

      {restaurantModal !== null && (
        <RestaurantFormModal
          restaurant={restaurantModal._id ? restaurantModal : null}
          onClose={() => setRestaurantModal(null)}
          onSaved={fetchRestaurants}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          message={`Delete "${deleteTarget.label}"? This will remove the restaurant and all its menu items.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteRestaurant(deleteTarget.id)}
        />
      )}
    </div>
  );
};

export default Restaurants;
