import { useState } from "react";
import { COMPONENT_META } from "./LeftPanel";


function Bar({ w = "100%", h = 10, r = 4, opacity = 1, mb = 0 }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "#d8dfe8", opacity, marginBottom: mb, flexShrink: 0 }} />;
}


function HeroSkeleton() {
  return (
    <div style={{ padding: "18px 20px", background: "linear-gradient(135deg,#1e293b,#0f172a)", borderRadius: 8, minHeight: 88 }}>
      <Bar w="48%" h={16} r={6} mb={8} />
      <Bar w="72%" h={9} opacity={0.4} mb={4} />
      <Bar w="52%" h={9} opacity={0.22} />
    </div>
  );
}

function RichTextSkeleton() {
  return (
    <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e8edf4" }}>
      {[100, 91, 96, 66, 78].map((w, i) => <Bar key={i} w={`${w}%`} h={8} mb={6} opacity={i > 2 ? 0.45 : 1} />)}
    </div>
  );
}

function HorizontalListSkeleton({ block }) {
  const cells = block?.cells_per_view || 4;
  return (
    <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e8edf4" }}>
      {block?.enable_title && <Bar w="35%" h={10} r={4} mb={10} />}
      <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
        {[...Array(Math.min(cells + 1, 6))].map((_, i) => (
          <div key={i} style={{ minWidth: `calc(${100 / cells}% - 8px)`, height: 70, borderRadius: 6, flexShrink: 0, background: `hsl(${215 + i * 8},18%,${87 + i}%)` }} />
        ))}
      </div>
      {block?.Scrollable && (
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 7 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ width: i === 0 ? 16 : 6, height: 4, borderRadius: 2, background: i === 0 ? "#10b981" : "#d8dfe8" }} />)}
        </div>
      )}
    </div>
  );
}

function GridSkeleton({ block }) {
  const cols = block?.column_count || 3;
  const rows = block?.row_count || 3;
  return (
    <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e8edf4" }}>
      {block?.enable_title && <Bar w="30%" h={10} r={4} mb={10} />}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: `${block?.row_gap || 8}px ${block?.column_gap || 8}px` }}>
        {[...Array(cols * Math.min(rows, 3))].map((_, i) => (
          <div key={i} style={{ height: 48, borderRadius: 5, background: `hsl(${215 + i * 5},16%,${83 + (i % 3)}%)` }} />
        ))}
      </div>
    </div>
  );
}

function CurationSkeleton({ block }) {
  return (
    <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e8edf4" }}>
      <Bar w="42%" h={12} r={5} mb={10} />
      <div style={{ display: "flex", gap: 8 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ flex: 1, height: 54, borderRadius: 6, background: `hsl(${190 + i * 7},18%,${84 + i}%)` }} />
        ))}
      </div>
    </div>
  );
}

function PlayerSkeleton({ block }) {
  return (
    <div style={{ padding: "12px 14px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b", color: "#e2e8f0" }}>
      <div style={{ height: block?.player_height || 130, minHeight: 90, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 26, opacity: 0.7 }}>▶</span>
      </div>
      <Bar w="60%" h={8} opacity={0.45} />
    </div>
  );
}

function LoginSkeleton({ block }) {
  return (
    <div style={{ padding: "16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e8edf4" }}>
      {block?.enable_logo && <Bar w="34%" h={28} r={8} mb={12} />}
      <Bar w="38%" h={14} r={5} mb={12} />
      <Bar w="100%" h={30} r={6} mb={8} />
      <Bar w="100%" h={30} r={6} mb={10} />
      <Bar w="44%" h={24} r={6} />
    </div>
  );
}

function BlockSkeleton({ block }) {
  const c = block.__component;
  if (c === "page.hero" || c === "roku.hero") return <HeroSkeleton />;
  if (c === "page.rich-text" || c === "roku.rich-text") return <RichTextSkeleton />;
  if (c === "page.horizantal-list" || c === "roku.horizontal-list" || c === "roku.horizantal-list") return <HorizontalListSkeleton block={block} />;
  if (c === "page.grid" || c === "roku.grid") return <GridSkeleton block={block} />;
  if (c === "roku.curation") return <CurationSkeleton block={block} />;
  if (c === "roku.roku-player") return <PlayerSkeleton block={block} />;
  if (c === "roku.login") return <LoginSkeleton block={block} />;
  return <div style={{ padding: 14, background: "#f1f5f9", borderRadius: 8, color: "#94a3b8", fontSize: 11 }}>{c}</div>;
}


export default function Canvas({ page, selectedBlock, onSelectBlock, onDropBlock, onReorderBlocks, onRemoveBlock }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const content = page ? (page.page_blocks || []) : [];

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const raw = e.dataTransfer.getData("block");
    if (raw) { try { onDropBlock(JSON.parse(raw)); } catch {} }
  };

  const handleBlockDragStart = (e, index) => {
    e.stopPropagation();
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("reorder", String(index));
  };

  const handleBlockDragOver = (e, index) => {
    e.preventDefault(); e.stopPropagation();
    if (dragIndex !== null) setOverIndex(index);
  };

  const handleBlockDrop = (e, dropIndex) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.getData("reorder") !== "" && dragIndex !== null && dragIndex !== dropIndex) {
      const reordered = [...content];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dropIndex, 0, moved);
      onReorderBlocks(reordered);
    }
    setDragIndex(null); setOverIndex(null);
  };

  if (!page) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#EAEAF2", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 52, opacity: 0.07 }}>◫</div>
        <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>Select an item from the left panel</p>
      </div>
    );
  }

  return (
    <div
      style={{ flex: 1, background: "#EAEAF2", overflowY: "auto", display: "flex", flexDirection: "column" }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false); }}
      onDrop={handleCanvasDrop}
    >
     
      <div style={{ padding: "10px 20px", background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280", flexShrink: 0 }}>
        <span style={{ fontWeight: 700, color: "#1e293b" }}>{page.title || page.name || "Untitled"}</span>
        <span style={{ color: "#d1d5db" }}>›</span>
        <span>Canvas</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: 8 }}>
          {content.length} block{content.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ flex: 1, padding: 20, maxWidth: 800, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {content.length === 0 ? (
          <div style={{ minHeight: 200, border: `2px dashed ${isDragOver ? "#6366f1" : "#c4c4d4"}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, background: isDragOver ? "rgba(99,102,241,0.04)" : "transparent", transition: "all 0.2s" }}>
            <span style={{ fontSize: 28, opacity: 0.18 }}>⊕</span>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Drag a component from the left panel</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {content.map((block, index) => {
              const meta = COMPONENT_META[block.__component] || { label: block.__component, icon: "◻", color: "#64748b" };
              const isSelected = selectedBlock?._clientId === block._clientId;
              const isDragging = dragIndex === index;
              const isOver = overIndex === index && dragIndex !== index;

              return (
                <div
                  key={block._clientId || index}
                  draggable
                  onDragStart={(e) => handleBlockDragStart(e, index)}
                  onDragOver={(e) => handleBlockDragOver(e, index)}
                  onDrop={(e) => handleBlockDrop(e, index)}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                  onClick={() => onSelectBlock(isSelected ? null : block)}
                  style={{
                    borderRadius: 10,
                    border: isSelected ? `2px solid ${meta.color}` : isOver ? "2px dashed #6366f1" : "2px solid transparent",
                    background: "#fff",
                    boxShadow: isSelected ? `0 0 0 3px ${meta.color}22` : "0 1px 3px rgba(0,0,0,0.07)",
                    opacity: isDragging ? 0.35 : 1,
                    cursor: "pointer", overflow: "hidden",
                    transition: "border 0.15s, box-shadow 0.15s, opacity 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", padding: "6px 10px", gap: 7, background: isSelected ? `${meta.color}0d` : "#fafafa", borderBottom: "1px solid #f1f5f9", userSelect: "none" }}>
                    <span style={{ color: "#b0b8c8", cursor: "grab", fontSize: 13 }}>⠿</span>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: isSelected ? meta.color : "#64748b" }}>{meta.label}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveBlock(block._clientId); }}
                      style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: 13, lineHeight: 1, padding: "2px 5px", borderRadius: 4 }}
                      onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.color = "#d1d5db"}
                      title="Remove"
                    >✕</button>
                  </div>
                  <div style={{ padding: 10 }}>
                    <BlockSkeleton block={block} />
                  </div>
                </div>
              );
            })}
            <div style={{ border: `2px dashed ${isDragOver ? "#6366f1" : "#d1d5db"}`, borderRadius: 10, padding: 16, textAlign: "center", color: "#aab0bc", fontSize: 11, background: isDragOver ? "rgba(99,102,241,0.03)" : "transparent", transition: "all 0.2s" }}>
              Drop more components here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}