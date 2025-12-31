"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/state/store";
import type { Deal } from "@/lib/validators";

type DealListItemProps = {
  deal: Deal;
  isSelected: boolean;
};

export default function DealListItem({ deal, isSelected }: DealListItemProps) {
  const selectDeal = useAppStore((s) => s.selectDeal);
  const cloneDeal = useAppStore((s) => s.cloneDeal);
  const deleteDeal = useAppStore((s) => s.deleteDeal);
  const updateDeal = useAppStore((s) => s.updateDeal);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(deal.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Focus input when renaming
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleSelect = () => {
    if (!isRenaming) {
      selectDeal(deal.id);
    }
  };

  const handleRename = () => {
    setIsRenaming(true);
    setIsMenuOpen(false);
  };

  const handleRenameSubmit = () => {
    updateDeal(deal.id, { name: newName.trim() });
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setNewName(deal.name);
    setIsRenaming(false);
  };

  const handleDuplicate = () => {
    cloneDeal(deal.id);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    const displayName = deal.name.trim() || "Untitled Deal";
    const confirmed = window.confirm(
      `Are you sure you want to delete "${displayName}"? This action cannot be undone.`
    );
    if (confirmed) {
      deleteDeal(deal.id);
    }
    setIsMenuOpen(false);
  };

  // Format contract term
  const contractTerm =
    deal.contractLengthType === "MONTH_TO_MONTH"
      ? "M2M"
      : deal.contractLengthType === "MONTHS"
      ? `${deal.contractMonths}mo`
      : `${deal.contractYears}yr`;

  return (
    <div
      className={`
        group relative px-3 py-2.5 cursor-pointer transition-all
        border-l-[3px] hover:bg-white/[0.04]
        ${isSelected
          ? "border-l-cyan-400 bg-cyan-500/[0.08]"
          : "border-l-transparent"
        }
      `}
      onClick={handleSelect}
    >
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRenameSubmit();
            } else if (e.key === "Escape") {
              handleRenameCancel();
            }
          }}
          placeholder="Deal Name"
          className="w-full px-2 py-1 text-sm font-semibold text-white bg-white/10 border border-cyan-400/50 rounded outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${isSelected ? "text-white font-semibold" : "text-white/90"} ${!deal.name.trim() ? "italic text-white/40" : ""}`}>
                {deal.name.trim() || "Untitled Deal"}
              </div>
              <div className="text-xs text-white/50 mt-0.5">
                {deal.products.length} {deal.products.length === 1 ? "product" : "products"} • {contractTerm}
              </div>
            </div>

            {/* Kebab Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`
                  p-1 hover:bg-white/10 rounded transition-all duration-200
                  ${isMenuOpen ? "opacity-100 bg-white/10" : "opacity-0 group-hover:opacity-100"}
                `}
                aria-label="More options"
              >
                <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 16 16">
                  <circle cx="8" cy="3" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="8" cy="13" r="1.5" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-[#0A0F1C] border border-white/20 rounded-lg shadow-2xl z-[100] py-1 animate-slideInTop">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-white/90 hover:bg-white/10 transition-colors duration-150"
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-white/90 hover:bg-white/10 transition-colors duration-150"
                  >
                    Duplicate
                  </button>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-300 hover:bg-red-500/10 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
