import { COMPONENT_META } from "./LeftPanel";
import { useState } from "react";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "6px 9px",
  fontSize: 12,
  color: "#1e293b",
  outline: "none",
  fontFamily: "inherit",
  minWidth: 0,
};

const CONTEXT_KEYS = [
  "bundle_identifier",
  "advertising_identifier",
  "uuid",
  "os_version",
  "device_model",
  "device_make",
  "device_name",
  "device_type",
  "user_agent",
  "device_width",
  "device_height",
  "time_zone_offset",
  "platform",
  "sdk_version",
  "version_name",
  "layout_id",
  "is_debug",
  "language_code",
  "language_locale",
  "store",
  "signed_device_info_token",
  "browser",
];

const CONTEXT_TYPES = ["query_param", "header", "authentication"];

const ASPECT_RATIOS = [
  "aspect_1:1",
  "aspect_2:1",
  "aspect_2:3",
  "aspect_3:2",
  "aspect_3:4",
  "aspect_4:3",
  "aspect_5:3",
  "aspect_9:13",
  "aspect_9:16",
  "aspect_16:1",
  "aspect_16:2",
  "aspect_16:3",
  "aspect_16:4",
  "aspect_16:6",
  "aspect_16:7",
  "aspect_16:9",
  "aspect_21:9",
];

const FIELD_GROUPS_BY_COMPONENT = {
  "roku.horizontal-list": {
    General: ["name", "enable_title", "cells_focusable"],
    Title: [
      "title_source_key",
      "title_use_custom_text",
      "title_custom_text",
      "title_color",
      "title_focused_color",
      "title_font_family",
      "title_translation_bottom",
      "title_translation_left",
    ],
    Layout: [
      "cells_per_view",
      "cell_gap",
      "peek_offset",
      "row_gap",
      "list_translation_left",
      "list_translation_top",
      "list_translation_bottom",
    ],
    Rules: [
      "item_limit",
      "lazy_load_item_count",
      "item_reload_offset",
      "show_row_counter",
    ],
    AutoScroll: ["enable_auto_scroll", "auto_scroll_interval"],
    Pagination: [
      "enable_pagination_dots",
      "pagination_dots_dot_size",
      "pagination_dots_gap",
      "pagination_dots_translation_top",
      "pagination_dots_translation_left",
      "pagination_dots_selected_color",
      "pagination_dots_unselected_color",
    ],
    Focus: [
      "focus_animation_style",
      "focus_height",
      "focus_bitmap_url",
      "focus_bitmap_color",
    ],
  },

  "roku.grid": {
    General: ["name", "enable_title", "cells_focusable"],
    Title: [
      "title_source_key",
      "title_use_custom_text",
      "title_custom_text",
      "title_color",
      "title_focused_color",
      "title_height",
      "title_font_family",
      "title_translation_bottom",
      "title_translation_left",
    ],
    Layout: [
      "row_count",
      "column_count",
      "row_gap",
      "column_gap",
      "translation_left",
      "translation_right",
      "translation_top",
      "translation_bottom",
    ],
    Rules: [
      "item_limit",
      "lazy_load_row_count",
      "row_reload_offset",
    ],
    Focus: [
      "focus_animation_style",
      "focus_bitmap_url",
      "focus_bitmap_color",
    ],
  },
};

const BLOCK_DEFAULTS = {
  "roku.horizontal-list": {
    name: "",
    enable_title: true,
    cells_focusable: true,
    cells_per_view: 4,
    cell_gap: 0,
    peek_offset: 0,
    row_gap: 0,
    item_limit: null,
    lazy_load_item_count: 1,
    item_reload_offset: 1,
    show_row_counter: false,
    enable_auto_scroll: false,
    auto_scroll_interval: null,
    enable_pagination_dots: false,
    pagination_dots_dot_size: null,
    pagination_dots_gap: null,
    pagination_dots_translation_top: null,
    pagination_dots_translation_left: null,
    pagination_dots_selected_color: null,
    pagination_dots_unselected_color: null,
    focus_animation_style: "fixedFocus",
    focus_height: null,
    focus_bitmap_url: null,
    focus_bitmap_color: null,
    feed: null,
    card_style: null,
    feed_context: null,
  },

  "roku.grid": {
    name: "",
    enable_title: false,
    cells_focusable: true,
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
    item_limit: null,
    title_source_key: "",
    title_use_custom_text: false,
    title_custom_text: "",
    title_color: "",
    title_focused_color: "",
    title_height: null,
    title_font_family: "MediumSystemFont",
    title_translation_bottom: 0,
    title_translation_left: 0,
    focus_bitmap_url: null,
    focus_bitmap_color: null,
    focus_animation_style: "fixedFocus",
    feed: null,
    card_style: null,
    feed_context: null,
  },
};

const REQUIRED_FIELDS_BY_COMPONENT = {
  "roku.horizontal-list": ["name", "cells_per_view"],
  "page.horizontal-list": ["name", "cells_per_view"],

  "roku.grid": ["name", "row_count", "column_count"],
  "page.grid": ["name", "row_count", "column_count"],

  "roku.curation": ["name"],

  "roku.player": ["video_source_key"],
  "roku.roku-player": ["video_source_key"],

  "roku.login": [
    "name",
    "login_url",
    "register_url",
    "reset_url",
    "refresh_url",
  ],

  // Card style collection fields
  "roku-card-styles": ["name", "card_type"],

  // Feed collection fields
  feed: ["name", "code", "feed_url", "method"],

  // Create relation forms
  layout: ["name", "version"],
  tenant: ["name", "code"],
  "roku-menu": ["name", "code"],
  "feed-context": ["name"],
};

function Field({ label, children, required = false }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 4,
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, options = [], required = false }) {
  return (
    <Field label={label} required= {required}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, cursor: "pointer" }}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function TF({ label, value, onChange, placeholder, error, required = false}) {
  return (
    <Field label={label} required={required}>
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          border: error ? "1px solid #ef4444" : inputStyle.border,
        }}
      />
      {error && (
        <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>
          {error}
        </div>
      )}
    </Field>
  );
}

function NF({ label, value, onChange, min, max, error, required = false }) {
  return (
    <Field label={label} required ={required}>
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        style={{
          ...inputStyle,
          border: error ? "1px solid #ef4444" : inputStyle.border,
        }}
      />
      {error && (
        <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>
          {error}
        </div>
      )}
    </Field>
  );
}

function ColorField({ label, value, onChange, required = false }) {
  const safeValue =
    typeof value === "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
      ? value
      : "#000000";

  return (
    <Field label={label} required={required}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 38,
            height: 32,
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            background: "#fff",
            padding: 2,
          }}
        />

        <input
          type="text"
          value={value ?? ""}
          placeholder="#ffffff"
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      </div>
    </Field>
  );
}

function RelationField({
  label,
  value,
  options = [],
  onSelect,
  onRemove,
  required= false,
  createLabel = "Create relation",
  children,
}) {
  const [creating, setCreating] = useState(false);

  return (
    <Field label={label} required= {required}>
      {/* field1: selected relation from API */}
      <div style={{ marginBottom: 8 }}>
        {value ? (
          <div style={{
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "8px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 12 }}>
              {value.name || value.code || "Selected"}
            </span>

            <button type="button" onClick={onRemove}>
              ×
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            No selected {label}
          </div>
        )}
      </div>

      {/* field2: add existing relation dropdown */}
      <select
        value=""
        onChange={(e) => {
          const selected = options.find(
            (o) => String(o.documentId || o.id) === e.target.value
          );
          if (selected) onSelect(selected);
        }}
        style={{ ...inputStyle, cursor: "pointer" }}
      >
        <option value="">Add a relation</option>
        {options.map((o) => (
          <option key={o.documentId || o.id} value={o.documentId || o.id}>
            {o.name || o.code || o.documentId || o.id}
          </option>
        ))}
      </select>

      {/* field3: create relation */}
      <button
        type="button"
        onClick={() => setCreating((v) => !v)}
        style={{ marginTop: 8, width: "100%" }}
      >
        + {createLabel}
      </button>

      {creating && <div style={{ marginTop: 10 }}>{children}</div>}
    </Field>
  );
}

function Toggle({ label, checked, onChange, error, required= false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: error ? "1px solid #fecaca" : "1px solid #f1f5f9",
        background: error ? "#fef2f2" : "transparent",
        padding: "7px 6px",
        borderRadius: 6,
      }}
    >
      <span style={{ fontSize: 12, color: "#374151" }}>{label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 34,
          height: 18,
          borderRadius: 9,
          cursor: "pointer",
          flexShrink: 0,
          background: checked ? "#6366f1" : "#d1d5db",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        {error && (
  <div style={{ color:"#ef4444", fontSize:11 }}>
    {error}
  </div>
)}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </div>
    </div>
  );
}

function SecLabel({ label, color = "#6366f1" }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        margin: "14px 0 8px",
      }}
    >
      {label}
    </div>
  );
}

function SectionDropdown({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 800,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <span>{title}</span>
        <span>{open ? "⌃" : "⌄"}</span>
      </div>

      {open && <div style={{ paddingBottom: 10 }}>{children}</div>}
    </div>
  );
}

function DynamicField({ field, value, set, error, required= false }) {
  if (
  field === "__component" ||
  field === "id" ||
  field === "_clientId" ||
  field === "_template" ||
  field === "feed" ||
  field === "card_style" ||
  field === "feed_context" ||
  field === "input_box_style" ||
  field === "buttons_style"
) {
  return null;
}

  if (field.toLowerCase().includes("color")) {
    return (
      <ColorField
        label={field}
        value={value}
        required= {required}
        onChange={(v) => set(field, v)}
      />
    );
  }

  // BOOLEAN
  if (typeof value === "boolean") {
    return (
      <Toggle
        label={field}
        checked={!!value}
        required= {required}
        onChange={(v) => set(field, v)}
      />
    );
  }

  // DROPDOWN 1
  if (field === "title_font_family") {
    return (
      <Field label={field} required= {required}>
        <select
          value={value || "MediumSystemFont"}
          onChange={(e) => set(field, e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="SmallSystemFont">SmallSystemFont</option>
          <option value="MediumSystemFont">MediumSystemFont</option>
          <option value="MediumBoldSystemFont">MediumBoldSystemFont</option>
          <option value="LargeSystemFont">LargeSystemFont</option>
          <option value="LargeBoldSystemFont">LargeBoldSystemFont</option>
          <option value="ExtraLargeSystemFont">ExtraLargeSystemFont</option>
          <option value="ExtraLargeBoldSystemFont">ExtraLargeBoldSystemFont</option>
          <option value="BadgeSystemFont">BadgeSystemFont</option>
        </select>
      </Field>
    );
  }

  // DROPDOWN 2
  if (field === "focus_animation_style") {
    return (
      <Field label={field} required= {required}>
        <select
          value={value || "fixedFocus"}
          onChange={(e) => set(field, e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="fixedFocus">fixedFocus</option>
          <option value="floatingFocus">floatingFocus</option>
          <option value="fixedFocusWrap">fixedFocusWrap</option>
        </select>
      </Field>
    );
  }

  // NUMBER
  if (typeof value === "number") {
    return (
      <NF
        label={field}
        value={value}
        required= {required}
        onChange={(v) => set(field, v)}
        error={error}
      />
    );
  }

  // STRING
  return (
    <TF
      label={field}
      value={value ?? ""}
      required= {required}
      onChange={(v) => set(field, v)}
      error={error}
    />
  );
}

const panelStyle = {
  width: "100%",
  background: "#fff",
  borderLeft: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "hidden",
  flexShrink: 0,
  minWidth: 0
};

function FeedContextCreateForm({
  draft,
  setDraft,
  tenants,
  createTenant,
  createFeedContext,
  setTenants,
  setFeedContexts,
  onCreated,
}) {
  const [tenantDraft, setTenantDraft] = useState({});

  const rows = draft.feed_context || [];

  const updateRow = (index, key, value) => {
    setDraft((prev) => {
      const nextRows = [...(prev.feed_context || [])];
      nextRows[index] = {
        ...nextRows[index],
        [key]: value,
      };

      return {
        ...prev,
        feed_context: nextRows,
      };
    });
  };

  const addRow = () => {
    setDraft((prev) => ({
      ...prev,
      feed_context: [
        ...(prev.feed_context || []),
        {
          context_key: "bundle_identifier",
          context_type: "query_param",
          rename_key: "",
        },
      ],
    }));
  };

  const removeRow = (index) => {
    setDraft((prev) => ({
      ...prev,
      feed_context: (prev.feed_context || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <TF
        label="Name"
        value={draft.name || ""}
        onChange={(v) => setDraft((p) => ({ ...p, name: v }))}
      />

      <RelationField
        label="Tenant"
        value={draft.tenant}
        options={tenants}
        onSelect={(v) => setDraft((p) => ({ ...p, tenant: v }))}
        onRemove={() => setDraft((p) => ({ ...p, tenant: null }))}
        createLabel="Create tenant"
      >
        <TF
          label="Name"
          value={tenantDraft.name || ""}
          onChange={(v) => setTenantDraft((p) => ({ ...p, name: v }))}
        />

        <TF
          label="Code"
          value={tenantDraft.code || ""}
          onChange={(v) => setTenantDraft((p) => ({ ...p, code: v }))}
        />

        <button
          type="button"
          onClick={async () => {
            if (!tenantDraft.name?.trim() || !tenantDraft.code?.trim()) {
              alert("Tenant name and code are required");
              return;
            }

            const res = await createTenant(tenantDraft);
            const created = res.data?.data;

            setTenants((prev) => [...prev, created]);
            setDraft((p) => ({ ...p, tenant: created }));
          }}
        >
          Create Tenant
        </button>
      </RelationField>

      <SecLabel label="Feed Context Rows" />

      {rows.map((row, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <SelectField
            label="context_key"
            value={row.context_key}
            options={CONTEXT_KEYS}
            onChange={(v) => updateRow(index, "context_key", v)}
          />

          <SelectField
            label="context_type"
            value={row.context_type}
            options={CONTEXT_TYPES}
            onChange={(v) => updateRow(index, "context_type", v)}
          />

          <TF
            label="rename_key"
            value={row.rename_key || ""}
            onChange={(v) => updateRow(index, "rename_key", v)}
          />

          <button type="button" onClick={() => removeRow(index)}>
            Remove Row
          </button>
        </div>
      ))}

      <button type="button" onClick={addRow}>
        + Add Context Row
      </button>

      <button
        type="button"
        style={{ marginTop: 8, width: "100%" }}
        onClick={async () => {
          if (!draft.name?.trim()) {
            alert("Feed context name is required");
            return;
          }

          const payload = {
            name: draft.name.trim(),
            tenant: draft.tenant?.documentId || draft.tenant?.id || null,
            feed_context: (draft.feed_context || []).map((row) => ({
              context_key: row.context_key,
              context_type: row.context_type,
              rename_key: row.rename_key || null,
            })),
          };

          const res = await createFeedContext(payload);
          const created = res.data?.data;

          setFeedContexts((prev) => [...prev, created]);
          onCreated(created);
        }}
      >
        Create Feed Context
      </button>
    </>
  );
}

function ItemSection({
  collection,
  localItem,
  setLocalItem,

  layouts,
  tenants,
  rokuMenus,
  feedContexts,

  setLayouts,
  setTenants,
  setRokuMenus,
  setFeedContexts,

  createLayout,
  createTenant,
  createRokuMenu,
  createFeedContext,
}) {
  const isFeed = collection?.id === "feed";
  const isCardStyle = collection?.id === "roku-card-styles";
  const badgeLabel = isFeed ? "Feed" : isCardStyle ? "Card Style" : "Screen";
  const [tenantDraft, setTenantDraft] = useState({});
  const [feedContextDraft, setFeedContextDraft]= useState({});
  const badgeColor = collection?.color || "#6366f1";
  const [layoutDraft, setLayoutDraft] = useState({});
  const [menuDraft, setMenuDraft] = useState({});

  const set = (key, value) => {
    setLocalItem((p) => ({ ...p, [key]: value }));
  };

  
  return (
    <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span
            style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#fff",
                background: badgeColor,
                padding: "2px 10px",
                borderRadius: 10,
            }}
            >
            {badgeLabel}
            </span>

            <span
            style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0f172a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
            }}
            >
            {localItem.name || localItem.title || "Untitled"}
            </span>
        </div>

      <SectionDropdown title={`${badgeLabel} Properties`} defaultOpen>
        <TF
          label="Name"
          value={localItem.name ?? localItem.title ?? ""}
          onChange={(v) =>
            setLocalItem((p) => ({ ...p, name: v, title: v }))
          }
          
        />

        {!isFeed && !isCardStyle &&(
        <>
            <Toggle
                label="Is Home"
                checked={!!localItem.is_home}
                onChange={(v) => set("is_home", v)}
                
            />

            <Toggle
                label="Show Menu"
                checked={!!localItem.show_menu}
                onChange={(v) => set("show_menu", v)}
              
            />

            <RelationField
                label="Layout"
                value={localItem.layout}
                options={layouts}
                onSelect={(v) => set("layout", v)}
                onRemove={() => set("layout", null)}
                createLabel="Create layout"
                >
                <TF
                    label="Name"
                    value={layoutDraft.name || ""}
                    onChange={(v) => setLayoutDraft((p) => ({ ...p, name: v }))}
                />

                <TF
                    label="Version"
                    value={layoutDraft.version || ""}
                    onChange={(v) => setLayoutDraft((p) => ({ ...p, version: v }))}
                />

                <RelationField
                    label="Tenant"
                    value={layoutDraft.tenant}
                    options={tenants}
                    onSelect={(v) => setLayoutDraft((p) => ({ ...p, tenant: v }))}
                    onRemove={() => setLayoutDraft((p) => ({ ...p, tenant: null }))}
                    createLabel="Create tenant"
                >
                    <TF
                        label="Name"
                        value={tenantDraft.name || ""}
                        onChange={(v) => setTenantDraft((p) => ({ ...p, name: v }))}
                    />
                    <TF
                        label="Code"
                        value={tenantDraft.code || ""}
                        onChange={(v) => setTenantDraft((p) => ({ ...p, code: v }))}
                    />
                    <button
                        type="button"
                        onClick={async () => {
                            const res = await createTenant(tenantDraft);
                            const created = res.data?.data;
                            setTenants((prev) => [...prev, created]);
                            setLayoutDraft((p) => ({ ...p, tenant: created }));
                        }}
                        >
                        Create Tenant
                    </button>
                </RelationField>

                <RelationField
                    label="Roku Menu"
                    value={layoutDraft.roku_menu}
                    options={rokuMenus}
                    onSelect={(v) => setLayoutDraft((p) => ({ ...p, roku_menu: v }))}
                    onRemove={() => setLayoutDraft((p) => ({ ...p, roku_menu: null }))}
                    createLabel="Create roku menu"
                >
                    <TF
                        label="Name"
                        value={menuDraft.name || ""}
                        onChange={(v) => setMenuDraft((p) => ({ ...p, name: v }))}
                    />
                    <TF
                        label="Code"
                        value={menuDraft.code || ""}
                        onChange={(v) => setMenuDraft((p) => ({ ...p, code: v }))}
                    />

                    <button
                        type="button"
                        onClick={async () => {
                            const res = await createRokuMenu(menuDraft);
                            const created = res.data?.data;
                            setRokuMenus((prev) => [...prev, created]);
                            setLayoutDraft((p) => ({ ...p, roku_menu: created }));
                        }}
                        >
                        Create Roku Menu
                    </button>
                </RelationField>

                <button
                    type="button"
                    onClick={async () => {
                    if (!layoutDraft.name?.trim() || !layoutDraft.version?.trim()) {
                        alert("Layout name and version are required");
                        return;
                    }

                    const payload = {
                        name: layoutDraft.name,
                        version: layoutDraft.version,
                        tenant: layoutDraft.tenant?.documentId || layoutDraft.tenant?.id || null,
                        roku_menu: layoutDraft.roku_menu?.documentId || layoutDraft.roku_menu?.id || null,
                    };

                    const res = await createLayout(payload);
                    const created = res.data?.data;
                    setLayouts((prev) => [...prev, created]);
                    set("layout", created);
                    }}
                >
                    Create Layout
                </button>
            </RelationField>

            <RelationField
                label="Tenant"
                value={localItem.tenant}
                options={tenants}
                onSelect={(v) => set("tenant", v)}
                onRemove={() => set("tenant", null)}
                createLabel="Create tenant"
            >
                <TF
                    label="Name"
                    value={tenantDraft.name || ""}
                    onChange={(v) => setTenantDraft((p) => ({ ...p, name: v }))}
                />

                <TF
                    label="Code"
                    value={tenantDraft.code || ""}
                    onChange={(v) => setTenantDraft((p) => ({ ...p, code: v }))}
                />

                <button
                    type="button"
                    onClick={async () => {
                    if (!tenantDraft.name?.trim() || !tenantDraft.code?.trim()) {
                        alert("Tenant name and code are required");
                        return;
                    }

                    const res = await createTenant(tenantDraft);
                    const created = res.data?.data;
                    setTenants((prev) => [...prev, created]);
                    set("tenant", created);
                    }}
                >
                Create Tenant
                </button>
            </RelationField>
        </>
        )}
      
        {isCardStyle && (
          <>
          <RelationField
              label="Layout"
              value={localItem.layout}
              options={layouts}
              onSelect={(v) => set("layout", v)}
              onRemove={() => set("layout", null)}
              createLabel="Create layout"
            >
              <TF
                label="Name"
                value={layoutDraft.name || ""}
                onChange={(v) => setLayoutDraft((p) => ({ ...p, name: v }))}
              />

              <TF
                label="Version"
                value={layoutDraft.version || ""}
                onChange={(v) => setLayoutDraft((p) => ({ ...p, version: v }))}
              />

              <button
                type="button"
                onClick={async () => {
                  if (!layoutDraft.name?.trim() || !layoutDraft.version?.trim()) {
                    alert("Layout name and version are required");
                    return;
                  }

                  const payload = {
                    name: layoutDraft.name,
                    version: layoutDraft.version,
                  };

                  const res = await createLayout(payload);
                  const created = res.data?.data;

                  setLayouts((prev) => [...prev, created]);
                  set("layout", created);
                }}
              >
                Create Layout
              </button>
            </RelationField>

            <RelationField
              label="Tenant"
              value={localItem.tenant}
              options={tenants}
              onSelect={(v) => set("tenant", v)}
              onRemove={() => set("tenant", null)}
              createLabel="Create tenant"
            >
              <TF
                label="Name"
                value={tenantDraft.name || ""}
                onChange={(v) => setTenantDraft((p) => ({ ...p, name: v }))}
              />

              <TF
                label="Code"
                value={tenantDraft.code || ""}
                onChange={(v) => setTenantDraft((p) => ({ ...p, code: v }))}
              />

              <button
                type="button"
                onClick={async () => {
                  if (!tenantDraft.name?.trim() || !tenantDraft.code?.trim()) {
                    alert("Tenant name and code are required");
                    return;
                  }

                  const res = await createTenant(tenantDraft);
                  const created = res.data?.data;

                  setTenants((prev) => [...prev, created]);
                  set("tenant", created);
                }}
              >
                Create Tenant
              </button>
            </RelationField>
            <Field label="Card Type">
            <select
                value={localItem.card_type || "card_type_1"}
                onChange={(e) => set("card_type", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
            >
                <option value="card_type_1">card_type_1</option>
                <option value="card_type_2">card_type_2</option>
                <option value="button_type_1">button_type_1</option>
            </select>
            </Field>
            {localItem.card_type === "card_type_1" && (
              <>
                <SecLabel label="Card Type 1" />

                <SelectField
                  label="aspect_ratio"
                  value={localItem.card_type_1?.aspect_ratio || "aspect_16:9"}
                  options={ASPECT_RATIOS}
                  onChange={(v) =>
                    set("card_type_1", {
                      ...(localItem.card_type_1 || {}),
                      aspect_ratio: v,
                    })
                  }
                />

                {["show_background_rectangle", "show_image_1", "show_label_1", "show_label_2"].map((key) => (
                  <Toggle
                    key={key}
                    label={key}
                    checked={!!localItem.card_type_1?.[key]}
                    onChange={(v) =>
                      set("card_type_1", {
                        ...(localItem.card_type_1 || {}),
                        [key]: v,
                      })
                    }
                  />
                ))}
              </>
            )}

            {localItem.card_type === "card_type_2" && (
              <>
                <SecLabel label="Card Type 2" />

                <SelectField
                  label="aspect_ratio"
                  value={localItem.card_type_2?.aspect_ratio || "aspect_16:9"}
                  options={ASPECT_RATIOS}
                  onChange={(v) =>
                    set("card_type_2", {
                      ...(localItem.card_type_2 || {}),
                      aspect_ratio: v,
                    })
                  }
                />

                {[
                  "show_background_rectangle",
                  "show_background_rectangle_on_focus",
                  "show_image_1",
                  "show_image_2",
                  "show_progress_bar",
                  "show_label_1",
                  "show_label_2",
                  "show_label_3",
                  "show_badge",
                  "show_badge_on_focus",
                  "show_preview_player",
                ].map((key) => (
                  <Toggle
                    key={key}
                    label={key}
                    checked={!!localItem.card_type_2?.[key]}
                    onChange={(v) =>
                      set("card_type_2", {
                        ...(localItem.card_type_2 || {}),
                        [key]: v,
                      })
                    }
                  />
                ))}
              </>
            )}

            {localItem.card_type === "button_type_1" && (
              <>
                <SecLabel label="Button Type 1" />

                {["show_icon", "show_label", "show_bar", "show_background"].map((key) => (
                  <Toggle
                    key={key}
                    label={key}
                    checked={!!localItem.button_type_1?.[key]}
                    onChange={(v) =>
                      set("button_type_1", {
                        ...(localItem.button_type_1 || {}),
                        [key]: v,
                      })
                    }
                  />
                ))}

                {localItem.button_type_1?.show_bar && (
                  <>
                    <NF
                      label="bar_height"
                      value={localItem.button_type_1?.bar_height}
                      onChange={(v) =>
                        set("button_type_1", {
                          ...(localItem.button_type_1 || {}),
                          bar_height: v,
                        })
                      }
                    />

                    <ColorField
                      label="bar_color"
                      value={localItem.button_type_1?.bar_color}
                      onChange={(v) =>
                        set("button_type_1", {
                          ...(localItem.button_type_1 || {}),
                          bar_color: v,
                        })
                      }
                    />
                  </>
                )}

                {localItem.button_type_1?.show_background && (
                  <>
                    <NF
                      label="background_rectangle_width"
                      value={localItem.button_type_1?.background_rectangle_width}
                      onChange={(v) =>
                        set("button_type_1", {
                          ...(localItem.button_type_1 || {}),
                          background_rectangle_width: v,
                        })
                      }
                    />

                    <NF
                      label="background_rectangle_height"
                      value={localItem.button_type_1?.background_rectangle_height}
                      onChange={(v) =>
                        set("button_type_1", {
                          ...(localItem.button_type_1 || {}),
                          background_rectangle_height: v,
                        })
                      }
                    />

                    <NF
                      label="background_rectangle_opacity"
                      value={localItem.button_type_1?.background_rectangle_opacity}
                      onChange={(v) =>
                        set("button_type_1", {
                          ...(localItem.button_type_1 || {}),
                          background_rectangle_opacity: v,
                        })
                      }
                    />
                  </>
                )}

                <NF
                  label="item_gap"
                  value={localItem.button_type_1?.item_gap}
                  onChange={(v) =>
                    set("button_type_1", {
                      ...(localItem.button_type_1 || {}),
                      item_gap: v,
                    })
                  }
                />

                <NF
                  label="button_translation_top"
                  value={localItem.button_type_1?.button_translation_top}
                  onChange={(v) =>
                    set("button_type_1", {
                      ...(localItem.button_type_1 || {}),
                      button_translation_top: v,
                    })
                  }
                />

                <NF
                  label="button_translation_left"
                  value={localItem.button_type_1?.button_translation_left}
                  onChange={(v) =>
                    set("button_type_1", {
                      ...(localItem.button_type_1 || {}),
                      button_translation_left: v,
                    })
                  }
                />
              </>
            )}
                      </>
        )}
        {isFeed && (
            <>
                <TF
                    label="Feed URL"
                    value={localItem.feed_url ?? ""}
                    onChange={(v) => set("feed_url", v)}
                    
                />

                <Toggle
                    label="Enable Feed Mapping"
                    checked={!!localItem.enable_feed_mapping}
                    onChange={(v) => {
                set("enable_feed_mapping", v);

                if (!v) {
                    set("feed_mapping", {});
                }
                }}

            />

            <RelationField
              label="Tenant"
              value={localItem.tenant}
              options={tenants}
              onSelect={(v) => set("tenant", v)}
              onRemove={() => set("tenant", null)}
              createLabel="Create tenant"
            >
              <TF
                label="Name"
                value={tenantDraft.name || ""}
                onChange={(v) => setTenantDraft((p) => ({ ...p, name: v }))}
              />

              <TF
                label="Code"
                value={tenantDraft.code || ""}
                onChange={(v) => setTenantDraft((p) => ({ ...p, code: v }))}
              />

              <button
                type="button"
                onClick={async () => {
                  if (!tenantDraft.name?.trim() || !tenantDraft.code?.trim()) {
                    alert("Tenant name and code are required");
                    return;
                  }

                  const res = await createTenant(tenantDraft);
                  const created = res.data?.data;

                  setTenants((prev) => [...prev, created]);
                  set("tenant", created);
                }}
              >
                Create Tenant
              </button>
            </RelationField>

            <RelationField
              label="Feed Context"
              value={localItem.feed_context}
              options={feedContexts}
              onSelect={(v) => set("feed_context", v)}
              onRemove={() => set("feed_context", null)}
              createLabel="Create feed context"
            >
              <FeedContextCreateForm
                draft={feedContextDraft}
                setDraft={setFeedContextDraft}
                tenants={tenants}
                createTenant={createTenant}
                createFeedContext={createFeedContext}
                setTenants={setTenants}
                setFeedContexts={setFeedContexts}
                onCreated={(created) => set("feed_context", created)}
              />
            </RelationField>

            <Field label="Method">
                <select
                value={localItem.method || "get"}
                onChange={(e) => set("method", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                >
                <option value="get">get</option>
                <option value="post">post</option>
                </select>
                {}
            </Field>
            {localItem.enable_feed_mapping && (
            <TF
                label="Feed Mapping JSON"
                value={JSON.stringify(localItem.feed_mapping || {}, null, 2)}
                onChange={(v) => {
                try {
                    set("feed_mapping", JSON.parse(v || "{}"));
                } catch {
                    set("feed_mapping", v);
                }
                }}
            />    
        )}
    </>
    )}     
    </SectionDropdown>
    </div>
  );
}





function DynamicBlockFields({ local, set, errors = {} }) {
  const usedFields = new Set();

  const hiddenFields = [
    "__component",
    "id",
    "_clientId",
    "_template",
    "feed",
    "card_style",
    "feed_context",
    "input_box_style",
    "buttons_style",
    "login_template_1",
  ];

  const requiredFields = new Set(
    REQUIRED_FIELDS_BY_COMPONENT[local.__component] || []
  );
  return (
    <>
      {Object.entries(FIELD_GROUPS_BY_COMPONENT[local.__component] || {}).map(([groupName, fields], index) => {
        const existingFields = fields.filter((field) =>
          Object.prototype.hasOwnProperty.call(local, field)
        );

        existingFields.forEach((field) => usedFields.add(field));

        return (
          <SectionDropdown
            key={groupName}
            title={groupName}
            defaultOpen={index === 0}
          >
            {existingFields.length === 0 ? (
              <div style={{ fontSize: 12, color: "#94a3b8", padding: "6px 0" }}>
                No fields
              </div>
            ) : (
              existingFields.map((field) => (
                <DynamicField
                  key={field}
                  field={field}
                  value={local[field]}
                  set={set}
                  error={errors[field]}
                  required={requiredFields.has(field)}
                />
              ))
            )}
          </SectionDropdown>
        );
      })}

      <SectionDropdown title="Other Fields">
        {Object.keys(local)
          .filter((field) => !usedFields.has(field))
          .filter((field) => !hiddenFields.includes(field))
          .map((field) => (
            <DynamicField
              key={field}
              field={field}
              value={local[field]}
              set={set}
              required={requiredFields.has(field)}
            />
          ))}

        {Object.keys(local).filter(
          (field) => !usedFields.has(field) && !hiddenFields.includes(field)
        ).length === 0 && (
          <div style={{ fontSize: 12, color: "#94a3b8", padding: "6px 0" }}>
            No other fields
          </div>
        )}
      </SectionDropdown>
    </>
  );
}
/*
function validateHorizontalList(local) {
  const errors = {};

  if (!local.name?.trim() && !local.title?.trim()) {
    errors.name = "Name is required";
  }

  if (!local.cells_per_view || Number(local.cells_per_view) <= 0) {
    errors.cells_per_view = "Cells per view must be greater than 0";
  }

  return errors;
}
function validateGrid(local) {
  const errors = {};

  if (!local.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!local.column_count || Number(local.column_count) <= 0) {
    errors.column_count = "Column count must be greater than 0";
  }

  if (!local.row_count || Number(local.row_count) <= 0) {
    errors.row_count = "Row count must be greater than 0";
  }

  return errors;
}
*/
function FeedCreateForm({
  draft,
  setDraft,

  tenants = [],
  feedContexts = [],

  setTenants,
  setFeeds,
  setFeedContexts,

  createTenant,
  createFeed,
  createFeedContext,

  onCreated,
}) {
  const [tenantDraft, setTenantDraft] = useState({});
  const [feedContextDraft, setFeedContextDraft] = useState({});

  const set = (key, value) => {
    setDraft((p) => ({ ...p, [key]: value }));
  };

  return (
    <>
      <TF
        label="Name"
        value={draft.name || ""}
        onChange={(v) => set("name", v)}
      
        required
      />

      <TF
        label="Code"
        value={draft.code || ""}
        onChange={(v) => set("code", v)}
        required
      />

      <TF
        label="Feed URL"
        value={draft.feed_url || ""}
        onChange={(v) => set("feed_url", v)}
        required
      />

      <Field label="Method">
        <select
          value={draft.method || "get"}
          onChange={(e) => set("method", e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="get">get</option>
          <option value="post">post</option>
        </select>
      </Field>

      <Toggle
        label="Enable Feed Mapping"
        checked={!!draft.enable_feed_mapping}
        onChange={(v) => {
          set("enable_feed_mapping", v);

          if (!v) {
            set("feed_mapping", {});
          }
        }}
      />

      {draft.enable_feed_mapping && (
        <TF
          label="Feed Mapping JSON"
          value={
            typeof draft.feed_mapping === "string"
              ? draft.feed_mapping
              : JSON.stringify(draft.feed_mapping || {}, null, 2)
          }
          onChange={(v) => {
            try {
              set("feed_mapping", JSON.parse(v || "{}"));
            } catch {
              set("feed_mapping", v);
            }
          }}
        />
      )}

      <RelationField
        label="Tenant"
        value={draft.tenant}
        options={tenants}
        onSelect={(v) => set("tenant", v)}
        onRemove={() => set("tenant", null)}
        createLabel="Create tenant"
      >
        <TF
          label="Name"
          value={tenantDraft.name || ""}
          onChange={(v) => setTenantDraft((p) => ({ ...p, name: v }))}
        />

        <TF
          label="Code"
          value={tenantDraft.code || ""}
          onChange={(v) => setTenantDraft((p) => ({ ...p, code: v }))}
        />

        <button
          type="button"
          onClick={async () => {
            if (!tenantDraft.name?.trim() || !tenantDraft.code?.trim()) {
              alert("Tenant name and code are required");
              return;
            }

            const res = await createTenant(tenantDraft);
            const created = res.data?.data;

            setTenants((prev) => [...prev, created]);
            set("tenant", created);
          }}
        >
          Create Tenant
        </button>
      </RelationField>

      <RelationField
        label="Feed Context"
        value={draft.feed_context}
        options={feedContexts}
        onSelect={(v) => set("feed_context", v)}
        onRemove={() => set("feed_context", null)}
        createLabel="Create feed context"
      >
        <FeedContextCreateForm
          draft={feedContextDraft}
          setDraft={setFeedContextDraft}
          tenants={tenants}
          createTenant={createTenant}
          createFeedContext={createFeedContext}
          setTenants={setTenants}
          setFeedContexts={setFeedContexts}
          onCreated={(created) => set("feed_context", created)}
        />
      </RelationField>

      <button
        type="button"
        style={{ marginTop: 8, width: "100%" }}
        onClick={async () => {
          if (!draft.name?.trim()) {
            alert("Feed name is required");
            return;
          }

          if (!draft.code?.trim()) {
            alert("Feed code is required");
            return;
          }

          if (!draft.feed_url?.trim()) {
            alert("Feed URL is required");
            return;
          }

          if (!draft.method?.trim()) {
            alert("Method is required");
            return;
          }

          const payload = {
            name: draft.name.trim(),
            code: draft.code.trim(),
            feed_url: draft.feed_url.trim(),
            method: draft.method || "get",

            enable_feed_mapping: !!draft.enable_feed_mapping,

            feed_mapping: draft.enable_feed_mapping
              ? typeof draft.feed_mapping === "string"
                ? JSON.parse(draft.feed_mapping || "{}")
                : draft.feed_mapping || {}
              : null,

            tenant: draft.tenant?.documentId || draft.tenant?.id || null,
            feed_context:
              draft.feed_context?.documentId || draft.feed_context?.id || null,
          };

          const res = await createFeed(payload);
          const created = res.data?.data;

          setFeeds((prev) => [...prev, created]);
          onCreated(created);
        }}
      >
        Create Feed
      </button>
    </>
  );
}
function BlockSection({
  block,
  localBlocks,
  setLocalBlocks,
  onUpdateBlock,

  feeds = [],
  cardStyles = [],
  feedContexts = [],
  tenants =  [],

  setFeeds,
  setCardStyles,
  setFeedContexts,
  setTenants,

  createFeed,
  createCardStyle,
  createFeedContext,
  createTenant,
}) {
  const [feedDraft, setFeedDraft] = useState({
  name: "",
  code: "",
  feed_url: "",
  method: "get",
  enable_feed_mapping: false,
  feed_mapping: {},
  tenant: null,
  feed_context: null,
});
  const [cardStyleDraft, setCardStyleDraft] = useState({
  name: "",
  card_type: "card_type_1",
});

  const [feedContextDraft, setFeedContextDraft] = useState({
  name: "",
  tenant: null,
  feed_context: [],
});

  const [tenantDraft, setTenantDraft] = useState({
  name: "",
  code: "",
});
  const meta = COMPONENT_META[block.__component] || { label: block.__component, color: "#64748b" };
  const local = {
  ...(BLOCK_DEFAULTS[block.__component] || {}),
  ...block,
  ...(localBlocks[block._clientId] || {}),
};

  const set = (field, value) => {
  const patch = { [field]: value };

  if (onUpdateBlock) {
    onUpdateBlock(block._clientId, patch);
    return;
  }

  setLocalBlocks((prev) => ({
    ...prev,
    [block._clientId]: {
      ...(prev[block._clientId] || {}),
      ...patch,
    },
  }));
};

  const c = block.__component;

  const isHL = ["roku.horizontal-list", "page.horizontal-list"].includes(c);
  const isGrid = ["roku.grid", "page.grid"].includes(c);
  const isCuration = c === "roku.curation";
  const isPlayer = c === "roku.player" || c === "roku.roku-player";
  const isLogin = c === "roku.login";

  const hasFeedRelation = isHL || isGrid || isCuration || isPlayer;
  const hasCardStyleRelation = isHL || isGrid;
  const hasLoginStyleRelations = isLogin;

  const errors = {};

  if (!local.name?.trim()) errors.name = "Required";

if (local.__component === "roku.horizontal-list") {
  if (!local.cells_per_view || Number(local.cells_per_view) <= 0) {
    errors.cells_per_view = "Must be > 0";
  }
}

if (local.__component === "roku.grid") {
  const req = [
    "row_count",
    "column_count",
    "row_gap",
    "column_gap",
    "translation_top",
    "translation_bottom",
    "translation_left",
    "translation_right",
    "row_reload_offset",
    "lazy_load_row_count",
  ];

  req.forEach((k) => {
    if (local[k] === "" || local[k] === null || local[k] === undefined) {
      errors[k] = "Required";
    }
  });
}

  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
      <div style={{ marginBottom: 4 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#fff",
            background: meta.color,
            padding: "2px 10px",
            borderRadius: 10,
          }}
        >
          {meta.label}
        </span>
      </div>

      {(hasFeedRelation || hasCardStyleRelation || hasLoginStyleRelations) && (
  <SectionDropdown title="Relations" defaultOpen>
    {hasFeedRelation && (
      <RelationField
        label="Feed"
        value={local.feed}
        options={feeds}
        onSelect={(v) => set("feed", v)}
        onRemove={() => set("feed", null)}
        createLabel="Create feed"
      >
        <FeedCreateForm
          draft={feedDraft}
          setDraft={setFeedDraft}
          tenants={tenants}
          feedContexts={feedContexts}
          setTenants={setTenants}
          setFeeds={setFeeds}
          setFeedContexts={setFeedContexts}
          createTenant={createTenant}
          createFeed={createFeed}
          createFeedContext={createFeedContext}
          onCreated={(created) => set("feed", created)}
        />
      </RelationField>
    )}

    {hasCardStyleRelation && (
      <RelationField
        label="Card Style"
        value={local.card_style}
        options={cardStyles}
        onSelect={(v) => set("card_style", v)}
        onRemove={() => set("card_style", null)}
        createLabel="Create card style"
      >
        <TF
          label="Name"
          value={cardStyleDraft.name || ""}
          onChange={(v) =>
            setCardStyleDraft((p) => ({ ...p, name: v }))
          }
        />

        <Field label="Card Type">
          <select
            value={cardStyleDraft.card_type || "card_type_1"}
            onChange={(e) =>
              setCardStyleDraft((p) => ({
                ...p,
                card_type: e.target.value,
              }))
            }
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="card_type_1">card_type_1</option>
            <option value="card_type_2">card_type_2</option>
            <option value="button_type_1">button_type_1</option>
          </select>
        </Field>

        <button
          type="button"
          onClick={async () => {
            if (!cardStyleDraft.name?.trim()) {
              alert("Card style name is required");
              return;
            }

            const payload = {
              name: cardStyleDraft.name.trim(),
              card_type: cardStyleDraft.card_type || "card_type_1",
            };

            const res = await createCardStyle(payload);
            const created = res.data?.data;

            setCardStyles((prev) => [...prev, created]);
            set("card_style", created);
          }}
        >
          Create Card Style
        </button>
      </RelationField>
    )}

    {hasLoginStyleRelations && (
      <>
        <RelationField
          label="Input Box Style"
          value={local.input_box_style}
          options={cardStyles}
          onSelect={(v) => set("input_box_style", v)}
          onRemove={() => set("input_box_style", null)}
          createLabel="Create input box style"
        >
          <TF
            label="Name"
            value={cardStyleDraft.name || ""}
            onChange={(v) =>
              setCardStyleDraft((p) => ({ ...p, name: v }))
            }
          />

          <Field label="Card Type">
            <select
              value={cardStyleDraft.card_type || "button_type_1"}
              onChange={(e) =>
                setCardStyleDraft((p) => ({
                  ...p,
                  card_type: e.target.value,
                }))
              }
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="card_type_1">card_type_1</option>
              <option value="card_type_2">card_type_2</option>
              <option value="button_type_1">button_type_1</option>
            </select>
          </Field>

          <button
            type="button"
            onClick={async () => {
              if (!cardStyleDraft.name?.trim()) {
                alert("Card style name is required");
                return;
              }

              const payload = {
                name: cardStyleDraft.name.trim(),
                card_type: cardStyleDraft.card_type || "button_type_1",
              };

              const res = await createCardStyle(payload);
              const created = res.data?.data;

              setCardStyles((prev) => [...prev, created]);
              set("input_box_style", created);
            }}
          >
            Create Input Box Style
          </button>
        </RelationField>

        <RelationField
          label="Buttons Style"
          value={local.buttons_style}
          options={cardStyles}
          onSelect={(v) => set("buttons_style", v)}
          onRemove={() => set("buttons_style", null)}
          createLabel="Create buttons style"
        >
          <TF
            label="Name"
            value={cardStyleDraft.name || ""}
            onChange={(v) =>
              setCardStyleDraft((p) => ({ ...p, name: v }))
            }
          />

          <Field label="Card Type">
            <select
              value={cardStyleDraft.card_type || "button_type_1"}
              onChange={(e) =>
                setCardStyleDraft((p) => ({
                  ...p,
                  card_type: e.target.value,
                }))
              }
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="card_type_1">card_type_1</option>
              <option value="card_type_2">card_type_2</option>
              <option value="button_type_1">button_type_1</option>
            </select>
          </Field>

          <button
            type="button"
            onClick={async () => {
              if (!cardStyleDraft.name?.trim()) {
                alert("Card style name is required");
                return;
              }

              const payload = {
                name: cardStyleDraft.name.trim(),
                card_type: cardStyleDraft.card_type || "button_type_1",
              };

              const res = await createCardStyle(payload);
              const created = res.data?.data;

              setCardStyles((prev) => [...prev, created]);
              set("buttons_style", created);
            }}
          >
            Create Buttons Style
          </button>
        </RelationField>
      </>
    )}
  </SectionDropdown>
)}

      <DynamicBlockFields local={local} set={set} errors={errors} />
    </div>
  );
}

export default function RightPanel({
  collection,
  item,
  selectedBlock,
  localItem,
  setLocalItem,
  localBlocks,
  setLocalBlocks,
  onUpdateBlock,

  layouts = [],
  tenants = [],
  rokuMenus = [],
  feeds = [],
  cardStyles = [],
  feedContexts = [],

  setLayouts,
  setTenants,
  setRokuMenus,
  setFeeds,
  setCardStyles,
  setFeedContexts,

  createLayout,
  createTenant,
  createRokuMenu,
  createFeed,
  createCardStyle,
  createFeedContext,

  onSave,
  saving,
}) {
  const isCardStyle = collection?.id === "roku-card-styles";
  if (!item) {
    return (
      <div style={panelStyle}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
            color: "#d1d5db",
          }}
        >
          <span style={{ fontSize: 32, opacity: 0.2 }}>◫</span>
          <span style={{ fontSize: 12 }}>Select an item</span>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div
        style={{
          padding: "11px 16px",
          borderBottom: "1px solid #f1f5f9",
          background: "#fafafa",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Properties
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        <ItemSection
          collection={collection}
          localItem={localItem}
          setLocalItem={setLocalItem}

          layouts={layouts}
          tenants={tenants}
          rokuMenus={rokuMenus}
          feedContexts={feedContexts}

          setLayouts={setLayouts}
          setTenants={setTenants}
          setRokuMenus={setRokuMenus}
          setFeedContexts={setFeedContexts}

          createLayout={createLayout}
          createTenant={createTenant}
          createRokuMenu={createRokuMenu}
          createFeedContext={createFeedContext}
        />
        {selectedBlock ? (
          <BlockSection
            block={selectedBlock}
            localBlocks={localBlocks}
            setLocalBlocks={setLocalBlocks}
            onUpdateBlock={onUpdateBlock}

            feeds={feeds}
            cardStyles={cardStyles}
            feedContexts={feedContexts}

            tenants={tenants}
            setFeeds={setFeeds}
            setCardStyles={setCardStyles}
            setFeedContexts={setFeedContexts}
            setTenants={setTenants}

            createFeed={createFeed}
            createCardStyle={createCardStyle}
            createFeedContext={createFeedContext}
            createTenant={createTenant}
        />
        ) : (
          <div
            style={{
              padding: "10px 16px",
              color: "#c4c9d4",
              fontSize: 11,
              fontStyle: "italic",
            }}
          >
            Click a block to configure it.
          </div>
        )}

        <div style={{ height: 12 }} />
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", flexShrink: 0 }}>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "9px 0",
            borderRadius: 8,
            border: "none",
            background: saving ? "#c7d2fe" : "#6366f1",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.background = "#4f46e5";
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.background = saving ? "#c7d2fe" : "#6366f1";
            }
          }}
        >
          {saving ? "Saving…" : `Save ${collection?.id === "feed" ? "Feed" : isCardStyle ? "Card Style": "Screen"}`}
        </button>
      </div>
    </div>
  );
}