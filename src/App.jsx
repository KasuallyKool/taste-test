import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Header from "@/components/recipe/Header";
import FilterBar from "@/components/recipe/FilterBar";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import ViewModal from "@/components/recipe/ViewModal";
import RecipeFormModal from "@/components/recipe/RecipeFormModal";
import PinModal from "@/components/recipe/PinModal";
import Lightbox from "@/components/recipe/Lightbox";
import ToastNotification from "@/components/recipe/ToastNotification";
import "@/styles/recipe-global.css";

const OWNER_PIN = "1721";

export default function Home() {
  const [filter, setFilter] = useState("Breakfast");
  const [viewRecipe, setViewRecipe] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [isOwner, setIsOwner] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const queryClient = useQueryClient();

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: () => base44.entities.Recipe.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Recipe.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      showToast("🎉 Recipe saved!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Recipe.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      showToast("✅ Recipe updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Recipe.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      showToast("🗑 Recipe deleted.");
    },
  });

  const filtered = recipes.filter(r => filter === "All" || r.category === filter);

  const handleSave = (recipe) => {
    const { id, ...data } = recipe;
    if (id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
    setShowForm(false);
    setEditRecipe(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    deleteMutation.mutate(id);
  };

  const handleEdit = (recipe) => {
    setEditRecipe(recipe);
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF7" }}>
      <Header
        isOwner={isOwner}
        onAddRecipe={() => { setEditRecipe(null); setShowForm(true); }}
        onToggleLock={() => {
          if (isOwner) {
            setIsOwner(false);
            showToast("🔒 Editing locked");
          } else {
            setShowPin(true);
          }
        }}
      />
      <FilterBar filter={filter} setFilter={setFilter} />

      <main style={{ padding: 32, maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.7rem", color: "#5C4A2A", marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
          ✨ My Recipes
          <div style={{ flex: 1, height: 1.5, background: "#E8D9C4", borderRadius: 2 }} />
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16, animation: "spin 1.5s linear infinite" }}>🍳</div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.3rem", color: "#9A7D50" }}>Loading recipes...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <RecipeGrid
            recipes={filtered}
            allEmpty={recipes.length === 0}
            onView={setViewRecipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={isOwner}
          />
        )}
      </main>

      {viewRecipe && (
        <ViewModal
          recipe={viewRecipe}
          onClose={() => setViewRecipe(null)}
          onEdit={r => { setViewRecipe(null); handleEdit(r); }}
          onDelete={id => { setViewRecipe(null); handleDelete(id); }}
          onLightbox={setLightboxSrc}
          isOwner={isOwner}
        />
      )}
      {showForm && (
        <RecipeFormModal
          initial={editRecipe}
          onClose={() => { setShowForm(false); setEditRecipe(null); }}
          onSave={handleSave}
        />
      )}
      {showPin && (
        <PinModal
          pin={OWNER_PIN}
          onSuccess={() => { setIsOwner(true); showToast("🔓 Editing unlocked!"); }}
          onClose={() => setShowPin(false)}
        />
      )}
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <ToastNotification message={toast.msg} visible={toast.visible} />
    </div>
  );
}