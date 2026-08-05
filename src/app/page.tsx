import Image from "next/image";
import Link from "next/link";

const editorNav = [
  { icon: "◉", label: "Estilo", active: true },
  { icon: "↗", label: "Links" },
  { icon: "Aa", label: "Fontes" },
  { icon: "✦", label: "Efeitos" },
  { icon: "⚙", label: "Config." },
];

const previewLinks = [
  { icon: "▶", label: "Assista ao meu último vídeo", featured: true },
  { icon: "↗", label: "Meus links e recomendações" },
  { icon: "▤", label: "E-book gratuito: Comece aqui" },
  { icon: "♧", label: "Grupo exclusivo da comunidade" },
  { icon: "✉", label: "Entre em contato comigo" },
];

const examples = [
  {
    initials: "MA",
    name: "Marina Alves",
    role: "Fotografia & direção criativa",
    handle: "chainlinks.me/marina",
    theme: "example-violet",
    links: ["Portfólio 2026", "Agende seu ensaio", "Bastidores no Instagram"],
  },
  {
    initials: "RC",
    name: "Rafa Costa",
    role: "Treino, rotina & conteúdo",
    handle: "chainlinks.me/rafacosta",
    theme: "example-lime",
    links: ["Meu programa online", "Vídeos novos", "Fale comigo"],
  },
  {
    initials: "NS",
    name: "Nina Souza",
    role: "Design & produtos digitais",
    handle: "chainlinks.me/ninasouza",
    theme: "example-coral",
    links: [
      "Conheça meu trabalho",
      "Templates gratuitos",
      "Newsletter semanal",
    ],
  },
];

const faqs = [
  {
    question: "Preciso saber programar?",
    answer:
      "Não. Todo o visual é configurado pelo painel: você escolhe cores, fontes, imagens e efeitos e acompanha o resultado na mesma hora.",
  },
  {
    question: "Minha página funciona no celular?",
    answer:
      "Sim. O layout se adapta automaticamente a celulares, tablets e computadores para que seus links continuem fáceis de acessar em qualquer tela.",
  },
  {
    question: "Posso alterar a página depois de publicar?",
    answer:
      "Pode. Você edita, reorganiza ou desativa links quando quiser e publica a nova versão sem precisar recriar sua página.",
  },
  {
    question: "É possível começar sem cartão?",
    answer:
      "Sim. Você pode criar a primeira versão gratuitamente e explorar o editor antes de decidir por qualquer recurso adicional.",
  },
];

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="ChainLinks — início">
      <Image
        src="/logo-mark.png"
        alt=""
        width={44}
        height={44}
        className="brand-mark"
        priority
      />
      <span>ChainLinks</span>
    </a>
  );
}

function EditorDemo() {
  return (
    <div className="editor-scene" id="demonstracao">
      <div className="editor-callout editor-callout-colors" aria-hidden="true">
        Cores
      </div>
      <div className="editor-callout editor-callout-fonts" aria-hidden="true">
        Fontes
      </div>
      <div className="editor-callout editor-callout-hover" aria-hidden="true">
        Hover
      </div>

      <div className="editor-window">
        <div className="editor-topbar">
          <div className="editor-title">
            <span className="editor-back" aria-hidden="true">
              ←
            </span>
            <strong>Editor visual</strong>
          </div>
          <div className="editor-devices" aria-hidden="true">
            <span>▣</span>
            <span>▯</span>
          </div>
          <div className="editor-publish-group">
            <span className="history-controls" aria-hidden="true">
              ↶&nbsp;&nbsp;↷
            </span>
            <button className="publish-button" type="button">
              Publicar <span aria-hidden="true">⌄</span>
            </button>
          </div>
        </div>

        <div className="editor-body">
          <nav
            className="editor-rail"
            aria-label="Ferramentas do editor demonstrativo"
          >
            {editorNav.map((item) => (
              <button
                className={
                  item.active ? "editor-nav-item is-active" : "editor-nav-item"
                }
                type="button"
                key={item.label}
                aria-label={item.label}
              >
                <span aria-hidden="true">{item.icon}</span>
                <small>{item.label}</small>
              </button>
            ))}
          </nav>

          <div className="editor-controls-panel">
            <fieldset className="control-card color-card">
              <legend>Cores</legend>
              <p>Fundo</p>
              <div className="swatch-row">
                <label className="swatch swatch-bg-1">
                  <input
                    aria-label="Fundo preto"
                    type="radio"
                    name="demo-background"
                    defaultChecked
                  />
                  <span>Preto</span>
                </label>
                <label className="swatch swatch-bg-2">
                  <input
                    aria-label="Fundo verde"
                    type="radio"
                    name="demo-background"
                  />
                  <span>Verde</span>
                </label>
                <label className="swatch swatch-bg-3">
                  <input
                    aria-label="Fundo claro"
                    type="radio"
                    name="demo-background"
                  />
                  <span>Claro</span>
                </label>
              </div>
              <p>Primária</p>
              <div className="swatch-row accent-swatches">
                <label className="swatch swatch-accent-1">
                  <input
                    aria-label="Cor esmeralda"
                    type="radio"
                    name="demo-accent"
                    defaultChecked
                  />
                  <span>Esmeralda</span>
                </label>
                <label className="swatch swatch-accent-2">
                  <input
                    aria-label="Cor menta"
                    type="radio"
                    name="demo-accent"
                  />
                  <span>Menta</span>
                </label>
                <label className="swatch swatch-accent-3">
                  <input
                    aria-label="Cor azul"
                    type="radio"
                    name="demo-accent"
                  />
                  <span>Azul</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="control-card font-card">
              <legend>Fontes</legend>
              <label className="select-label">
                Título
                <select defaultValue="manrope" aria-label="Fonte do título">
                  <option value="manrope">Manrope ExtraBold</option>
                  <option value="serif">Instrument Serif</option>
                </select>
              </label>
              <label className="select-label">
                Texto
                <select defaultValue="manrope" aria-label="Fonte do texto">
                  <option value="manrope">Manrope Regular</option>
                  <option value="mono">Geist Mono</option>
                </select>
              </label>
            </fieldset>

            <fieldset className="control-card hover-card">
              <legend>Efeitos de hover</legend>
              <div className="effect-grid">
                <label>
                  <input
                    aria-label="Sem efeito"
                    type="radio"
                    name="demo-effect"
                  />
                  <span>
                    ∅<small>Nenhum</small>
                  </span>
                </label>
                <label>
                  <input
                    aria-label="Efeito de elevação"
                    type="radio"
                    name="demo-effect"
                  />
                  <span>
                    ▰<small>Elevação</small>
                  </span>
                </label>
                <label>
                  <input
                    aria-label="Efeito de borda"
                    type="radio"
                    name="demo-effect"
                    defaultChecked
                  />
                  <span>
                    ▭<small>Borda</small>
                  </span>
                </label>
              </div>
              <div className="duration-row">
                <span>Duração</span>
                <span className="duration-track" aria-hidden="true">
                  <i />
                </span>
                <strong>300ms</strong>
              </div>
            </fieldset>
          </div>

          <div className="preview-workspace">
            <article
              className="link-page-preview"
              aria-label="Prévia da página de Lucas Ferreira"
            >
              <div className="preview-profile">
                <div className="profile-avatar" aria-hidden="true">
                  LF
                  <span />
                </div>
                <h2>Lucas Ferreira</h2>
                <p>Criador de conteúdo</p>
                <div className="profile-socials" aria-label="Redes sociais">
                  <span>◎</span>
                  <span>↗</span>
                  <span>▶</span>
                  <span>✦</span>
                </div>
              </div>

              <div className="preview-links">
                {previewLinks.map((link) => (
                  <a
                    className={
                      link.featured
                        ? "preview-link is-featured"
                        : "preview-link"
                    }
                    href="#recursos"
                    key={link.label}
                  >
                    <span className="preview-link-icon" aria-hidden="true">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    <span aria-hidden="true">›</span>
                  </a>
                ))}
              </div>
              <p className="preview-signature">
                Feito com <strong>ChainLinks</strong>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <div className="ambient-grid" aria-hidden="true" />

      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#recursos">Recursos</a>
          <a href="#exemplos">Exemplos</a>
          <a href="#precos">Preços</a>
        </nav>
        <div className="header-actions">
          <Link className="login-link" href="/login">
            Entrar
          </Link>
          <Link className="button button-small button-primary" href="/register">
            Criar minha página
          </Link>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Abrir menu">☰</summary>
          <nav aria-label="Menu mobile">
            <a href="#recursos">Recursos</a>
            <a href="#exemplos">Exemplos</a>
            <a href="#precos">Preços</a>
            <Link href="/login">Entrar</Link>
            <Link className="button button-primary" href="/register">
              Criar minha página
            </Link>
          </nav>
        </details>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Sua página. Sua identidade.</p>
          <h1>
            Um único link.
            <span>Totalmente seu.</span>
          </h1>
          <p className="hero-description">
            Crie uma página de links com a sua identidade — personalize cores,
            fontes e efeitos em minutos, sem precisar programar.
          </p>
          <div className="hero-actions">
            <Link
              className="button button-primary button-large"
              href="/register"
            >
              Começar grátis
            </Link>
            <a
              className="button button-secondary button-large"
              href="#demonstracao"
            >
              <span className="play-dot" aria-hidden="true">
                ▶
              </span>
              Ver demonstração
            </a>
          </div>
          <p className="hero-note">
            <span aria-hidden="true">✓</span> Sem cartão <i>•</i> Pronto em
            minutos
          </p>
        </div>

        <EditorDemo />
      </section>

      <section className="trust-strip" aria-label="Benefícios principais">
        <article>
          <span className="trust-icon" aria-hidden="true">
            ◇
          </span>
          <div>
            <strong>Seguro e confiável</strong>
            <p>Seus dados protegidos</p>
          </div>
        </article>
        <article>
          <span className="trust-icon" aria-hidden="true">
            ϟ
          </span>
          <div>
            <strong>Rápido e fácil</strong>
            <p>Pronto em poucos minutos</p>
          </div>
        </article>
        <article>
          <span className="trust-icon" aria-hidden="true">
            ♧
          </span>
          <div>
            <strong>Criado para creators</strong>
            <p>Simplicidade que entrega</p>
          </div>
        </article>
      </section>

      <section className="section features-section" id="recursos">
        <div className="section-heading section-heading-centered">
          <p className="section-kicker">Tudo no mesmo painel</p>
          <h2>O seu estilo, em cada detalhe.</h2>
          <p>
            Uma experiência simples para criar, organizar e publicar uma página
            que realmente tem a sua cara.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card feature-card-editor">
            <div className="feature-copy">
              <span className="feature-number">01</span>
              <h3>Editor visual em tempo real</h3>
              <p>
                Teste combinações, compare resultados e veja cada mudança antes
                de publicar.
              </p>
            </div>
            <div className="mini-editor" aria-hidden="true">
              <div className="mini-editor-top">
                <i />
                <i />
                <i />
                <span>Preview ao vivo</span>
              </div>
              <div className="mini-editor-body">
                <div className="mini-controls">
                  <span className="mini-control-title">Sua identidade</span>
                  <div className="mini-color-row">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className="mini-field">
                    Manrope Bold <b>⌄</b>
                  </span>
                  <span className="mini-field">
                    Borda suave <b>⌄</b>
                  </span>
                  <span className="mini-slider">
                    <i />
                  </span>
                </div>
                <div className="mini-page">
                  <div className="mini-avatar">L</div>
                  <strong>Seu nome aqui</strong>
                  <small>Conteúdo que conecta</small>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </article>

          <article className="feature-card feature-card-links">
            <span className="feature-icon" aria-hidden="true">
              ↗
            </span>
            <h3>Links sem complicação</h3>
            <p>Adicione, reorganize e ative cada destino com poucos cliques.</p>
            <div className="link-stack" aria-hidden="true">
              <span>
                <i>⋮⋮</i> Meu portfólio <b>●</b>
              </span>
              <span>
                <i>⋮⋮</i> Último vídeo <b>●</b>
              </span>
              <span>
                <i>⋮⋮</i> Fale comigo <b>●</b>
              </span>
            </div>
          </article>

          <article className="feature-card feature-card-url">
            <span className="feature-icon" aria-hidden="true">
              ⌁
            </span>
            <h3>Um endereço só seu</h3>
            <p>Escolha um link curto, memorável e pronto para compartilhar.</p>
            <div className="url-preview" aria-hidden="true">
              <span>chainlinks.me/</span>
              <strong>seuusuario</strong>
              <i>✓</i>
            </div>
          </article>

          <article className="feature-card feature-card-device">
            <div className="feature-copy">
              <span className="feature-number">04</span>
              <h3>Bonita em qualquer tela</h3>
              <p>
                Seu conteúdo se adapta de forma automática, do celular ao
                desktop.
              </p>
            </div>
            <div className="device-stage" aria-hidden="true">
              <div className="device-card device-desktop">
                <i />
                <span />
                <span />
                <span />
              </div>
              <div className="device-card device-mobile">
                <i />
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section steps-section">
        <div className="section-heading steps-heading">
          <p className="section-kicker">Do zero ao ar</p>
          <h2>Três passos. Uma página pronta.</h2>
        </div>
        <ol className="steps-list">
          <li>
            <span>01</span>
            <div>
              <h3>Escolha seu endereço</h3>
              <p>Defina o nome que as pessoas vão lembrar e compartilhar.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Personalize o visual</h3>
              <p>Combine cores, tipografia, imagens, ícones e movimentos.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Publique e compartilhe</h3>
              <p>
                Coloque o link na bio e atualize sua página sempre que precisar.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="section examples-section" id="exemplos">
        <div className="section-heading examples-heading">
          <div>
            <p className="section-kicker">Feita para ser diferente</p>
            <h2>Uma ChainLinks para cada história.</h2>
          </div>
          <p>
            Comece com uma estrutura clara e transforme tudo até ficar
            exatamente do seu jeito.
          </p>
        </div>

        <div className="examples-grid">
          {examples.map((example) => (
            <article
              className={`example-shell ${example.theme}`}
              key={example.name}
            >
              <div className="example-browser-bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>{example.handle}</p>
              </div>
              <div className="example-page">
                <div className="example-avatar">{example.initials}</div>
                <h3>{example.name}</h3>
                <p>{example.role}</p>
                <div className="example-socials" aria-hidden="true">
                  <span>◎</span>
                  <span>↗</span>
                  <span>▶</span>
                </div>
                <div className="example-links">
                  {example.links.map((link, index) => (
                    <span
                      className={index === 0 ? "is-primary" : ""}
                      key={link}
                    >
                      {link}
                      <b>›</b>
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section pricing-section" id="precos">
        <div className="pricing-copy">
          <p className="section-kicker">Comece sem compromisso</p>
          <h2>Seu próximo clique começa aqui.</h2>
          <p>
            Monte sua primeira página, teste o editor visual e publique quando
            estiver do seu jeito.
          </p>
          <ul>
            <li>
              <span>✓</span> Editor visual completo
            </li>
            <li>
              <span>✓</span> Página responsiva
            </li>
            <li>
              <span>✓</span> Links organizáveis
            </li>
            <li>
              <span>✓</span> Atualizações quando quiser
            </li>
          </ul>
        </div>

        <article className="price-card">
          <div className="price-card-glow" aria-hidden="true" />
          <p>ChainLinks Starter</p>
          <h3>
            Grátis <span>para começar</span>
          </h3>
          <p className="price-description">
            Crie sua página e conheça o fluxo completo sem precisar cadastrar um
            cartão.
          </p>
          <Link className="button button-primary button-large" href="/register">
            Criar minha página
          </Link>
          <small>Leva poucos minutos para ficar online.</small>
        </article>
      </section>

      <section className="section faq-section">
        <div className="section-heading faq-heading">
          <p className="section-kicker">Dúvidas frequentes</p>
          <h2>Antes de começar.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                {faq.question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section final-cta" id="comecar">
        <div className="final-cta-grid" aria-hidden="true" />
        <p className="section-kicker">Sua bio merece mais</p>
        <h2>Um link. Todas as suas possibilidades.</h2>
        <p>Crie uma página profissional, bonita e totalmente sua.</p>
        <div className="final-cta-actions">
          <Link className="button button-primary button-large" href="/register">
            Começar grátis
          </Link>
          <a
            className="button button-secondary button-large"
            href="#demonstracao"
          >
            Explorar o editor
          </a>
        </div>
        <small>Sem cartão. Sem código. Sem complicação.</small>
      </section>

      <footer className="site-footer" id="entrar">
        <Brand />
        <p>Seu conteúdo, do seu jeito.</p>
        <nav aria-label="Links do rodapé">
          <a href="#recursos">Recursos</a>
          <a href="#exemplos">Exemplos</a>
          <a href="#precos">Preços</a>
          <a href="#inicio">Voltar ao topo ↑</a>
        </nav>
        <small>© 2026 ChainLinks. Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
