import { useState, useEffect } from "react";
import LeftPanel from "./components/LeftPanel";
import Canvas from "./components/Canvas";
import RightPanel from "./components/RightPanel";
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
  getFeeds,
  createFeed,
  updateFeed,
  deleteFeed,
  getCardStyles,
  createCardStyle,
  updateCardStyle,
  deleteCardStyle,
  getLayouts,
  createLayout,
  getTenants,
  createTenant,
  getRokuMenus,
  createRokuMenu,
  getFeedContexts,
  createFeedContext,

} from "./api/strapi";

const APPS = [
  { id: "roku", name: "Roku" },
];
function tagBlocks(blocks = []) {
  return blocks.map((b, i) => ({
    ...b,
    _clientId: b._clientId || `existing_${i}_${b.__component}_${Date.now()}`,
  }));
}

export default function App() {
  
  const [view, setView] = useState("collections"); 
  const [collection, setCollection] = useState(null);
  const [selectedApp, setSelectedApp] = useState("roku");
  const [layouts, setLayouts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rokuMenus, setRokuMenus] = useState([]);
  const [pages, setPages] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [feedContexts, setFeedContexts] = useState([]);
  const [cardStyles, setCardStyles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [screens, setScreens] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [localPage, setLocalPage] = useState(null);       
  const [localBlocks, setLocalBlocks] = useState({});  
  const [pageBlocks, setPageBlocks] = useState([]);    

  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
  if (!selectedTenant) return;

  const tenantLayouts = layouts.filter((layout) => {
    const tenantId =
      layout?.tenant?.documentId ||
      layout?.tenant?.id;

    return (
      String(tenantId) ===
      String(
        selectedTenant.documentId ||
          selectedTenant.id
      )
    );
  });


  // auto reset layout if invalid
  if (
    selectedLayout &&
    !tenantLayouts.find(
      (l) =>
        String(l.documentId || l.id) ===
        String(
          selectedLayout.documentId ||
            selectedLayout.id
        )
    )
  ) {
    setSelectedLayout(null);
    setScreens([]);
  }
}, [selectedTenant, layouts]);

  const normalizeCardStyle = (c) => ({
  ...c,
  id: c.id,
  documentId: c.documentId || c.id,
  name: c.name || "Untitled Card Style",
  card_type: c.card_type || "card_type_1",
  layout: c.layout || null,
  tenant: c.tenant || null,
  card_type_1: c.card_type_1 || null,
  card_type_2: c.card_type_2 || null,
  button_type_1: c.button_type_1 || null,
  _raw: c,
});

const normalizeFeed = (f) => ({
  ...f,
  id: f.id,
  documentId: f.documentId || f.id,
  name: f.name || "Untitled Feed",
  code: f.code || "",
  feed_url: f.feed_url || "",
  enable_feed_mapping: !!f.enable_feed_mapping,
  feed_mapping: f.feed_mapping || {},
  method: f.method || "get",
  tenant: f.tenant || null,
  feed_context: f.feed_context || null,
  _raw: f,
});



const findRelation = (items, value) => {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  return (
    items.find(
      (item) =>
        String(item.documentId || item.id) === String(value)
    ) || null
  );
};

const normalizeBlockRelationsWithLists = (
  block,
  feedsList,
  cardStylesList,
  feedContextsList
) => {
  const base = {
    ...block,
    feed: findRelation(feedsList, block.feed),
    card_style: findRelation(cardStylesList, block.card_style),
    feed_context: findRelation(
      feedContextsList,
      block.feed_context || block.feed?.feed_context
    ),
  };

  // Login fields come back from Strapi inside login_template_1.
  // RightPanel edits them as flat fields, so flatten them after fetch.
  if (block.__component === "roku.login") {
    const t = block.login_template_1 || {};

    return {
      ...base,
      login_template: block.login_template || "login_template_1",

      ...t,

      input_box_style: findRelation(cardStylesList, t.input_box_style),
      buttons_style: findRelation(cardStylesList, t.buttons_style),

      login_template_1: t,
    };
  }

  return base;
};

const filteredLayouts = !selectedTenant
  ? layouts
  : layouts.filter(
      (layout) =>
        String(layout?.tenant?.documentId) ===
        String(selectedTenant?.documentId)
    );



const filteredPages = selectedLayout
  ? pages.filter((page) => {
      const layoutId =
        page?.layout?.documentId ||
        page?.layout?.id ||
        page?.layout?.data?.documentId ||
        page?.layout?.data?.id;

      return (
        String(layoutId) ===
        String(
          selectedLayout?.documentId ||
          selectedLayout?.id
        )
      );
    })
  : pages;


const normalizePage = (p, feedsList, cardStylesList, feedContextsList) => ({
  id: p.id,
  documentId: p.documentId || p.id,
  name:
    p.name ||
    p.attributes?.name ||
    p.title ||
    p.attributes?.title ||
    "Untitled",
  is_home: p.is_home ?? p.attributes?.is_home ?? false,
  show_menu: p.show_menu ?? p.attributes?.show_menu ?? true,
  layout: p.layout || null,
  tenant: p.tenant || null,
  page_blocks: tagBlocks(
    (p.page_blocks || p.attributes?.page_blocks || []).map((block) =>
      normalizeBlockRelationsWithLists(
        block,
        feedsList,
        cardStylesList,
        feedContextsList
      )
    )
  ),
  _raw: p,
});

// optional compatibility wrapper for old places still using normalizeBlockRelations
const normalizeBlockRelations = (block) =>
  normalizeBlockRelationsWithLists(block, feeds, cardStyles, feedContexts);

  useEffect(() => {
  const loadAll = async () => {
    setLoading(true);

    try {
      const [
        layoutRes,
        tenantRes,
        rokuMenuRes,
        feedRes,
        cardStyleRes,
        feedContextRes,
      ] = await Promise.all([
        getLayouts(),
        getTenants(),
        getRokuMenus(),
        getFeeds(),
        getCardStyles(),
        getFeedContexts(),
      ]);

      const layoutsList = layoutRes.data?.data || [];
      const tenantsList = tenantRes.data?.data || [];
      const rokuMenusList = rokuMenuRes.data?.data || [];
      const feedsList = (feedRes.data?.data || []).map(normalizeFeed);
      const cardStylesList = (cardStyleRes.data?.data || []).map(normalizeCardStyle);
      const feedContextsList = feedContextRes.data?.data || [];

      setLayouts(layoutsList);
      setTenants(tenantsList);
      setRokuMenus(rokuMenusList);
      setFeeds(feedsList);
      setCardStyles(cardStylesList);
      setFeedContexts(feedContextsList);

      const pageRes = await getPages();
      const rawPages = pageRes.data?.data || [];
      console.log(
  "RAW PAGES FROM STRAPI:",
  JSON.stringify(rawPages, null, 2)
);

      setPages(
        rawPages.map((p) =>
          normalizePage(p, feedsList, cardStylesList, feedContextsList)
        )
      );
    } catch (e) {
      console.error("LOAD ERROR:", e.response?.data || e);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  loadAll();
}, []);
  
  const handleSelectCollection = async (col) => {
  setCollection(col);
  setView("pages");
  setSelectedPage(null);
  setSelectedBlock(null);

  setLoading(true);

  try {
    if (col.id === "roku-card-styles") {
  const res = await getCardStyles();
  setCardStyles((res.data?.data || []).map(normalizeCardStyle));
}  else {
  const [feedRes, cardStyleRes, feedContextRes, pageRes] = await Promise.all([
    getFeeds(),
    getCardStyles(),
    getFeedContexts(),
    getPages(),
  ]);

  const feedsList = (feedRes.data?.data || []).map(normalizeFeed);
  const cardStylesList = (cardStyleRes.data?.data || []).map(normalizeCardStyle);
  const feedContextsList = feedContextRes.data?.data || [];
  const raw = pageRes.data?.data || [];

  setFeeds(feedsList);
  setCardStyles(cardStylesList);
  setFeedContexts(feedContextsList);

  setPages(
    raw.map((p) =>
      normalizePage(p, feedsList, cardStylesList, feedContextsList)
    )
  );
}
  } finally {
    setLoading(false);
  }
};
  const handleAddPage = () => {
  const tempId = Date.now();
  if (collection?.id === "roku-card-styles") {
  const newCardStyle = {
    id: tempId,
  documentId: null,
  isNew: true,
  name: "New Card Style",
  card_type: "card_type_1",

  layout: null,
  tenant: null,

  card_type_1: {
    aspect_ratio: "aspect_16:9",
    show_background_rectangle: false,
    show_image_1: true,
    show_label_1: true,
    show_label_2: true,
  },

  card_type_2: null,
  button_type_1: null,

  };

  setCardStyles((prev) => [...prev, newCardStyle]);
  handleSelectPage(newCardStyle);
  return;
}

  if (collection?.id === "feed") {
    const newFeed = {
      id: tempId,
      documentId: null,
      isNew: true,
      name: "New Feed",
      code: "",
      feed_url: "",
      enable_feed_mapping: false,
      feed_mapping: {},
      method: "get",
      tenant: null,
      feed_context: null,
    };

    setFeeds((prev) => [...prev, newFeed]);
    handleSelectPage(newFeed);
    return;
  }

  const newPage = {
    id: tempId,
    documentId: null,
    isNew: true,
    name: "New Screen",
    is_home: false,
    show_menu: true,
    page_blocks: [],
  };

  setPages((prev) => [...prev, newPage]);
  handleSelectPage(newPage);
};

const handleDeletePage = async (page) => {
  if (!page) return;

  try {
    if (page.isNew || !page.documentId) {
      // unsaved item — just remove from local state
      if (collection?.id === "feed") setFeeds((prev) => prev.filter((p) => p.id !== page.id));
      else if (collection?.id === "roku-card-styles") setCardStyles((prev) => prev.filter((p) => p.id !== page.id));
      else setPages((prev) => prev.filter((p) => p.id !== page.id));
    } else if (collection?.id === "feed") {
      await deleteFeed(page.documentId);
      setFeeds((prev) => prev.filter((p) => p.id !== page.id));
    } else if (collection?.id === "roku-card-styles") {
      await deleteCardStyle(page.documentId);
      setCardStyles((prev) => prev.filter((p) => p.id !== page.id));
    } else {
      await deletePage(page.documentId);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
    }

    if (selectedPage?.id === page.id) {
      setSelectedPage(null);
      setSelectedBlock(null);
      setLocalPage({});
      setLocalBlocks({});
      setPageBlocks([]);
      setView("pages");
    }
  } catch (e) {
    console.error("DELETE ERROR:", e.response?.data || e);
    alert("Delete failed. Check console.");
  }
};


 const handleSelectPage = (page) => {
  const taggedBlocks = tagBlocks(page.page_blocks || []);

  const tagged = {
    ...page,
    __collection: collection?.id || "filteredPages",
    page_blocks: taggedBlocks,
  };

  const matchedLayout =
    layouts.find(
      (l) =>
        String(l.documentId || l.id) ===
        String(page.layout?.documentId || page.layout?.id)
    ) ||
    page.layout ||
    null;

  const matchedTenant =
    tenants.find(
      (t) =>
        String(t.documentId || t.id) ===
        String(page.tenant?.documentId || page.tenant?.id)
    ) ||
    page.tenant ||
    null;

  setSelectedPage(tagged);

  setLocalPage({
    ...tagged,
    name: tagged.name,
    is_home: tagged.is_home,
    show_menu: tagged.show_menu,
    layout: matchedLayout,
    tenant: matchedTenant,
  });

  setPageBlocks(taggedBlocks);
  setLocalBlocks({});
  setSelectedBlock(null);

  const noComponentsCollections = [
  "feed",
  "roku-card-styles",
];

setView(
  noComponentsCollections.includes(collection?.id)
    ? "filteredPages"
    : "components"
);
};

  const resetEditorState = () => {
  setSelectedPage(null);
  setSelectedBlock(null);
  setLocalPage(null);
  setLocalBlocks({});
  setPageBlocks([]);
};

  const handleBackToCollections = () => {
    setView("collections");
    setCollection(null);
    resetEditorState();
  };

  const handleBackToPages = () => {
    setView("pages");
    resetEditorState();
  };

 
  const handleDropBlock = (block) => {
    const tagged = { ...block, _clientId: block._clientId || `new_${Date.now()}` };
    setPageBlocks((prev) => [...prev, tagged]);
    setSelectedBlock(tagged);
  };

  const handleReorderBlocks = (reordered) => {
    setPageBlocks(reordered);
  };

  const handleRemoveBlock = (clientId) => {
    setPageBlocks((prev) => prev.filter((b) => b._clientId !== clientId));
    setLocalBlocks((prev) => { const n = { ...prev }; delete n[clientId]; return n; });
    if (selectedBlock?._clientId === clientId) setSelectedBlock(null);
  };

  const handleUpdateBlock = (clientId, patch) => {
  if (!clientId) return;

  setLocalBlocks((prev) => ({
    ...prev,
    [clientId]: {
      ...(prev[clientId] || {}),
      ...patch,
    },
  }));

  setPageBlocks((prev) =>
    prev.map((block) =>
      block._clientId === clientId
        ? { ...block, ...patch }
        : block
    )
  );

  setSelectedBlock((prev) =>
    prev?._clientId === clientId
      ? { ...prev, ...patch }
      : prev
  );
};
const handleSelectBlock = (block) => {
  if (!block) {
    setSelectedBlock(null);
    return;
  }

  setSelectedBlock({
    ...block,
    ...(localBlocks[block._clientId] || {}),
  });
};
  
  

  const mapFocusStyle = (style) => {
  switch (style) {
    case "fixedFocus":
    case "floatingFocus":
    case "fixedFocusWrap":
      return style;

    case "scale":
    case "zoom":
      return "fixedFocus";

    case "slide":
      return "floatingFocus";

    case "fade":
    case "none":
      return "fixedFocusWrap";

    default:
      return "fixedFocus";
  }
};

const validFonts = [
  "TinySystemFont",
  "TinyBoldSystemFont",
  "SmallerSystemFont",
  "SmallerBoldSystemFont",
  "SmallestSystemFont",
  "SmallestBoldSystemFont",
  "SmallSystemFont",
  "SmallBoldSystemFont",
  "MediumSystemFont",
  "MediumBoldSystemFont",
  "LargeSystemFont",
  "LargeBoldSystemFont",
  "ExtraLargeSystemFont",
  "ExtraLargeBoldSystemFont",
  "BadgeSystemFont",
];

const normalizeFont = (value) => {
  if (!value) return "MediumSystemFont";

  const match = validFonts.find(
    (f) => f.toLowerCase() === String(value).toLowerCase()
  );

  return match || "MediumSystemFont";
};
  const validateBlock = (block) => {
  const errors = {};

  if (block.__component === "roku.horizontal-list") {
    if (!block.name?.trim() && !block.title?.trim()) {
      errors.name = "Name is required";
    }
    if (!block.cells_per_view || Number(block.cells_per_view) <= 0) {
      errors.cells_per_view = "Cells per view must be greater than 0";
    }
  }

  if (block.__component === "roku.grid") {
    if (!block.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!block.column_count || Number(block.column_count) <= 0) {
      errors.column_count = "Column count must be greater than 0";
    }
    if (!block.row_count || Number(block.row_count) <= 0) {
      errors.row_count = "Row count must be greater than 0";
    }
  }

  if (block.__component === "roku.curation") {
    if (!block.name?.trim()) errors.name = "Name is required";
  }

  if (block.__component === "roku.roku-player") {
    if (!block.video_source_key?.trim()) errors.video_source_key = "Video source key is required";
  }

  if (block.__component === "roku.login") {
  if (!block.name?.trim()) errors.name = "Name is required";

  const loginData = block.login_template_1 || block;

  ["login_url", "register_url", "reset_url", "refresh_url"].forEach((key) => {
    if (!loginData[key]?.trim()) {
      errors[key] = `${key} is required`;
    }
  });
}

  return errors;
};

const isHex = (v) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);

const addText = (obj, key, value) => {
  if (typeof value === "string" && value.trim()) obj[key] = value.trim();
};

const addNumber = (obj, key, value) => {
  const n = Number(value);
  if (Number.isFinite(n)) obj[key] = Math.floor(n);
};

const addBool = (obj, key, value) => {
  if (typeof value === "boolean") obj[key] = value;
};

const addColor = (obj, key, value) => {
  if (typeof value === "string" && isHex(value)) obj[key] = value;
};

  
  const relationId = (value) => {
  if (!value) return null;

  if (typeof value === "object") {
    return value.documentId || value.id || null;
  }

  return value;
};

  const handleSave = async () => {
  if (collection?.id === "roku-card-styles") {
  setSaving(true);

  try {
    const errors = {};

    if (!localPage.name?.trim()) errors.name = "Name is required";
    if (!localPage.card_type?.trim()) errors.card_type = "Card type is required";

    if (Object.keys(errors).length > 0) {
      alert("Please fix Card Style fields:\n\n" + Object.values(errors).join("\n"));
      setSaving(false);
      return;
    }

    const payload = {
      name: localPage.name.trim(),
      card_type: localPage.card_type || "card_type_1",

      layout: relationId(localPage.layout),
      tenant: relationId(localPage.tenant),

      card_type_1:
        localPage.card_type === "card_type_1"
          ? localPage.card_type_1
          : null,

      card_type_2:
        localPage.card_type === "card_type_2"
          ? localPage.card_type_2
          : null,

      button_type_1:
        localPage.card_type === "button_type_1"
          ? localPage.button_type_1
          : null,
    };

    if (selectedPage.isNew) {
      await createCardStyle(payload);
    } else {
      await updateCardStyle(selectedPage.documentId, payload);
    }

    const res = await getCardStyles();
    setCardStyles((res.data?.data || []).map(normalizeCardStyle));
  } catch (e) {
    console.error("CARD STYLE SAVE ERROR:", e.response?.data || e);
    alert("Card style save failed.");
  } finally {
    setSaving(false);
  }

  return;
}
  if (collection?.id === "feed") {
  setSaving(true);

  try {
    const errors = {};

    if (!localPage.name?.trim()) errors.name = "Name is required";
    if (!localPage.code?.trim()) errors.code = "Code is required";
    if (!localPage.feed_url?.trim()) errors.feed_url = "Feed URL is required";
    if (!localPage.method?.trim()) errors.method = "Method is required";

    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join("\n"));
      setSaving(false);
      return;
    }

    const payload = {
      name: localPage.name.trim(),
      code: localPage.code?.trim() || null,
      feed_url: localPage.feed_url?.trim() || null,
      enable_feed_mapping: !!localPage.enable_feed_mapping,
      feed_mapping: localPage.enable_feed_mapping
        ? localPage.feed_mapping || {}
        : null,
      method: localPage.method || "get",

      tenant: relationId(localPage.tenant),
      feed_context: relationId(localPage.feed_context),
    };

    if (selectedPage.isNew) {
      await createFeed(payload);
    } else {
      await updateFeed(selectedPage.documentId, payload);
    }

    // always reload from backend
    const res = await getFeeds();
    const refreshed = (res.data?.data || []).map(normalizeFeed);

    setFeeds(refreshed);

    // keep selected item
    const match = refreshed.find((f) => f.name === payload.name);
    if (match) setSelectedPage(match);

  } catch (e) {
    console.error("FEED SAVE ERROR:", e.response?.data || e);
    alert("Feed save failed");
  } finally {
    setSaving(false);
  }

  return;
}
  if (!selectedPage) return;

  setSaving(true);
  try {
    const mergedBlocks = pageBlocks.map((b) => {
      const edited = localBlocks[b._clientId];
      return edited ? { ...b, ...edited } : b;
    });

    for (const block of mergedBlocks) {
      const errors = validateBlock(block);
      if (Object.keys(errors).length > 0) {
        alert("Please fix required block fields before saving.");
        setSaving(false);
        return;
      }
    }
    
    const cleanEmptyStrings = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === "") {
          obj[key] = null;
        }
      });
      return obj;
    };
    const compact = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === "") obj[key] = null;
      });
      return obj;
    };

    const textOrNull = (value) =>
      typeof value === "string" && value.trim() ? value.trim() : null;

    const intOr = (value, fallback = 0) => {
      const n = Number(value);
      return Number.isFinite(n) ? Math.floor(n) : fallback;
    };

    const intOrNull = (value) => {
      if (value === "" || value === null || value === undefined) return null;
      const n = Number(value);
      return Number.isFinite(n) ? Math.floor(n) : null;
    };

    const boolOrNull = (value) =>
      typeof value === "boolean" ? value : null;

    const colorOrNull = (value) =>
      typeof value === "string" && isHex(value) ? value : null;

    const cleanBlocks = mergedBlocks.map((block) => {
        const { id, _clientId, _template, ...rest } = block;

        if (block.__component === "roku.curation") {
          const clean = {
            __component: "roku.curation",
            name: block.name?.trim() || "Untitled Curation",
          };

          const feedId = relationId(block.feed);
          if (feedId) clean.feed = feedId;

          return clean;
        }

        if (block.__component === "roku.roku-player") {
          const clean = {
            __component: "roku.roku-player",
            video_source_key: block.video_source_key?.trim() || "",
          };

          const feedId = relationId(block.feed);
          if (feedId) clean.feed = feedId;

          addNumber(clean, "player_height", block.player_height);
          addBool(clean, "enable_ads", block.enable_ads);
          addBool(clean, "enable_trickplay", block.enable_trickplay);
          addBool(clean, "enable_captions", block.enable_captions);

          if (block.enable_trickplay) {
            addColor(clean, "trickplay_text_color", block.trickplay_text_color);
            addText(clean, "trickplay_background_overlay", block.trickplay_background_overlay);
            addColor(clean, "trickplaybar_current_time_marker_color", block.trickplaybar_current_time_marker_color);
            addColor(clean, "trickplaybar_thumb_color", block.trickplaybar_thumb_color);
            addText(clean, "trickplaybar_filled_bar_image_url", block.trickplaybar_filled_bar_image_url);
            addColor(clean, "trickplaybar_track_color", block.trickplaybar_track_color);
            addText(clean, "trickplaybar_track_image_url", block.trickplaybar_track_image_url);
            addColor(clean, "trickplaybar_filled_bar_color", block.trickplaybar_filled_bar_color);
          }

          if (block.enable_captions) {
            addText(clean, "captions_text_style", block.captions_text_style);
            addText(clean, "captions_text_effect", block.captions_text_effect);
            addText(clean, "captions_text_size", block.captions_text_size);
            addText(clean, "captions_text_color", block.captions_text_color);
            addText(clean, "captions_text_opacity", block.captions_text_opacity);
            addText(clean, "captions_background_color", block.captions_background_color);
            addText(clean, "captions_background_opacity", block.captions_background_opacity);
            addText(clean, "captions_window_color", block.captions_window_color);
            addText(clean, "captions_window_opacity", block.captions_window_opacity);
          }

          addColor(clean, "bif_frame_bg_color", block.bif_frame_bg_color);
          addText(clean, "bif_frame_bg_image_uri", block.bif_frame_bg_image_uri);

          return clean;
        }

        if (block.__component === "roku.login") {
          const loginTemplate = {
            login_url: block.login_url?.trim() || "",
            register_url: block.register_url?.trim() || "",
            reset_url: block.reset_url?.trim() || "",
            refresh_url: block.refresh_url?.trim() || "",

            enable_logo: !!block.enable_logo,

            login_title_text: block.login_title_text || "Login",
            login_email_placeholder: block.login_email_placeholder || "Email",
            login_password_placeholder: block.login_password_placeholder || "Password",

            register_title_text: block.register_title_text || "Sign Up",
            register_email_placeholder: block.register_email_placeholder || "Email",
            register_first_name_placeholder:
              block.register_first_name_placeholder || "First Name",
            register_last_name_placeholder:
              block.register_last_name_placeholder || "Last Name",
            register_password_placeholder:
              block.register_password_placeholder || "First Password",

            forgot_password_title_text:
              block.forgot_password_title_text || "Forgot Password",
            forgot_password_email_placeholder:
              block.forgot_password_email_placeholder || "Email",

            login_button_text: block.login_button_text || "Login",
            register_button_text: block.register_button_text || "Sign Up",
            forgot_password_button_text:
              block.forgot_password_button_text || "Forgot Password",

            input_box_style: relationId(block.input_box_style),
            buttons_style: relationId(block.buttons_style),

            login_input_boxes_spacing: Number(block.login_input_boxes_spacing || 0),
            login_buttons_spacing: Number(block.login_buttons_spacing || 0),
            register_input_boxes_spacing: Number(block.register_input_boxes_spacing || 0),
            register_buttons_spacing: Number(block.register_buttons_spacing || 0),
            forgot_password_buttons_spacing: Number(
              block.forgot_password_buttons_spacing || 0
            ),
            forgot_password_input_boxes_spacing: Number(
              block.forgot_password_input_boxes_spacing || 0
            ),

            title_font: block.title_font || "MediumSystemFont",
            sub_title_font: block.sub_title_font || "MediumSystemFont",
            optional_title_1_font: block.optional_title_1_font || "MediumSystemFont",
            optional_title_2_font: block.optional_title_2_font || "MediumSystemFont",
            error_label_font: block.error_label_font || "MediumSystemFont",

            sub_title_y_offset: Number(block.sub_title_y_offset || 0),
            optional_title_1_y_offset: Number(block.optional_title_1_y_offset || 0),
            optional_title_2_y_offset: Number(block.optional_title_2_y_offset || 0),
            error_label_translation_left: Number(block.error_label_translation_left || 0),
            error_label_translation_top: Number(block.error_label_translation_top || 0),
            error_label_width: Number(block.error_label_width || 0),
          };

          if (block.enable_logo) {
            loginTemplate.logo_url = block.logo_url || "";
            loginTemplate.logo_width = Number(block.logo_width || 300);
            loginTemplate.logo_height = Number(block.logo_height || 150);
            loginTemplate.logo_translation_left = Number(
              block.logo_translation_left || 200
            );
            loginTemplate.logo_translation_top = Number(
              block.logo_translation_top || 150
            );
          }

          addColor(loginTemplate, "title_color", block.title_color);
          addColor(loginTemplate, "sub_title_color", block.sub_title_color);
          addColor(loginTemplate, "optional_title_1_color", block.optional_title_1_color);
          addColor(loginTemplate, "optional_title_2_color", block.optional_title_2_color);
          addColor(loginTemplate, "error_label_color", block.error_label_color);

          addText(loginTemplate, "login_sub_title_text", block.login_sub_title_text);
          addText(
            loginTemplate,
            "login_optional_title_1_text",
            block.login_optional_title_1_text
          );
          addText(
            loginTemplate,
            "login_optional_title_2_text",
            block.login_optional_title_2_text
          );

          addText(loginTemplate, "register_sub_title_text", block.register_sub_title_text);

          addText(
                loginTemplate,
                "register_optional_title_1_text",
                block.register_optional_title_1_text
              );
              addText(
                loginTemplate,
                "register_optional_title_2_text",
                block.register_optional_title_2_text
              );
              addText(
                loginTemplate,
                "forgot_password_sub_title_text",
                block.forgot_password_sub_title_text
              );
              addText(
                loginTemplate,
                "forgot_password_optional_title_1_text",
                block.forgot_password_optional_title_1_text
              );
              addText(
                loginTemplate,
                "forgot_password_optional_title_2_text",
                block.forgot_password_optional_title_2_text
              );
              addText(loginTemplate, "login_error_text", block.login_error_text);
              addText(loginTemplate, "register_error_text", block.register_error_text);
              addText(
                loginTemplate,
                "forgot_password_error_text",
                block.forgot_password_error_text
              );

          return {
            __component: "roku.login",
            name: block.name?.trim() || "Login",
            login_template: "login_template_1",
            login_template_1: loginTemplate,
          };
        }

        if (block.__component === "roku.horizontal-list") {
          return {
            __component: "roku.horizontal-list",
            name: block.name?.trim() || block.title?.trim() || "Horizontal List",
            enable_title: !!block.enable_title,
            cells_per_view: Number(block.cells_per_view || 4),
            cells_focusable: block.cells_focusable ?? true,
            focus_animation_style: mapFocusStyle(block.focus_animation_style),
            feed: relationId(block.feed),
            card_style: relationId(block.card_style),
          };
        }

        if (block.__component === "roku.grid") {
          return {
            __component: "roku.grid",
            name: block.name?.trim() || "Grid",
            enable_title: !!block.enable_title,
            row_count: Number(block.row_count || 4),
            column_count: Number(block.column_count || 4),
            row_gap: Number(block.row_gap || 0),
            column_gap: Number(block.column_gap || 0),
            row_reload_offset: Number(block.row_reload_offset || 1),
            lazy_load_row_count: Number(block.lazy_load_row_count || 1),
            cells_focusable: block.cells_focusable ?? true,
            focus_animation_style: mapFocusStyle(block.focus_animation_style),
            feed: relationId(block.feed),
            card_style: relationId(block.card_style),
          };
        }

        return rest;
      });
          
    

          const payload = {
        name: localPage.name || selectedPage.name,
        is_home: !!localPage.is_home,
        show_menu: !!localPage.show_menu,
        layout: relationId(localPage.layout),
        tenant: relationId(localPage.tenant),
        page_blocks: cleanBlocks,
      };
          console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));
          console.log("FINAL PAYLOAD:", payload);

          if (selectedPage.isNew) {
            console.log("FINAL SCREEN PAYLOAD:", JSON.stringify(payload, null, 2));
            await createPage(payload);
            const refreshed = await getPages();
              const raw = refreshed.data?.data || [];

              const normalised = raw.map((p) =>
                normalizePage(p, feeds, cardStyles, feedContexts)
              );

              setPages(normalised);

              const updated = selectedPage.isNew
                ? normalised.find((p) => p.name === payload.name)
                : normalised.find((p) => p.documentId === selectedPage.documentId);

              if (updated) {
                setSelectedPage(updated);
                setLocalPage(updated);
                setPageBlocks(updated.page_blocks);
                setLocalBlocks({});
                setSelectedBlock(null);
              }
                      
          } else {
            console.log("FINAL SCREEN PAYLOAD:", JSON.stringify(payload, null, 2));
            await updatePage(selectedPage.documentId, payload );
            const refreshed = await getPages();
            const raw = refreshed.data?.data || [];

            const normalised = raw.map((p) =>
              normalizePage(p, feeds, cardStyles, feedContexts)
            );

            setPages(normalised);

            const updated = selectedPage.isNew
              ? normalised.find((p) => p.name === payload.name)
              : normalised.find((p) => p.documentId === selectedPage.documentId);

            if (updated) {
              setSelectedPage(updated);
              setLocalPage(updated);
              setPageBlocks(updated.page_blocks);
              setLocalBlocks({});
              setSelectedBlock(null);
            }
          }
            
  } catch (e) {
    console.error("SAVE ERROR:", e.response?.data || e);
    alert("Save failed. Check console.");
  } finally {
    setSaving(false);
  }
}; 
  const visiblePage = selectedPage
  ? {
      ...selectedPage,
      ...localPage,
      page_blocks: pageBlocks.map((block) => ({
        ...block,
        ...(localBlocks[block._clientId] || {}),
      })),
    }
  : null;
  



 return (
  <div
    style={{
      height: "100vh",
      overflow: "hidden",
      background: "#0f172a",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}
  >
    {/* TOP BAR */}
<div
  style={{
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #1e293b",
    background: "#111827",
  }}
>
  {/* BRAND */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.4,
  }}
>
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 10,
      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      fontWeight: 800,
      color: "#fff",
      boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
    }}
  >
    A
  </div>

  <div>
    Roku App Admin
  </div>
</div>

  {/* RIGHT CONTROLS */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    {/* TENANT */}
    <select
      value={selectedTenant?.documentId || ""}
      onChange={(e) => {
        const tenant = tenants.find(
          (t) =>
            String(t.documentId) ===
            String(e.target.value)
        );

        setSelectedTenant(tenant || null);
        setSelectedLayout(null);
      }}
      style={{
        height: 38,
        minWidth: 180,
        padding: "0 12px",
        borderRadius: 8,
        border: "1px solid #334155",
        background: "#1e293b",
        color: "#fff",
        outline: "none",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <option value="">All Tenants</option>

      {tenants.map((tenant) => (
        <option
          key={tenant.documentId}
          value={tenant.documentId}
        >
          {tenant.name}
        </option>
      ))}
    </select>

    {/* APP */}
    <select
      value={selectedApp}
      disabled
      style={{
        height: 38,
        minWidth: 120,
        padding: "0 12px",
        borderRadius: 8,
        border: "1px solid #334155",
        background: "#0f172a",
        color: "#94a3b8",
        outline: "none",
        fontSize: 14,
      }}
    >
      <option value="roku">Roku</option>
    </select>

    {/* LAYOUT */}
    <select
      value={selectedLayout?.documentId || ""}
      onChange={(e) => {
        const layout = layouts.find(
          (l) =>
            String(l.documentId) ===
            String(e.target.value)
        );

        setSelectedLayout(layout || null);
      }}
      style={{
        height: 38,
        minWidth: 180,
        padding: "0 12px",
        borderRadius: 8,
        border: "1px solid #334155",
        background: "#1e293b",
        color: "#fff",
        outline: "none",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <option value="">All Layouts</option>

      {filteredLayouts.map((layout) => (
        <option
          key={layout.documentId}
          value={layout.documentId}
        >
          {layout.name}
        </option>
      ))}
    </select>
  </div>

    </div>

    {/* MAIN LAYOUT */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "20% 30% 50%",
        height: "calc(100vh - 60px)",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <LeftPanel
        view={view === "pages" ? "items" : view}
        collection={collection}
        items={
          collection?.id === "feed"
            ? feeds
            : collection?.id === "roku-card-styles"
            ? cardStyles
            : filteredPages
        }
        selectedItem={selectedPage}
        onSelectCollection={handleSelectCollection}
        onSelectItem={handleSelectPage}
        onBackToCollections={handleBackToCollections}
        onBackToItems={handleBackToPages}
        onAddItem={handleAddPage}
        onDeleteItem={handleDeletePage}
      />

      <Canvas
        page={visiblePage}
        selectedBlock={selectedBlock}
        onSelectBlock={handleSelectBlock}
        onDropBlock={handleDropBlock}
        onReorderBlocks={handleReorderBlocks}
        onRemoveBlock={handleRemoveBlock}
      />

      <RightPanel
        collection={collection}
        item={selectedPage}
        selectedBlock={selectedBlock}
        localItem={localPage}
        setLocalItem={setLocalPage}
        localBlocks={localBlocks}
        setLocalBlocks={setLocalBlocks}
        onUpdateBlock={handleUpdateBlock}
        layouts={layouts}
        tenants={tenants}
        rokuMenus={rokuMenus}
        feeds={feeds}
        cardStyles={cardStyles}
        feedContexts={feedContexts}
        setLayouts={setLayouts}
        setTenants={setTenants}
        setRokuMenus={setRokuMenus}
        setFeeds={setFeeds}
        setCardStyles={setCardStyles}
        setFeedContexts={setFeedContexts}
        createLayout={createLayout}
        createTenant={createTenant}
        createRokuMenu={createRokuMenu}
        createFeed={createFeed}
        createCardStyle={createCardStyle}
        createFeedContext={createFeedContext}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  </div>
);

}


