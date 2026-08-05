"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./AdminIcons";

const COOKIE_NAME = "chainlinks-admin-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function applyTheme(theme: "light" | "dark") {
  const root = document.querySelector<HTMLElement>(".admin-root");
  if (!root) return;
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
}

export default function ThemeToggle({ initialTheme }: { initialTheme: "light" | "dark" }) {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  useEffect(() => {
    // Primeira visita (sem cookie salvo ainda): segue a preferência do
    // sistema operacional e grava o cookie para as próximas renderizações
    // no servidor já virem no tema certo, sem flash. Escreve diretamente
    // no DOM/cookie (fonte externa ao React) em vez de depender de re-render.
    if (readCookie(COOKIE_NAME) === null) {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      writeCookie(COOKIE_NAME, prefersLight ? "light" : "dark");
      if (prefersLight) {
        applyTheme("light");
        // eslint-disable-next-line react-hooks/set-state-in-effect -- corrige o ícone para refletir a preferência do SO detectada só no cliente, quando ela diverge do padrão "dark" renderizado no servidor (sem cookie ainda salvo)
        setTheme("light");
      }
    }
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    writeCookie(COOKIE_NAME, next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="admin-icon-button admin-theme-toggle"
      aria-label={theme === "light" ? "Mudar para tema escuro" : "Mudar para tema claro"}
      title={theme === "light" ? "Tema escuro" : "Tema claro"}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
