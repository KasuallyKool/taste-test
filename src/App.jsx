import { useState, useEffect, useRef } from "react";

// ── SERVICE WORKER REGISTRATION ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ── PIN (change this to whatever you like) ──
const OWNER_PIN = "1721";

// ── IMGBB API KEY ──
const IMGBB_API_KEY = "badf28112d865e9e6e1da33ebc03b6a8";

// ── IMGBB UPLOAD HELPER ──
async function uploadToImgbb(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  return json.data.url;
}

// ── PIN MODAL ──
function PinModal({ onSuccess, onClose }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (pin === OWNER_PIN) {
      onSuccess();
      onClose();
    } else {
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(40,28,10,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#FFF8EE", borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 320,
        boxShadow: "0 24px 64px rgba(40,28,10,0.25)", border: "1px solid #E8D9C4", textAlign: "center",
        animation: shake ? "shake 0.5s ease" : "none",
      }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔐</div>
        <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: "1.7rem", fontWeight: 700, color: "#2C2416", marginBottom: 6 }}>Owner Access</h2>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "#9A7D50", marginBottom: 24 }}>Enter your PIN to unlock editing</p>
        <input
          type="password" inputMode="numeric" maxLength={6}
          value={pin} onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
          placeholder="••••"
          style={{ width: "100%", padding: "12px", border: "2px solid #E8D9C4", borderRadius: 12, fontFamily: "'Caveat', cursive", fontSize: "1.6rem", textAlign: "center", letterSpacing: "0.4em", color: "#2C2416", background: "white", outline: "none", marginBottom: 16 }}
        />
        <button onClick={handleSubmit} style={{ width: "100%", background: "#E07A3A", color: "white", border: "none", borderRadius: 12, padding: "12px", fontFamily: "'Caveat', cursive", fontSize: "1.15rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(224,122,58,0.3)" }}>
          Unlock 🔓
        </button>
        <button onClick={onClose} style={{ marginTop: 10, background: "transparent", border: "none", fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "#9A7D50", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── SEED DATA ──
const SEED_RECIPES = [
  {
    id: "seed1",
    name: "Golden Lemon Pasta",
    category: "Dinner",
    time: "25 mins",
    servings: "4",
    desc: "A simple, bright pasta dish with brown butter, lemon and parmesan. Weeknight magic.",
    ingredients: [
      { qty: "400g", unit: "", name: "Spaghetti" },
      { qty: "4 tbsp", unit: "", name: "Unsalted butter" },
      { qty: "2", unit: "", name: "Lemons, zested and juiced" },
      { qty: "80g", unit: "", name: "Parmesan, grated" },
      { qty: "", unit: "", name: "Salt and black pepper" },
      { qty: "1 handful", unit: "", name: "Fresh parsley" },
    ],
    steps: [
      "Cook spaghetti in well-salted water until al dente. Reserve 1 cup of pasta water.",
      "Brown the butter in a large pan over medium heat until nutty and golden.",
      "Add lemon zest to the butter, then remove from heat.",
      "Toss drained pasta in the pan with butter, adding pasta water gradually.",
      "Add lemon juice and parmesan, tossing vigorously to create a silky sauce.",
      "Season generously with salt and pepper, top with parsley and serve immediately.",
    ],
    notes: "The key is not letting the lemon juice cook too long — add it off the heat for the brightest flavour!",
    images: [],
    createdAt: Date.now() - 100000,
  },
  {
    id: "seed2",
    name: "Fluffy Ricotta Pancakes",
    category: "Breakfast",
    time: "20 mins",
    servings: "2",
    desc: "Cloud-like pancakes with ricotta cheese for incredible lift and a creamy interior.",
    ingredients: [
      { qty: "1 cup", unit: "", name: "Ricotta cheese" },
      { qty: "2", unit: "", name: "Eggs, separated" },
      { qty: "1/2 cup", unit: "", name: "All-purpose flour" },
      { qty: "1 tsp", unit: "", name: "Baking powder" },
      { qty: "2 tbsp", unit: "", name: "Sugar" },
      { qty: "1/4 cup", unit: "", name: "Milk" },
      { qty: "1 tsp", unit: "", name: "Vanilla extract" },
    ],
    steps: [
      "Separate eggs. Whisk yolks with ricotta, milk, sugar and vanilla.",
      "Fold in flour and baking powder until just combined.",
      "Beat egg whites to stiff peaks, then gently fold into batter.",
      "Cook on a buttered non-stick pan over medium-low heat until bubbles form.",
      "Flip gently and cook for 1-2 more minutes until golden.",
      "Serve with maple syrup and fresh berries.",
    ],
    notes: "Don't over-mix after adding the egg whites — the lumps are what make them fluffy!",
    images: [],
    createdAt: Date.now() - 50000,
  },
];

const CATEGORY_EMOJI = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
  Snacks: "🍎",
  Dessert: "🍰",
  Drinks: "🥤",
};

const FILTERS = [
  { label: "🌅 Breakfast", value: "Breakfast" },
  { label: "☀️ Lunch", value: "Lunch" },
  { label: "🌙 Dinner", value: "Dinner" },
];

const EMPTY_INGREDIENT = () => ({ id: Date.now() + Math.random(), qty: "", unit: "", name: "" });
const EMPTY_STEP = () => ({ id: Date.now() + Math.random(), text: "" });

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// ── TOAST ──
function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 500,
      background: "#2C2416", color: "white", padding: "12px 22px",
      borderRadius: 12, fontFamily: "'Caveat', cursive", fontSize: "1.1rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0, transition: "all 0.3s",
      pointerEvents: "none",
    }}>
      {message}
    </div>
  );
}

// ── LIGHTBOX ──
function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 20, right: 24, color: "white",
        fontSize: "1.8rem", cursor: "pointer", background: "rgba(255,255,255,0.12)",
        border: "none", borderRadius: "50%", width: 44, height: 44,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>✕</button>
      <img src={src} alt="full" onClick={e => e.stopPropagation()} style={{
        maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }} />
    </div>
  );
}

// ── RECIPE CARD ──
function RecipeCard({ recipe, onView, onEdit, onDelete, isOwner }) {
  const emoji = CATEGORY_EMOJI[recipe.category] || "🍳";
  return (
    <div onClick={() => onView(recipe)} style={{
      background: "white", borderRadius: 16, overflow: "hidden",
      boxShadow: "0 3px 16px rgba(80,50,10,0.10)", border: "1px solid #E8D9C4",
      cursor: "pointer", position: "relative",
      transition: "transform 0.22s, box-shadow 0.22s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px) rotate(0.3deg)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(80,50,10,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 3px 16px rgba(80,50,10,0.10)"; }}
    >
      {recipe.images && recipe.images.length > 0
        ? <img src={recipe.images[0]} alt={recipe.name} style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }} />
        : <div style={{ width: "100%", height: 190, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", background: "linear-gradient(135deg, #FDE8D5 0%, #FAF0DC 100%)" }}>{emoji}</div>
      }
      <span style={{
        position: "absolute", top: 14, right: 14, background: "white", borderRadius: 12,
        padding: "4px 12px", fontFamily: "'Caveat', cursive", fontSize: "0.9rem",
        color: "#E07A3A", fontWeight: 600, boxShadow: "0 2px 8px rgba(80,50,10,0.10)",
      }}>{recipe.category}</span>

      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.55rem", fontWeight: 700, color: "#2C2416", marginBottom: 6, lineHeight: 1.2 }}>{recipe.name}</div>
        <p style={{ fontSize: "0.83rem", color: "#5C4A2A", lineHeight: 1.5, marginBottom: 14 }}>
          {recipe.desc ? recipe.desc.substring(0, 100) + (recipe.desc.length > 100 ? "…" : "") : "No description added yet."}
        </p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          {recipe.time && <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.95rem", color: "#9A7D50" }}>⏱ {recipe.time}</span>}
          {recipe.servings && <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.95rem", color: "#9A7D50" }}>👥 {recipe.servings} servings</span>}
          {recipe.ingredients?.length > 0 && <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.95rem", color: "#9A7D50" }}>🧺 {recipe.ingredients.filter(i => i.name).length} items</span>}
        </div>
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid #E8D9C4" }}>
          {isOwner && <CardBtn onClick={() => onEdit(recipe)}>✏️ Edit</CardBtn>}
          <CardBtn primary onClick={() => onView(recipe)}>👀 View</CardBtn>
          {isOwner && <CardBtn onClick={() => onDelete(recipe.id)} style={{ flex: "0 0 36px", color: "#C08060" }}>🗑</CardBtn>}
        </div>
      </div>
    </div>
  );
}

function CardBtn({ children, onClick, primary, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: "7px", borderRadius: 10, fontFamily: "'Caveat', cursive",
        fontSize: "1rem", fontWeight: 600, cursor: "pointer",
        border: primary ? "1.5px solid #E07A3A" : "1.5px solid #E8D9C4",
        background: primary ? "#E07A3A" : (hov ? "#FDE8D5" : "#FEF6E4"),
        color: primary ? "white" : (hov ? "#E07A3A" : "#5C4A2A"),
        transition: "all 0.18s",
        ...style,
      }}>{children}</button>
  );
}

// ── VIEW MODAL ──
function ViewModal({ recipe, onClose, onEdit, onDelete, onLightbox, isOwner }) {
  if (!recipe) return null;
  const emoji = CATEGORY_EMOJI[recipe.category] || "🍳";
  return (
    <ModalShell onClose={onClose}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "24px 28px 0" }}>
        <div>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: "1.9rem", fontWeight: 700, color: "#2C2416" }}>{recipe.name}</h2>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "#E07A3A" }}>{emoji} {recipe.category}</p>
        </div>
        <CloseBtn onClose={onClose} />
      </div>
      <div style={{ padding: "20px 28px 28px" }}>
        {recipe.images?.length > 0
          ? <img src={recipe.images[0]} alt={recipe.name} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 14, marginBottom: 20 }} />
          : <div style={{ width: "100%", height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", background: "linear-gradient(135deg,#FDE8D5,#FAF0DC)", borderRadius: 14, marginBottom: 20 }}>{emoji}</div>
        }

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          {recipe.time && <MetaPill>⏱ {recipe.time}</MetaPill>}
          {recipe.servings && <MetaPill>👥 {recipe.servings} servings</MetaPill>}
          {recipe.ingredients?.filter(i=>i.name).length > 0 && <MetaPill>🧺 {recipe.ingredients.filter(i=>i.name).length} ingredients</MetaPill>}
          {recipe.steps?.length > 0 && <MetaPill>📋 {recipe.steps.length} steps</MetaPill>}
        </div>

        {recipe.desc && <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#5C4A2A", marginBottom: 12, lineHeight: 1.6 }}>{recipe.desc}</p>}

        {recipe.ingredients?.filter(i=>i.name).length > 0 && <>
          <SectionTitle>🧺 Ingredients</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {recipe.ingredients.filter(i=>i.name).map((ing, i) => (
                <tr key={i}>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid #E8D9C4", fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#5C4A2A", width: 130, fontWeight: 600 }}>{ing.qty} {ing.unit}</td>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid #E8D9C4", fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#2C2416" }}>{ing.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>}

        {recipe.steps?.length > 0 && <>
          <SectionTitle>📋 Instructions</SectionTitle>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {recipe.steps.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "white", borderRadius: 10, border: "1px solid #E8D9C4" }}>
                <div style={{ background: "#E07A3A", color: "white", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Caveat', cursive", fontSize: "0.95rem", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#2C2416", lineHeight: 1.5 }}>{step}</div>
              </li>
            ))}
          </ol>
        </>}

        {recipe.images?.length > 1 && <>
          <SectionTitle>📸 Photos</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
            {recipe.images.map((src, i) => (
              <img key={i} src={src} alt="photo" onClick={() => onLightbox(src)} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 10, border: "1.5px solid #E8D9C4", cursor: "pointer", transition: "transform 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""} />
            ))}
          </div>
        </>}

        {recipe.notes && <>
          <SectionTitle>📝 Notes & Tips</SectionTitle>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#5C4A2A", background: "#E8F5E9", padding: 14, borderRadius: 10, lineHeight: 1.6 }}>{recipe.notes}</p>
        </>}

        <div style={{ display: "flex", gap: 10, marginTop: 22, paddingTop: 18, borderTop: "1px solid #E8D9C4" }}>
          {isOwner && <CardBtn onClick={() => { onClose(); onEdit(recipe); }}>✏️ Edit Recipe</CardBtn>}
          {isOwner && <CardBtn onClick={() => { onClose(); onDelete(recipe.id); }} style={{ color: "#C08060" }}>🗑 Delete</CardBtn>}
        </div>
      </div>
    </ModalShell>
  );
}

// ── ADD / EDIT MODAL ──
function RecipeFormModal({ initial, onClose, onSave }) {
  const isEdit = !!initial?.id;
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "Dinner");
  const [time, setTime] = useState(initial?.time || "");
  const [servings, setServings] = useState(initial?.servings || "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients.map(i => ({ ...i, id: Math.random() })) : [EMPTY_INGREDIENT()]
  );
  const [steps, setSteps] = useState(
    initial?.steps?.length ? initial.steps.map(s => ({ id: Math.random(), text: s })) : [EMPTY_STEP()]
  );
  const [images, setImages] = useState(initial?.images || []);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef();

  // ── IMGBB UPLOAD HANDLER (replaces base64 approach) ──
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    if (!files.length) return;

    setUploadError("");
    setUploadingCount(files.length);

    const results = await Promise.allSettled(files.map(file => uploadToImgbb(file)));

    const uploaded = [];
    const failed = [];
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        uploaded.push(result.value);
      } else {
        failed.push(files[i].name);
      }
    });

    if (uploaded.length) setImages(prev => [...prev, ...uploaded]);
    if (failed.length) setUploadError(`⚠️ Failed to upload: ${failed.join(", ")}. Please try again.`);
    setUploadingCount(0);
  };

  const handleSave = () => {
    if (!name.trim()) { alert("Please enter a recipe name!"); return; }
    if (uploadingCount > 0) { alert("Please wait for images to finish uploading."); return; }
    onSave({
      id: initial?.id || Date.now().toString(),
      name: name.trim(), category, time: time.trim(), servings,
      desc: desc.trim(), notes: notes.trim(),
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.map(s => s.text.trim()).filter(Boolean),
      images,
      createdAt: initial?.createdAt || Date.now(),
    });
  };

  return (
    <ModalShell onClose={onClose}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "24px 28px 0" }}>
        <div>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: "1.9rem", fontWeight: 700, color: "#2C2416" }}>{isEdit ? "✏️ Edit Recipe" : "✍️ New Recipe"}</h2>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "#5C4A2A" }}>{isEdit ? "make it even better!" : "write it down before you forget!"}</p>
        </div>
        <CloseBtn onClose={onClose} />
      </div>
      <div style={{ padding: "20px 28px 28px" }}>

        <FormGroup label="Recipe Name *">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Grandma's Lemon Cake..." />
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <FormGroup label="Category">
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              {["Dinner","Breakfast","Lunch","Snacks","Dessert","Drinks"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Prep + Cook Time">
            <Input value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 45 mins" />
          </FormGroup>
          <FormGroup label="Servings">
            <Input type="number" value={servings} onChange={e => setServings(e.target.value)} placeholder="4" min="1" />
          </FormGroup>
        </div>

        <FormGroup label="Short Description">
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="A brief note about this recipe..." style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.6 }} />
        </FormGroup>

        {/* INGREDIENTS */}
        <FormGroup label="🧺 Ingredients">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {ingredients.map((ing, i) => (
              <div key={ing.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={ing.qty} onChange={e => setIngredients(prev => prev.map((x,j) => j===i ? {...x, qty: e.target.value} : x))} placeholder="Qty" style={{ ...inputStyle, maxWidth: 80 }} />
                <input value={ing.unit} onChange={e => setIngredients(prev => prev.map((x,j) => j===i ? {...x, unit: e.target.value} : x))} placeholder="Unit" style={{ ...inputStyle, maxWidth: 95 }} />
                <input value={ing.name} onChange={e => setIngredients(prev => prev.map((x,j) => j===i ? {...x, name: e.target.value} : x))} placeholder="Ingredient name" style={{ ...inputStyle, flex: 1 }} />
                <IconBtn onClick={() => setIngredients(prev => prev.length > 1 ? prev.filter((_,j)=>j!==i) : prev)}>✕</IconBtn>
              </div>
            ))}
          </div>
          <GhostBtn onClick={() => setIngredients(prev => [...prev, EMPTY_INGREDIENT()])}>＋ Add ingredient</GhostBtn>
        </FormGroup>

        {/* STEPS */}
        <FormGroup label="📋 Step-by-Step Instructions">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
            {steps.map((step, i) => (
              <div key={step.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, background: "#E07A3A", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Caveat', cursive", fontSize: "1rem", fontWeight: 700, flexShrink: 0, marginTop: 8 }}>{i + 1}</div>
                <textarea value={step.text} onChange={e => setSteps(prev => prev.map((x,j) => j===i ? {...x, text: e.target.value} : x))} placeholder="Describe this step..." style={{ ...inputStyle, flex: 1, minHeight: 60, resize: "vertical" }} />
                <IconBtn onClick={() => setSteps(prev => prev.length > 1 ? prev.filter((_,j)=>j!==i) : prev)} style={{ marginTop: 8 }}>✕</IconBtn>
              </div>
            ))}
          </div>
          <GhostBtn onClick={() => setSteps(prev => [...prev, EMPTY_STEP()])}>＋ Add step</GhostBtn>
        </FormGroup>

        {/* IMAGES — now uploads to imgbb */}
        <FormGroup label="📸 Photos">
          <div onClick={() => !uploadingCount && fileRef.current.click()} style={{
            border: "2px dashed #F5C59C", borderRadius: 14, padding: 28, textAlign: "center",
            background: uploadingCount ? "#FEF6E4" : "#FDE8D5",
            cursor: uploadingCount ? "not-allowed" : "pointer", transition: "all 0.2s",
            opacity: uploadingCount ? 0.7 : 1,
          }}
            onMouseEnter={e => { if (!uploadingCount) { e.currentTarget.style.borderColor="#E07A3A"; e.currentTarget.style.background="#FDD8B5"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#F5C59C"; e.currentTarget.style.background=uploadingCount?"#FEF6E4":"#FDE8D5"; }}
          >
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} disabled={uploadingCount > 0} />
            {uploadingCount > 0 ? (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: 8, animation: "spin 1s linear infinite" }}>⏳</div>
                <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#5C4A2A" }}>
                  Uploading {uploadingCount} photo{uploadingCount > 1 ? "s" : ""}…
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📷</div>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#5C4A2A" }}>Click to add photos</p>
                <span style={{ fontSize: "0.82rem", color: "#B8936A" }}>JPG, PNG, WEBP supported · hosted via imgbb</span>
              </>
            )}
          </div>

          {uploadError && (
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: "0.95rem", color: "#C0392B", marginTop: 8, padding: "8px 12px", background: "#FDECEA", borderRadius: 8 }}>
              {uploadError}
            </p>
          )}

          {images.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
              {images.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt="preview" style={{ width: 90, height: 90, borderRadius: 10, objectFit: "cover", border: "2px solid #E8D9C4" }} />
                  <button onClick={() => setImages(prev => prev.filter((_,j)=>j!==i))} style={{ position: "absolute", top: -6, right: -6, background: "#E07A3A", color: "white", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </FormGroup>

        <FormGroup label="📝 Notes & Tips">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special tips, substitutions or secrets..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
        </FormGroup>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid #E8D9C4", marginTop: 8 }}>
          <button onClick={onClose} style={{ background: "#FEF6E4", border: "1.5px solid #E8D9C4", borderRadius: 12, padding: "10px 24px", fontFamily: "'Caveat', cursive", fontSize: "1.1rem", color: "#5C4A2A", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={uploadingCount > 0} style={{ background: uploadingCount ? "#C4A97A" : "#E07A3A", border: "none", borderRadius: 12, padding: "10px 28px", fontFamily: "'Caveat', cursive", fontSize: "1.1rem", fontWeight: 700, color: "white", cursor: uploadingCount ? "not-allowed" : "pointer", boxShadow: uploadingCount ? "none" : "0 4px 14px rgba(224,122,58,0.3)" }}>
            {uploadingCount > 0 ? "⏳ Uploading..." : "💾 Save Recipe"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── SHARED UI ──
function ModalShell({ children, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(40,28,10,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(3px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFF8EE", borderRadius: 20, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(40,28,10,0.25)", border: "1px solid #E8D9C4" }}>
        {children}
      </div>
    </div>
  );
}

function CloseBtn({ onClose }) {
  return (
    <button onClick={onClose} style={{ background: "#FEF6E4", border: "1.5px solid #E8D9C4", borderRadius: "50%", width: 36, height: 36, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#5C4A2A", flexShrink: 0 }}>✕</button>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.4rem", fontWeight: 700, color: "#E07A3A", margin: "22px 0 12px", display: "flex", alignItems: "center", gap: 8 }}>{children}</div>;
}

function MetaPill({ children }) {
  return <span style={{ background: "#FDE8D5", borderRadius: 20, padding: "5px 16px", fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "#E07A3A", fontWeight: 600 }}>{children}</span>;
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontFamily: "'Caveat', cursive", fontSize: "1.15rem", fontWeight: 600, color: "#5C4A2A", marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E8D9C4", borderRadius: 10,
  background: "white", fontFamily: "'Caveat', cursive", fontSize: "1.05rem", color: "#2C2416",
  outline: "none", boxSizing: "border-box",
};

function Input({ value, onChange, placeholder, type = "text", min }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} min={min}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? "#E07A3A" : "#E8D9C4", boxShadow: focused ? "0 0 0 3px #FDE8D5" : "none" }}
    />
  );
}

function IconBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: "#FEF6E4", border: "1.5px solid #E8D9C4", borderRadius: 8, width: 32, height: 32, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C08060", flexShrink: 0, ...style }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "1.5px dashed #F5C59C", borderRadius: 10, padding: "8px 14px", fontFamily: "'Caveat', cursive", fontSize: "1rem", color: "#E07A3A", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
      {children}
    </button>
  );
}

// ── APP ──
export default function App() {
  const [recipes, setRecipes] = useLocalStorage("tasteTestRecipes", SEED_RECIPES);
  const [filter, setFilter] = useState("Breakfast");
  const [search] = useState("");
  const [viewRecipe, setViewRecipe] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [isOwner, setIsOwner] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  const filtered = recipes.filter(r => {
    const matchFilter = filter === "All" || r.category === filter;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.desc || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleSave = (recipe) => {
    setRecipes(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      if (exists) {
        showToast("✅ Recipe updated!");
        return prev.map(r => r.id === recipe.id ? recipe : r);
      } else {
        showToast("🎉 Recipe saved!");
        return [recipe, ...prev];
      }
    });
    setShowForm(false);
    setEditRecipe(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    setRecipes(prev => prev.filter(r => r.id !== id));
    showToast("🗑 Recipe deleted.");
  };

  const handleEdit = (recipe) => {
    setEditRecipe(recipe);
    setShowForm(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Nunito:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #FFFDF7; font-family: 'Nunito', sans-serif; color: #2C2416; min-height: 100vh; }
        body::before { content: ''; position: fixed; inset: 0; background-image: repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(200,180,140,0.08) 31px, rgba(200,180,140,0.08) 32px); pointer-events: none; z-index: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #E8D9C4; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #C4A97A; }
        select { appearance: none; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#FFF8EE", borderBottom: "2px solid #E8D9C4", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(80,50,10,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, background: "#E07A3A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍳</div>
          <div>
            <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", fontWeight: 700, color: "#2C2416", letterSpacing: "0.5px" }}>Taste Test</h1>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "0.95rem", color: "#5C4A2A", display: "block", marginTop: -4 }}>a recipe repository</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isOwner && (
            <button onClick={() => { setEditRecipe(null); setShowForm(true); }} style={{ background: "#E07A3A", color: "white", border: "none", borderRadius: 24, padding: "10px 22px", fontFamily: "'Caveat', cursive", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 3px 10px rgba(224,122,58,0.25)" }}>
              <span>＋</span> Add Recipe
            </button>
          )}
          <button
            onClick={() => isOwner ? (setIsOwner(false), showToast("🔒 Editing locked")) : setShowPin(true)}
            title={isOwner ? "Lock editing" : "Owner login"}
            style={{ background: isOwner ? "#E8F5E9" : "#FEF6E4", border: `1.5px solid ${isOwner ? "#5A8A5E" : "#E8D9C4"}`, borderRadius: "50%", width: 42, height: 42, fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {isOwner ? "🔓" : "🔒"}
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div style={{ padding: "16px 32px", display: "flex", gap: 10, overflowX: "auto", background: "#FFF8EE", borderBottom: "1px solid #E8D9C4" }}>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{
            background: filter === f.value ? "#E07A3A" : "#FEF6E4",
            border: `1.5px solid ${filter === f.value ? "#E07A3A" : "#E8D9C4"}`,
            borderRadius: 20, padding: "6px 18px", fontFamily: "'Caveat', cursive",
            fontSize: "1rem", color: filter === f.value ? "white" : "#5C4A2A",
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* MAIN */}
      <main style={{ padding: 32, maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.7rem", color: "#5C4A2A", marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
          ✨ My Recipes
          <div style={{ flex: 1, height: 1.5, background: "#E8D9C4", borderRadius: 2 }} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "5rem", marginBottom: 20 }}>🍽️</div>
            <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", color: "#5C4A2A", marginBottom: 10 }}>
              {recipes.length === 0 ? "Your recipe book is empty!" : "No recipes found"}
            </h2>
            <p style={{ color: "#9A7D50", fontSize: "0.9rem" }}>
              {recipes.length === 0 ? 'Hit "+ Add Recipe" to start your collection.' : "Try a different search or filter."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 26 }}>
            {filtered.map(r => (
              <RecipeCard key={r.id} recipe={r} onView={setViewRecipe} onEdit={handleEdit} onDelete={handleDelete} isOwner={isOwner} />
            ))}
          </div>
        )}
      </main>

      {/* MODALS */}
      {viewRecipe && (
        <ViewModal recipe={viewRecipe} onClose={() => setViewRecipe(null)} onEdit={r => { setViewRecipe(null); handleEdit(r); }} onDelete={id => { setViewRecipe(null); handleDelete(id); }} onLightbox={setLightboxSrc} isOwner={isOwner} />
      )}
      {showForm && (
        <RecipeFormModal initial={editRecipe} onClose={() => { setShowForm(false); setEditRecipe(null); }} onSave={handleSave} />
      )}
      {showPin && (
        <PinModal onSuccess={() => { setIsOwner(true); showToast("🔓 Editing unlocked!"); }} onClose={() => setShowPin(false)} />
      )}

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <Toast message={toast.msg} visible={toast.visible} />
    </>
  );
}
