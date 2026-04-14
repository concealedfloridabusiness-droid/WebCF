import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import cfLogo from "@assets/CF_1760659391842.png";

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface SubItem {
  path: string;
  label: string;
}

interface MenuItem {
  path: string;
  label: string;
  sub?: SubItem[];
}

interface NavDropdownProps {
  label: string;
  navigateTo: string;
  items: MenuItem[];
  isActive: boolean;
}

/* ─── Anchor-aware navigation helper ──────────────────────────────────────── */
/**
 * Navigates to a path that may contain a hash fragment.
 * If already on the target page, scrolls immediately.
 * If navigating to a new page, waits for the route to mount then scrolls.
 */
function goToAnchor(
  navigate: (to: string) => void,
  currentPath: string,
  targetPath: string,
  onDone?: () => void,
) {
  const hashIdx = targetPath.indexOf("#");
  if (hashIdx === -1) {
    navigate(targetPath);
    onDone?.();
    return;
  }
  const basePath = targetPath.slice(0, hashIdx);
  const sectionId = targetPath.slice(hashIdx + 1);

  const scrollTo = () => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (currentPath === basePath) {
    scrollTo();
  } else {
    navigate(basePath);
    // Give the new page time to mount before scrolling
    setTimeout(scrollTo, 350);
  }
  onDone?.();
}

/* ─── NavDropdown component ─────────────────────────────────────────────── */

function NavDropdown({ label, navigateTo, items, isActive }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setOpenSub(null);
    }, 120);
  }

  function closeAll() {
    setOpen(false);
    setOpenSub(null);
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Button
        variant={isActive ? "default" : "secondary"}
        size="sm"
        data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}-dropdown`}
        onClick={() => navigate(navigateTo)}
      >
        {label}
      </Button>

      {/* Primary dropdown panel */}
      <div
        className={`absolute top-full left-0 mt-1 w-56 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-[10000] transition-all duration-100 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {items.map((item) => {
          const itemHasHash = item.path.includes("#");

          return (
            <div
              key={item.label}
              onMouseEnter={() => setOpenSub(item.sub ? item.label : null)}
            >
              {/* Level-1 item row */}
              {itemHasHash ? (
                <button
                  data-testid={`nav-dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full text-left"
                  onClick={() => goToAnchor(navigate, location, item.path, closeAll)}
                >
                  {item.label}
                </button>
              ) : (
                <Link href={item.path}>
                  <a
                    data-testid={`nav-dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
                    onClick={closeAll}
                  >
                    {item.label}
                    {item.sub && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-150 ${
                          openSub === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>
                </Link>
              )}

              {/* Level-2 sub-items */}
              {item.sub && openSub === item.label && (
                <div className="ml-4 border-l-2 border-gray-700 pb-1">
                  {item.sub.map((sub) => {
                    const subHasHash = sub.path.includes("#");
                    return subHasHash ? (
                      <button
                        key={sub.path}
                        data-testid={`nav-sub-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-left"
                        onClick={() => goToAnchor(navigate, location, sub.path, closeAll)}
                      >
                        {sub.label}
                      </button>
                    ) : (
                      <Link key={sub.path} href={sub.path}>
                        <a
                          data-testid={`nav-sub-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}
                          className="flex items-center px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                          onClick={closeAll}
                        >
                          {sub.label}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────────────────────── */

export default function Header() {
  const [location] = useLocation();

  const leftNavItems = [
    { path: "/", label: "Home" },
  ];

  const rightNavItems = [
    { path: "/contact", label: "Contact" },
  ];

  const weAreReadyActive =
    location === "/we-are-ready" ||
    location === "/fitness" ||
    location === "/first-aid" ||
    location.startsWith("/preparedness") ||
    location === "/fitness/male" ||
    location === "/fitness/female" ||
    location.startsWith("/first-aid/") ||
    location.startsWith("/training/firearm");

  const weAreWatchingActive =
    location === "/we-are-watching" ||
    location.startsWith("/we-are-watching/");

  const weAreHidingActive = location === "/we-are-hiding";

  /* ── We Are Ready nav items ──────────────────────────────────────────── */
  const weAreReadyItems: MenuItem[] = [
    {
      path: "/fitness",
      label: "Training",
      sub: [
        { path: "/fitness/male",      label: "Men's Fitness"    },
        { path: "/fitness/female",    label: "Women's Fitness"  },
        { path: "/training/firearm",  label: "Firearm Training" },
      ],
    },
    {
      path: "/first-aid",
      label: "First Aid & Skills",
      sub: [
        { path: "/first-aid/kit/basic",    label: "Personal Kit"  },
        { path: "/first-aid/kit/medium",   label: "Standard Kit"  },
        { path: "/first-aid/kit/advanced", label: "Advanced Kit"  },
      ],
    },
    {
      path: "/preparedness",
      label: "Preparedness",
      sub: [
        { path: "/preparedness/planning",       label: "Planning"       },
        { path: "/preparedness/prepping",        label: "Prepping"       },
        { path: "/preparedness/communication",   label: "Communication"  },
      ],
    },
  ];

  /* ── We Are Watching nav items ───────────────────────────────────────── */
  const weAreWatchingItems: MenuItem[] = [
    { path: "/we-are-watching/map", label: "Situation Room" },
    {
      path: "/we-are-watching/news",
      label: "Liberty Watch",
      sub: [
        { path: "/we-are-watching/news#we-are-ready-videos", label: "We Are Ready Videos" },
        { path: "/we-are-watching/news#featured-channels",   label: "Featured Channels"   },
      ],
    },
    { path: "/we-are-watching/awareness", label: "Situational Awareness" },
  ];

  /* ── We Are Hiding nav items ─────────────────────────────────────────── */
  const weAreHidingItems: MenuItem[] = [
    { path: "/we-are-hiding/holsters", label: "Holsters & Carry"     },
    { path: "/we-are-hiding/edc-gear", label: "EDC Gear"             },
    { path: "/we-are-hiding/clothing", label: "Clothing & Blending In" },
  ];

  return (
    <header className="border-b border-gray-800 bg-black sticky top-0 z-[9999]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/">
            <a className="flex items-center gap-4 hover:opacity-80 transition-opacity" data-testid="link-home-logo">
              <img
                src={cfLogo}
                alt="CF Logo"
                className="h-12 w-auto object-contain"
                data-testid="img-cf-logo"
              />
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Concealed Florida
              </h1>
            </a>
          </Link>

          <nav className="flex flex-wrap gap-2 items-center">
            {leftNavItems.map((item) => (
              <Button
                key={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                variant={location === item.path ? "default" : "secondary"}
                size="sm"
                asChild
              >
                <Link href={item.path}>
                  <a>{item.label}</a>
                </Link>
              </Button>
            ))}

            <NavDropdown
              label="We Are Ready"
              navigateTo="/we-are-ready"
              items={weAreReadyItems}
              isActive={weAreReadyActive}
            />

            <NavDropdown
              label="We Are Watching"
              navigateTo="/we-are-watching"
              items={weAreWatchingItems}
              isActive={weAreWatchingActive}
            />

            <NavDropdown
              label="We Are Hiding in Plain Sight"
              navigateTo="/we-are-hiding"
              items={weAreHidingItems}
              isActive={weAreHidingActive}
            />

            {rightNavItems.map((item) => (
              <Button
                key={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                variant={location === item.path ? "default" : "secondary"}
                size="sm"
                asChild
              >
                <Link href={item.path}>
                  <a>{item.label}</a>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
