import { useState } from "react";

export const COMPONENT_TEMPLATES = [
  {
    __component: "roku.horizontal-list",
    _template: true,
    name: "",
    enable_title: true,
    cells_per_view: 4,

    cells_focusable: true,
    title_source_key: "",
    title_use_custom_text: false,
    title_color: "#ffffff",
    title_focused_color: "",
    title_font_family: "MediumSystemFont",
    title_translation_bottom: 0,
    title_translation_left: 0,

    cell_gap: 0,
    peek_offset: 0,
    show_row_counter: false,
    lazy_load_item_count: 1,
    item_reload_offset: 1,
    item_limit: "",

    enable_auto_scroll: false,
    auto_scroll_interval: 0,

    focus_animation_style: "fixedFocus",
    focus_bitmap_url: "",
    focus_bitmap_color: "",

    enable_pagination_dots: false,
    pagination_dots_dot_size: 0,
    pagination_dots_gap: 0,
    pagination_dots_translation_top: 0,
    pagination_dots_translation_left: 0,
    pagination_dots_selected_color: "",
    pagination_dots_unselected_color: "",

    focus_height: 0,
    list_translation_left: 0,
    list_translation_top: 0,
    list_translation_bottom: 0,
    row_gap: 0,
    feed: null,
    card_style: null,
    feed_context: null,
},
  {
    __component: "roku.grid",
    _template: true,
    name: "",
    enable_title: false,
    row_count: 4,
    column_count: 4,
    row_gap: 0,
    column_gap: 0,
    translation_left: 0,
    translation_right: 0,
    translation_top: 0,
    translation_bottom: 0,
    row_reload_offset: 1,
    lazy_load_row_count: 1,
    cells_focusable: true,
    title_source_key: "",
    title_use_custom_text: false,
    title_custom_text: "",
    title_color: "",
    title_focused_color: "",
    title_height: 0,
    title_font_family: "mediumsystemfont",
    title_translation_bottom: 0,
    title_translation_left: 0,
    item_limit: 20,
    focus_bitmap_url: "",
    focus_bitmap_color: "",
    focus_animation_style: "fixedFocus",
    feed: null,
    card_style: null,
    feed_context: null,
  },
  {
    __component: "roku.curation",
    _template: true,
    name: "",
    feed: null,
    feed_context: null,
  },
  {
    __component: "roku.roku-player",
    _template: true,
    video_source_key: "",
    feed: null,
    feed_context: null,
    player_height: 0,
    enable_ads: null,
    enable_trickplay: null,
    trickplay_text_color: "",
    trickplay_background_overlay: "",
    trickplaybar_current_time_marker_color: "",
    trickplaybar_thumb_color: "",
    trickplaybar_filled_bar_image_url: "",
    trickplaybar_track_color: "",
    trickplaybar_track_image_url: "",
    trickplaybar_filled_bar_color: "",
    enable_captions: null,
    captions_text_style: "default",
    captions_text_effect: "default",
    captions_text_size: "default",
    captions_text_color: "default",
    captions_text_opacity: "default",
    captions_background_color: "default",
    captions_background_opacity: "default",
    captions_window_color: "default",
    captions_window_opacity: "default",
    bif_frame_bg_color: "",
    bif_frame_bg_image_uri: "",
  },
  {
  __component: "roku.login",
  _template: true,
  name: "",
  login_template: "login_template_1",

  login_template_1: {
    login_url: "",
    register_url: "",
    reset_url: "",
    refresh_url: "",

    enable_logo: false,

    login_title_text: "Login",
    login_email_placeholder: "Email",
    login_password_placeholder: "Password",

    register_title_text: "Sign Up",
    register_email_placeholder: "Email",
    register_first_name_placeholder: "First Name",
    register_last_name_placeholder: "Last Name",
    register_password_placeholder: "Password",

    forgot_password_title_text: "Forgot Password",
    forgot_password_email_placeholder: "Email",

    login_button_text: "Login",
    register_button_text: "Sign Up",
    forgot_password_button_text: "Forgot Password",

    logo_url: "",
    logo_width: 300,
    logo_height: 150,
    logo_translation_left: 200,
    logo_translation_top: 150,

    input_box_style: null,
    buttons_style: null,

    login_input_boxes_spacing: 0,
    login_buttons_spacing: 0,

    register_input_boxes_spacing: 0,
    register_buttons_spacing: 0,

    forgot_password_buttons_spacing: 0,
    forgot_password_input_boxes_spacing: 0,

    title_font: "MediumSystemFont",
    title_color: "",

    sub_title_font: "MediumSystemFont",
    sub_title_color: "",

    sub_title_y_offset: 0,

    optional_title_1_y_offset: 0,
    optional_title_1_font: "MediumSystemFont",
    optional_title_1_color: "",

    optional_title_2_font: "MediumSystemFont",
    optional_title_2_color: "",
    optional_title_2_y_offset: 0,

    login_sub_title_text: "",
    login_optional_title_1_text: "",
    login_optional_title_2_text: "",

    register_sub_title_text: "",
    register_optional_title_1_text: "",
    register_optional_title_2_text: "",

    forgot_password_sub_title_text: "",
    forgot_password_optional_title_1_text: "",
    forgot_password_optional_title_2_text: "",

    login_error_text: "",
    register_error_text: "",
    forgot_password_error_text: "",

    error_label_translation_left: 0,
    error_label_translation_top: 0,
    error_label_width: 0,
    error_label_font: "MediumSystemFont",
    error_label_color: "",
  },
}
];

export const COMPONENT_META = {
  "roku.horizontal-list": { label: "Horizontal List", icon: "⇔", color: "#10b981" },
  "page.horizontal-list": { label: "Horizontal List", icon: "⇔", color: "#10b981" },
  "roku.grid": { label: "Grid", icon: "⊞", color: "#8b5cf6" },
  "page.grid": { label: "Grid", icon: "⊞", color: "#8b5cf6" },
  "roku.curation": { label: "Curation", icon: "◎", color: "#06b6d4" },
  "roku.roku-player": { label: "Roku Player", icon: "▶", color: "#ef4444" },
  "roku.login": { label: "Login", icon: "🔐", color: "#f97316" },
};

export const COLLECTIONS = [
  { id: "roku-screens", label: "Roku - Screens", icon: "☰", color: "#6366f1" },
  { id: "feed", label: "Feed", icon: "◫", color: "#10b981" },
  { id: "roku-card-styles", label: "Roku Card Styles", icon: "▣", color: "#f59e0b" }
];
let _ctr = 0;


const shell = {
  width: "100%", background: "#13131f", borderRight: "1px solid #1e1e32",
  display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", flexShrink: 0,
};
const hdr = {
  padding: "12px 12px 10px", borderBottom: "1px solid #1e1e32",
  display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
};

const addBtn = {
  width: "100%",
  border: "1px dashed #2b2b45",
  background: "#181827",
  color: "#c7d2fe",
  borderRadius: 8,
  padding: "9px 10px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const deleteBtn = {
  width: 22,
  height: 22,
  border: "none",
  borderRadius: 6,
  background: "transparent",
  color: "#64748b",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "9px 12px",
  justifyContent: "center",
  flexShrink: 0,
  transition: "all 0.2s ease",
  borderLeft: "2px solid transparent",
  opacity: 1,
};



function SecLabel({ label, color = "#6366f1" }) {
  return (
    <div style={{ padding: "10px 12px 4px", fontSize: 10, fontWeight: 800, color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {label}
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(99,102,241,0.13)", border: "none", color: "#6366f1",
      borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 16,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0,
    }}>‹</button>
  );
}


function CollectionsView({ onSelect }) {
  return (
    <div style={shell}>
      <div style={{ overflowY: "auto", flex: 1 }}>
        <SecLabel label="Collections" />
        {COLLECTIONS.map((c) => (
          <div
            key={c.id} onClick={() => onSelect(c)}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", cursor: "pointer", borderLeft: "2px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${c.color}14`; e.currentTarget.style.borderLeft = `2px solid ${c.color}`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeft = "2px solid transparent"; }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: `${c.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: c.color }}>
              {c.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#dde1ec", fontSize: 15, fontWeight: 600 }}>{c.label}</div>
            </div>
            <span style={{ color: "#3a3a55", fontSize: 15 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function ItemsView({ collection, items, onSelectItem, onBack, onAddItem, onDeleteItem}) {
  
  return (
    <div style={shell}>
      <div style={hdr}>
        <BackBtn onClick={onBack} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>{collection.label}</div>
          <div style={{ color: "#3e3e58", fontSize: 12 }}>Select an item</div>
        </div>
      </div>
  
 <div style={{ overflowY: "auto", flex: 1 }}>
        <SecLabel label={collection.label} color={collection.color} />
        {["roku-card-styles", "roku-screens", "feed"].includes(collection?.id) && (
        <div style={{ padding: "8px 12px 4px" }}>
          <button
            onClick={onAddItem}
            style={addBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#202036";
              e.currentTarget.style.border = `1px dashed ${collection.color}`;
              e.currentTarget.style.color = "#eef2ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#181827";
              e.currentTarget.style.border = "1px dashed #2b2b45";
              e.currentTarget.style.color = "#c7d2fe";
            }}
          >
            + Add {collection.id === "feed" ? "Feed" : collection.id === "roku-card-styles" ? "Card Style" : "Screen"}
          </button>
        </div>
)}
        {items.length === 0 && (
          <div style={{ padding: "10px 12px", color: "#3a3a55", fontSize: 11, fontStyle: "italic" }}>No items found</div>
        )}
        {items.map((item) => {
          const title = item.title || item.name || "Untitled";
          const blocks = item.page_blocks || [];
          return (
            <div
              key={item.id} onClick={() => onSelectItem(item)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", cursor: "pointer", borderLeft: "2px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${collection.color}14`; e.currentTarget.style.borderLeft = `2px solid ${collection.color}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeft = "2px solid transparent"; }}
            
            >
            
              <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: `${collection.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: collection.color }}>
                {collection.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#dde1ec", fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
                <div style={{ color: "#3e3e58", fontSize: 10 }}>{blocks.length} block{blocks.length !== 1 ? "s" : ""}</div>
              </div>
              <span style={{ color: "#3a3a55", fontSize: 13 }}>›</span>
              <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this ?")) {
                  onDeleteItem?.(item);
                }
              }}
              style={deleteBtn}
              title="Delete screen"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                e.currentTarget.style.color = "#f87171";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748b";
              }}
            >✕
            </button>
            </div>
          
          );
        })}
      </div>
    </div>
  );
}


function ComponentsView({ item, collection, onBack }) {
  const [search, setSearch] = useState("");
  const title = item.title || item.name || "Untitled";

  const filtered = COMPONENT_TEMPLATES.filter((t) =>
    COMPONENT_META[t.__component]?.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleDrag = (e, tpl) => {
    const tagged = { ...tpl, _clientId: `new_${++_ctr}_${Date.now()}` };
    e.dataTransfer.setData("block", JSON.stringify(tagged));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div style={shell}>
      <div style={hdr}>
        <BackBtn onClick={onBack} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          <div style={{ color: "#3e3e58", fontSize: 12 }}>{collection.label} · Components</div>
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        <div style={{ padding: "8px 12px 4px" }}>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter components…"
            style={{ width: "100%", boxSizing: "border-box", background: "#0d0d1c", border: "1px solid #1e1e32", borderRadius: 6, padding: "5px 8px", color: "#c4c4d4", fontSize: 12, outline: "none" }}
          />
        </div>
        <SecLabel label="Add Component" color="#10b981" />
        {filtered.map((tpl) => {
          const meta = COMPONENT_META[tpl.__component];
          return (
            <div
              key={tpl.__component} draggable onDragStart={(e) => handleDrag(e, tpl)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", cursor: "grab", borderLeft: "2px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${meta.color}12`; e.currentTarget.style.borderLeft = `2px solid ${meta.color}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderLeft = "2px solid transparent"; }}
              title="Drag to canvas"
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: `${meta.color}1a`, border: `1px solid ${meta.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: meta.color }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#c4c4d4", fontSize: 13, fontWeight: 500 }}>{meta.label}</div>
                <div style={{ color: "#3e3e58", fontSize: 11}}>drag to add</div>
              </div>
              <span style={{ color: "#2a2a40", fontSize: 12 }}>⠿</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default function LeftPanel({ view, collection, items, selectedItem, onSelectCollection, onSelectItem, onBackToCollections, onBackToItems, onAddItem, onDeleteItem}) {
  if (view === "components" && selectedItem) {
    return <ComponentsView item={selectedItem} collection={collection} onBack={onBackToItems} />;
  }
  if (view === "items" && collection) {
    return <ItemsView collection={collection} items={items} onSelectItem={onSelectItem} onBack={onBackToCollections} onAddItem={onAddItem}
      onDeleteItem={onDeleteItem} />;
  }
  return <CollectionsView onSelect={onSelectCollection} />;
}