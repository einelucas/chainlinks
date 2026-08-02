import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-white flex flex-col">
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">
            L
          </div>
          <span className="font-semibold">LinkPage</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-neutral-400 hover:text-white transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium transition"
          >
            Criar minha página
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="inline-block px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 text-xs mb-6">
          Sua página de links, do seu jeito
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl leading-tight">
          Um único link.{" "}
          <span className="text-emerald-400">Totalmente seu.</span>
        </h1>
        <p className="text-neutral-400 max-w-md mt-5 text-sm sm:text-base">
          Crie sua página de links em minutos. Cores, fontes, imagens, ícones
          e efeitos de hover — tudo customizável direto no painel, sem
          precisar programar.
        </p>
        <div className="flex gap-3 mt-8">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm transition"
          >
            Começar grátis
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-neutral-700 hover:border-neutral-500 text-sm transition"
          >
            Já tenho conta
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-20 max-w-3xl w-full text-left">
          {[
            {
              title: "Editor visual",
              desc: "Troque cores, fontes, imagens e efeitos de hover em tempo real, com preview ao vivo.",
            },
            {
              title: "Links ilimitados",
              desc: "Adicione, reordene com drag-and-drop e ative/desative links quando quiser.",
            },
            {
              title: "Sua URL",
              desc: "Compartilhe seusite.com/seu-usuario em qualquer rede social.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
            >
              <p className="font-medium text-sm mb-1.5">{f.title}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-xs text-neutral-600 py-6">
        Feito com Next.js
      </footer>
    </div>
  );
}
