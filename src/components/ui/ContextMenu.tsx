"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronRight } from "lucide-react";

/* ── Keyframes (einmalig global injiziert) ── */
let keyframesInjected = false;
function ensureKeyframes(): void {
  if (keyframesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = "@keyframes ctx-menu-in{from{opacity:0}to{opacity:1}}";
  document.head.appendChild(style);
  keyframesInjected = true;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
  shortcut?: string;
  children?: ContextMenuItem[];
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  trigger: ReactNode;
  onAction?: (id: string) => void;
  className?: string;
}

export type { ContextMenuItem as ContextMenuItemType, ContextMenuProps as ContextMenuPropsType };

interface MenuPosition {
  x: number;
  y: number;
}

const DATA_ATTR = "data-ctx-menu";

const panelClasses =
  "fixed z-[60] min-w-48 rounded-xl py-1 " +
  "border border-glass/60 dark:border-glass/10 " +
  "bg-(--surface-overlay) " +
  "bg-linear-to-br from-glass/80 via-glass/60 to-glass/40 " +
  "dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 " +
  "shadow-xl shadow-black/10 dark:shadow-black/40";

const itemBase =
  "flex items-center gap-2 px-3 py-2 text-sm text-(--text) transition-colors cursor-pointer " +
  "hover:bg-glass/50 dark:hover:bg-glass/8";

const itemHighlighted =
  "flex items-center gap-2 px-3 py-2 text-sm text-(--text) transition-colors cursor-pointer " +
  "bg-primary-500/10 dark:bg-primary-400/15";

const itemDisabled =
  "flex items-center gap-2 px-3 py-2 text-sm text-(--text) opacity-40 cursor-not-allowed";

function clampPosition(
  x: number,
  y: number,
  menuWidth: number,
  menuHeight: number
): MenuPosition {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: x + menuWidth > vw ? vw - menuWidth - 4 : x,
    y: y + menuHeight > vh ? vh - menuHeight - 4 : y,
  };
}

function getNavigableIndices(items: ContextMenuItem[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!items[i].separator && !items[i].disabled) {
      indices.push(i);
    }
  }
  return indices;
}

/* ─────────────────────────────────────────────────────────
 * SubMenu – jedes Panel wird separat via Portal gerendert,
 * damit backdrop-filter keinen Containing Block erzeugt.
 * ───────────────────────────────────────────────────────── */

function SubMenu({
  items,
  position,
  onAction,
  onClose,
  depth,
}: {
  items: ContextMenuItem[];
  position: MenuPosition;
  onAction?: (id: string) => void;
  onClose: () => void;
  depth: number;
}): React.ReactElement | null {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);
  const [submenuPos, setSubmenuPos] = useState<MenuPosition>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState<MenuPosition>(position);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const clamped = clampPosition(position.x, position.y, rect.width, rect.height);
    if (clamped.x !== position.x || clamped.y !== position.y) {
      setAdjustedPos(clamped);
    }
  }, [position]);

  const computeSubmenuPos = useCallback(
    (index: number): MenuPosition => {
      if (!menuRef.current) return { x: adjustedPos.x + 200, y: adjustedPos.y };
      const rect = menuRef.current.getBoundingClientRect();
      const itemElements = menuRef.current.querySelectorAll("[data-menu-item]");
      const itemEl = itemElements[index] as HTMLElement | undefined;
      const itemTop = itemEl ? itemEl.getBoundingClientRect().top : adjustedPos.y;
      const submenuX = rect.right;
      const vw = window.innerWidth;
      const flippedX = submenuX + 192 > vw ? rect.left - 192 : submenuX;
      return { x: flippedX, y: itemTop };
    },
    [adjustedPos]
  );

  const openSubmenu = useCallback(
    (index: number): void => {
      setSubmenuPos(computeSubmenuPos(index));
      setOpenSubmenuIndex(index);
    },
    [computeSubmenuPos]
  );

  const closeSubmenu = useCallback((): void => {
    setOpenSubmenuIndex(null);
  }, []);

  const navigableIndices = getNavigableIndices(items);

  const handleItemClick = useCallback(
    (item: ContextMenuItem): void => {
      if (item.disabled || item.separator) return;
      if (item.children && item.children.length > 0) return;
      item.action?.();
      onAction?.(item.id);
      onClose();
    },
    [onAction, onClose]
  );

  const handleItemMouseEnter = useCallback(
    (index: number): void => {
      setHighlightedIndex(index);
      const item = items[index];

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      if (item.children && item.children.length > 0 && !item.disabled) {
        hoverTimeoutRef.current = setTimeout(() => {
          openSubmenu(index);
        }, 150);
      } else {
        closeSubmenu();
      }
    },
    [items, openSubmenu, closeSubmenu]
  );

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (navigableIndices.length === 0) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          e.stopPropagation();
          const currentNavIdx = navigableIndices.indexOf(highlightedIndex);
          const nextNavIdx =
            currentNavIdx === -1 || currentNavIdx >= navigableIndices.length - 1
              ? 0
              : currentNavIdx + 1;
          setHighlightedIndex(navigableIndices[nextNavIdx]);
          closeSubmenu();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          e.stopPropagation();
          const currentNavIdx = navigableIndices.indexOf(highlightedIndex);
          const prevNavIdx =
            currentNavIdx <= 0
              ? navigableIndices.length - 1
              : currentNavIdx - 1;
          setHighlightedIndex(navigableIndices[prevNavIdx]);
          closeSubmenu();
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          e.stopPropagation();
          if (highlightedIndex >= 0) {
            const item = items[highlightedIndex];
            if (item.children && item.children.length > 0 && !item.disabled) {
              openSubmenu(highlightedIndex);
            }
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          e.stopPropagation();
          if (depth > 0) {
            onClose();
          }
          break;
        }
        case "Enter": {
          e.preventDefault();
          e.stopPropagation();
          if (highlightedIndex >= 0) {
            const item = items[highlightedIndex];
            if (item.children && item.children.length > 0 && !item.disabled) {
              openSubmenu(highlightedIndex);
            } else {
              handleItemClick(item);
            }
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        }
      }
    },
    [highlightedIndex, navigableIndices, items, depth, onClose, handleItemClick, openSubmenu, closeSubmenu]
  );

  useEffect(() => {
    if (menuRef.current && depth === 0) {
      menuRef.current.focus();
    }
  }, [depth]);

  if (typeof document === "undefined") return null;

  const panel = (
    <div
      ref={menuRef}
      role="menu"
      tabIndex={-1}
      className={panelClasses}
      {...{ [DATA_ATTR]: "" }}
      style={{
        left: adjustedPos.x,
        top: adjustedPos.y,
        animation: "ctx-menu-in 0.12s ease-out",
      }}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return (
            <div
              key={item.id}
              className="h-px bg-glass/20 dark:bg-glass/8 my-1"
              role="separator"
            />
          );
        }

        const isHighlighted = highlightedIndex === index;
        const hasChildren = !!(item.children && item.children.length > 0);

        let itemClassName: string;
        if (item.disabled) {
          itemClassName = itemDisabled;
        } else if (isHighlighted) {
          itemClassName = itemHighlighted;
        } else {
          itemClassName = itemBase;
        }

        return (
          <div key={item.id}>
            <div
              data-menu-item=""
              role="menuitem"
              aria-disabled={item.disabled || undefined}
              aria-haspopup={hasChildren || undefined}
              aria-expanded={hasChildren && openSubmenuIndex === index ? true : undefined}
              className={itemClassName}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemMouseEnter(index)}
            >
              {item.icon && (
                <span className="size-4 shrink-0 text-(--text-muted) flex items-center justify-center">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs text-(--text-muted)">
                  {item.shortcut}
                </span>
              )}
              {hasChildren && (
                <ChevronRight
                  className="size-4 shrink-0 text-(--text-muted) ml-auto"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Child-SubMenus werden NICHT im DOM des Eltern-Panels gerendert.
          Stattdessen portalen wir sie separat, damit backdrop-filter
          keinen Containing Block für position:fixed erzeugt. */}
    </div>
  );

  /* Offene Submenüs als separate Portale */
  const childSubmenu =
    openSubmenuIndex !== null &&
    items[openSubmenuIndex]?.children &&
    items[openSubmenuIndex].children!.length > 0
      ? createPortal(
          <SubMenu
            items={items[openSubmenuIndex].children!}
            position={submenuPos}
            onAction={onAction}
            onClose={closeSubmenu}
            depth={depth + 1}
          />,
          document.body
        )
      : null;

  /* depth > 0 SubMenus werden ebenfalls geportalt (vom Eltern-SubMenu aus).
     depth === 0 wird bereits vom ContextMenu-Wrapper geportalt. */
  if (depth > 0) {
    return createPortal(
      <>
        {panel}
        {childSubmenu}
      </>,
      document.body
    ) as React.ReactElement;
  }

  return (
    <>
      {panel}
      {childSubmenu}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
 * ContextMenu – Hauptkomponente
 * ───────────────────────────────────────────────────────── */

export function ContextMenu({
  items,
  trigger,
  onAction,
  className = "",
}: ContextMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setOpen(true);
    },
    []
  );

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      // Klick innerhalb irgendeines Menü-Panels → ignorieren
      if (target.closest(`[${DATA_ATTR}]`)) return;
      // Klick auf Trigger → ignorieren (wird von onContextMenu behandelt)
      if (triggerRef.current?.contains(target)) return;
      closeMenu();
    }

    function handleEscape(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        closeMenu();
      }
    }

    function handleScroll(): void {
      closeMenu();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, closeMenu]);

  const handleAction = useCallback(
    (id: string): void => {
      onAction?.(id);
      closeMenu();
    },
    [onAction, closeMenu]
  );

  useEffect(() => {
    if (open) ensureKeyframes();
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className={className}
      >
        {trigger}
      </div>
      {open &&
        createPortal(
          <SubMenu
            items={items}
            position={position}
            onAction={handleAction}
            onClose={closeMenu}
            depth={0}
          />,
          document.body
        )}
    </>
  );
}
