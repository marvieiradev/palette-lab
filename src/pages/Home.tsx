import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Color, SavedPalette, TokenKey } from "../types/appTypes";
import {
  accessibleText,
  contrastRatio,
  DEFAULT_COLORS,
  readableText,
  rgbLabel,
  toHex,
  TOKEN_KEYS,
  TOKEN_LABELS,
} from "../constants/appConstants";
import { EXAMPLES } from "../constants/examples";
import { makeTokens } from "../functions/makeTokens";
import { extractPalette } from "../functions/extractPalette";
import { downloadFile } from "../functions/downloadFile";
import { downloadSvgAsPng } from "../functions/downloadSvgAsPng";
import { buildExportSvg } from "../functions/buildExportSvg";
import { SectionHeading } from "../components/SectionHeading";
import { Pill } from "../components/Pill";
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  Copy,
  Download,
  Droplets,
  FileImage,
  Heart,
  Home as HomeIcon,
  ImagePlus,
  Layers3,
  Menu,
  MousePointer2,
  Palette,
  Pipette,
  Plus,
  Search,
  Sparkles,
  Smartphone,
  SlidersHorizontal,
  Star,
  Upload,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSource, setImageSource] = useState(EXAMPLES[0].src);
  const [imageName, setImageName] = useState(EXAMPLES[0].name);
  const [palette, setPalette] = useState<Color[]>(
    DEFAULT_COLORS.map((hex) => ({ hex, rgb: rgbLabel(hex) })),
  );
  const [tokens, setTokens] = useState<Record<TokenKey, string>>(() =>
    makeTokens(DEFAULT_COLORS.map((hex) => ({ hex, rgb: rgbLabel(hex) }))),
  );
  const [pickerActive, setPickerActive] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("palette-lab:saved") ?? "[]",
      ) as SavedPalette[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxWidth = 1200;
      const scale = Math.min(1, maxWidth / image.naturalWidth);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const extracted = extractPalette(
        context.getImageData(0, 0, canvas.width, canvas.height),
      );
      if (extracted.length >= 5) {
        setPalette(extracted);
        setTokens(makeTokens(extracted));
      }
    };
    image.src = imageSource;
  }, [imageSource]);

  useEffect(() => {
    localStorage.setItem(
      "palette-lab:latest",
      JSON.stringify({ palette, tokens, imageName }),
    );
    localStorage.setItem("palette-lab:saved", JSON.stringify(savedPalettes));
  }, [palette, tokens, imageName, savedPalettes]);

  const mobileText = readableText(tokens.background);
  const buttonText = readableText(tokens.primary);
  const cardText = readableText(tokens.card);
  const heroText = accessibleText([tokens.primary, tokens.secondary]);
  const heroButtonText = accessibleText([heroText]);
  const mobileMuted = accessibleText([tokens.card]);
  const headerActionText = accessibleText([tokens.card]);
  const selectedCount = palette.length;

  const loadImage = (source: string, name: string) => {
    setImageSource(source);
    setImageName(name);
    setPickerActive(false);
  };

  const handleFile = (file?: File) => {
    if (!file || !file.type.match(/^image\/(png|jpeg|webp)$/)) {
      toast.error("Escolha uma imagem PNG, JPG ou WEBP.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => loadImage(String(reader.result), file.name);
    reader.readAsDataURL(file);
  };

  const addColor = (hex: string) => {
    const normalized = hex.toUpperCase();
    const color = { hex: normalized, rgb: rgbLabel(normalized) };
    setPalette((current) =>
      [color, ...current.filter((item) => item.hex !== normalized)].slice(0, 8),
    );
    toast.success(`${normalized} adicionada à paleta`);
  };

  const pickColor = async () => {
    if (window.EyeDropper) {
      try {
        const result = await new window.EyeDropper().open();
        addColor(result.sRGBHex);
        return;
      } catch {
        setPickerActive(false);
        return;
      }
    }
    setPickerActive((active) => !active);
    toast.info("Clique em qualquer ponto da imagem para capturar a cor.");
  };

  const handleCanvasPick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pickerActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(
      ((event.clientX - rect.left) / rect.width) * canvas.width,
    );
    const y = Math.round(
      ((event.clientY - rect.top) / rect.height) * canvas.height,
    );
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const pixel = context.getImageData(x, y, 1, 1).data;
    addColor(toHex(pixel[0], pixel[1], pixel[2]));
    setPickerActive(false);
  };

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1200);
      toast.success(`${label} copiado`);
    } catch {
      toast.error("Não foi possível copiar neste navegador.");
    }
  };

  const cssTokens = `:root {\n  --background: ${tokens.background};\n  --primary: ${tokens.primary};\n  --secondary: ${tokens.secondary};\n  --card: ${tokens.card};\n  --text: ${tokens.text};\n}`;
  const jsonTokens = JSON.stringify(
    {
      ...tokens,
      contrast: {
        textOnBackground: `${contrastRatio(mobileText, tokens.background).toFixed(2)}:1`,
        textOnPrimary: `${contrastRatio(buttonText, tokens.primary).toFixed(2)}:1`,
      },
    },
    null,
    2,
  );
  const exportSvg = buildExportSvg(palette, tokens);

  const saveCurrentPalette = () => {
    const saved = {
      id: crypto.randomUUID(),
      name: imageName || "Paleta sem nome",
      colors: palette.map((color) => color.hex),
      createdAt: new Date().toISOString(),
    };
    setSavedPalettes((current) => [saved, ...current].slice(0, 5));
    toast.success("Paleta salva localmente");
  };

  const loadSavedPalette = (saved: SavedPalette) => {
    const colors = saved.colors.map((hex) => ({ hex, rgb: rgbLabel(hex) }));
    setPalette(colors);
    setTokens(makeTokens(colors));
    toast.success(`${saved.name} carregada`);
  };

  const exportAsSvg = () => {
    downloadFile("palette-lab-export.svg", exportSvg, "image/svg+xml");
    toast.success("Exportação SVG baixada");
  };

  const exportAsPng = () => {
    downloadSvgAsPng("palette-lab-export.png", exportSvg, 1000, 760);
    toast.success("Exportação PNG gerada");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Palette Lab início">
          <span className="brand-mark">
            <Palette size={18} strokeWidth={2.4} />
          </span>
          <span>
            <strong>Palette</strong>
            <em>Lab</em>
          </span>
        </a>
        <nav className="topnav" aria-label="Navegação principal">
          <a href="#extract">Extrair</a>
          <a href="#preview">Prévia</a>
          <a href="#tokens">Fichas</a>
        </nav>
        <div className="topbar-actions">
          <Pill teal>
            <span className="status-dot" /> 100% offline
          </Pill>
          <button
            className="icon-button"
            onClick={saveCurrentPalette}
            title="Salvar paleta localmente"
            aria-label="Salvar paleta"
          >
            <Star size={17} />
          </button>
        </div>
      </header>

      <main className="container app-content" id="top">
        <section className="intro-row">
          <div>
            <div className="eyebrow-line">
              <span className="kicker-dot" /> WORKSPACE DE CORES{" "}
              <span className="slash">/</span> SALVO LOCALMENTE
            </div>
            <h1>
              Encontre a inspiração
              <br />
              <span>dentro da imagem.</span>
            </h1>
            <p className="intro-copy">
              Extraia cores dominantes, transforme-as em fichas e teste a
              interface no mesmo instante. Sem upload. Sem ruído.
            </p>
          </div>
          <div className="intro-meta">
            <div className="meta-card">
              <Sparkles size={16} />
              <span>
                <strong>Canvas API</strong>
                <small>quantização local</small>
              </span>
            </div>
            <div className="meta-card">
              <Layers3 size={16} />
              <span>
                <strong>WCAG AA</strong>
                <small>contraste automático</small>
              </span>
            </div>
          </div>
        </section>

        <div className="workspace">
          <section className="left-column" id="extract">
            <div className="panel image-panel">
              <div className="panel-head">
                <SectionHeading
                  eyebrow="01 / ORIGEM"
                  title="Tela da imagem"
                  icon={<FileImage size={17} />}
                />
                <Pill>
                  <span className="mini-live" /> {imageName}
                </Pill>
              </div>
              <div
                className={`drop-zone ${dragActive ? "drag-active" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  handleFile(event.dataTransfer.files[0]);
                }}
              >
                <canvas
                  ref={canvasRef}
                  className={`image-canvas ${pickerActive ? "picker-cursor" : ""}`}
                  onClick={handleCanvasPick}
                  aria-label="Imagem para extração de cores"
                />
                <div className="canvas-overlay">
                  <span className="canvas-badge">
                    <MousePointer2 size={13} />{" "}
                    {pickerActive ? "Clique para capturar" : "Canvas ativo"}
                  </span>
                  <span className="canvas-size">
                    {pickerActive ? "PICK MODE" : "RGBA / 1200px"}
                  </span>
                </div>
              </div>
              <div className="upload-row">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <button
                  className="button-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} /> Enviar imagem{" "}
                  <span className="button-hint">⌘ U</span>
                </button>
                <button
                  className={`button-ghost ${pickerActive ? "active" : ""}`}
                  onClick={pickColor}
                >
                  <Pipette size={16} /> Capturar cor
                </button>
                <span className="drop-caption">
                  PNG, JPG, WEBP <span>·</span> max 10 MB
                </span>
              </div>
            </div>

            <div className="panel examples-panel">
              <div className="panel-head compact">
                <SectionHeading
                  eyebrow="EXEMPLOS"
                  title="Referências visuais"
                  icon={<ImagePlus size={17} />}
                />
                <span className="muted-note">4 imagens offline</span>
              </div>
              <div className="examples-grid">
                {EXAMPLES.map((example, index) => (
                  <button
                    className={`example-card ${imageName === example.name ? "selected" : ""}`}
                    key={example.name}
                    onClick={() => loadImage(example.src, example.name)}
                  >
                    <img src={example.src} alt="" />
                    <span className="example-index">0{index + 1}</span>
                    <span className="example-label">
                      <strong>{example.name}</strong>
                      <small>{example.meta}</small>
                    </span>
                    {imageName === example.name && (
                      <span className="selected-mark">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {savedPalettes.length > 0 && (
              <div className="panel saved-panel">
                <div className="saved-head">
                  <div>
                    <span className="eyebrow">COLEÇÕES LOCAIS</span>
                    <h3>Paletas salvas</h3>
                  </div>
                  <span className="saved-count">
                    {savedPalettes.length} / 5
                  </span>
                </div>
                <div className="saved-list">
                  {savedPalettes.map((saved) => (
                    <button
                      key={saved.id}
                      className="saved-item"
                      onClick={() => loadSavedPalette(saved)}
                    >
                      <span className="saved-swatches">
                        {saved.colors.slice(0, 5).map((hex) => (
                          <i key={hex} style={{ background: hex }} />
                        ))}
                      </span>
                      <span>
                        {saved.name}
                        <small>
                          {new Date(saved.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </small>
                      </span>
                      <ChevronDown size={15} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="right-column">
            <div className="panel palette-panel">
              <div className="panel-head">
                <SectionHeading
                  eyebrow="02 / EXTRAÍDO"
                  title="Paleta dominante"
                  icon={<Droplets size={17} />}
                />
                <div className="palette-actions">
                  <span className="color-count">{selectedCount} cores</span>
                  <button className="text-button" onClick={saveCurrentPalette}>
                    <Plus size={14} /> Salvar
                  </button>
                </div>
              </div>
              <div className="swatch-grid">
                {palette.map((color, index) => (
                  <motion.button
                    layout
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="swatch"
                    key={`${color.hex}-${index}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() =>
                      copyText(`${color.hex}\n${color.rgb}`, "HEX + RGB")
                    }
                    title={`Copiar ${color.hex}`}
                  >
                    <span
                      className={`swatch-info ${readableText(color.hex) === "#FFFFFF" ? "light" : "dark"}`}
                    >
                      <strong>{color.hex}</strong>
                      <small>{color.rgb}</small>
                    </span>
                    <span className="swatch-copy">
                      {copied === `${color.hex}\n${color.rgb}` ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </span>
                  </motion.button>
                ))}
                {palette.length < 8 && (
                  <button className="add-swatch" onClick={pickColor}>
                    <Plus size={18} />
                    <span>Adicionar cor</span>
                  </button>
                )}
              </div>
              <p className="panel-footnote">
                <WandSparkles size={14} /> Quantização 'Median Cut' simplificada{" "}
                <span>·</span> tudo processado no browser
              </p>
            </div>

            <div className="panel token-panel" id="tokens">
              <div className="panel-head">
                <SectionHeading
                  eyebrow="03 / MAPEAMENTO DE CORES"
                  title="Ficha de cores"
                  icon={<SlidersHorizontal size={17} />}
                />
                <span className="aa-badge">
                  <Check size={13} /> AA pronto
                </span>
              </div>
              <div className="token-list">
                {TOKEN_KEYS.map((key) => (
                  <div className="token-row" key={key}>
                    <div className="token-name">
                      <span
                        className="token-dot"
                        style={{ background: tokens[key] }}
                      />
                      <span>
                        <strong>{TOKEN_LABELS[key].label}</strong>
                        <small>{TOKEN_LABELS[key].detail}</small>
                      </span>
                    </div>
                    <div className="token-select-wrap">
                      <select
                        value={tokens[key]}
                        onChange={(event) =>
                          setTokens((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        aria-label={`Cor do token ${TOKEN_LABELS[key].label}`}
                      >
                        {palette.map((color) => (
                          <option value={color.hex} key={`${key}-${color.hex}`}>
                            {color.hex} · {color.rgb}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="export-row">
                <button
                  className="button-ghost"
                  onClick={() => copyText(cssTokens, "CSS variables")}
                >
                  <Copy size={15} /> Copiar CSS
                </button>
                <button
                  className="button-ghost"
                  onClick={() => copyText(jsonTokens, "JSON tokens")}
                >
                  <Copy size={15} /> Copiar JSON
                </button>
                <button
                  className="button-icon-teal"
                  onClick={() =>
                    downloadFile("palette-tokens.json", jsonTokens)
                  }
                  title="Baixar JSON"
                  aria-label="Baixar JSON"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="panel preview-wrap" id="preview">
              <div className="preview-heading">
                <div>
                  <span className="eyebrow">04 / PRÉVIA</span>
                  <h2>Interface móvel</h2>
                </div>
                <div className="preview-actions">
                  <button className="button-ghost" onClick={exportAsSvg}>
                    <Download size={14} /> SVG
                  </button>
                  <button className="button-primary" onClick={exportAsPng}>
                    <Download size={14} /> PNG
                  </button>
                  <Pill teal>
                    <span className="pulse-dot" /> tempo real
                  </Pill>
                </div>
              </div>
              <div className="phone-stage">
                <motion.div
                  className="phone"
                  layout
                  style={
                    {
                      background: tokens.background,
                      color: mobileText,
                      ["--mobile-card" as string]: tokens.card,
                      ["--mobile-secondary" as string]: tokens.secondary,
                      ["--mobile-primary" as string]: tokens.primary,
                      ["--mobile-primary-text" as string]: buttonText,
                      ["--mobile-muted" as string]: mobileMuted,
                    } as React.CSSProperties
                  }
                >
                  <div className="phone-island" />
                  <div className="phone-status">
                    <span>9:41</span>
                    <span className="phone-status-icons">
                      <span /> <span /> <span />
                    </span>
                  </div>
                  <div className="phone-content">
                    <div className="phone-header">
                      <div
                        className="app-avatar"
                        style={{
                          background: tokens.secondary,
                          color: readableText(tokens.secondary),
                        }}
                      >
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <strong>Orbit</strong>
                        <small style={{ color: mobileText }}>
                          Bom dia, Alex
                        </small>
                      </div>
                      <button
                        style={{
                          color: headerActionText,
                          background: tokens.card,
                        }}
                      >
                        <Menu size={18} />
                      </button>
                    </div>
                    <div
                      className="phone-hero"
                      style={{
                        background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.secondary})`,
                        color: heroText,
                      }}
                    >
                      <div>
                        <small>SELECIONADAS PARA VOCÊ</small>
                        <strong>
                          Abra espaço
                          <br />
                          para ideias melhores.
                        </strong>
                        <button
                          style={{
                            background: heroText,
                            color: heroButtonText,
                          }}
                        >
                          Explorar <ArrowDownToLine size={13} />
                        </button>
                      </div>
                      <div className="hero-orbit">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                    <div
                      className="phone-search"
                      style={{ color: mobileMuted, background: tokens.card }}
                    >
                      <Search size={15} />
                      <span>Buscar produtos...</span>
                      <button
                        style={{
                          background: tokens.primary,
                          color: buttonText,
                        }}
                      >
                        <SlidersHorizontal size={14} />
                      </button>
                    </div>
                    <div className="phone-section-title">
                      <strong>O foco de hoje</strong>
                      <span
                        style={{
                          color: buttonText,
                          background: tokens.primary,
                        }}
                      >
                        Ver todos
                      </span>
                    </div>
                    <div
                      className="phone-card"
                      style={{ background: tokens.card, color: cardText }}
                    >
                      <div
                        className="card-icon"
                        style={{
                          background: tokens.primary,
                          color: buttonText,
                        }}
                      >
                        <Droplets size={16} />
                      </div>
                      <div>
                        <strong>Histórico de cores</strong>
                        <small style={{ color: cardText }}>
                          Explore 12 novas paletas de cores
                        </small>
                      </div>
                      <span
                        className="phone-badge"
                        style={{
                          color: buttonText,
                          background: tokens.primary,
                        }}
                      >
                        Novidade
                      </span>
                    </div>
                    <div
                      className="phone-card"
                      style={{ background: tokens.card, color: cardText }}
                    >
                      <div
                        className="card-icon"
                        style={{
                          background: tokens.secondary,
                          color: readableText(tokens.secondary),
                        }}
                      >
                        <Heart size={16} />
                      </div>
                      <div>
                        <strong>Saved inspiration</strong>
                        <small style={{ color: cardText }}>
                          4 coleções de cores salvas
                        </small>
                      </div>
                      <span
                        className="phone-badge"
                        style={{
                          color: readableText(tokens.secondary),
                          background: tokens.secondary,
                        }}
                      >
                        4
                      </span>
                    </div>
                  </div>
                  <div
                    className="phone-nav"
                    style={{ background: tokens.card, color: cardText }}
                  >
                    <button
                      className="active"
                      style={{ color: buttonText, background: tokens.primary }}
                    >
                      <HomeIcon size={16} />
                      <small>Início</small>
                    </button>
                    <button>
                      <Search size={16} />
                      <small>Busca</small>
                    </button>
                    <button>
                      <Heart size={16} />
                      <small>Salvos</small>
                    </button>
                    <button>
                      <UserRound size={16} />
                      <small>Perfil</small>
                    </button>
                  </div>
                </motion.div>
                <div className="phone-side-note">
                  <span className="note-line" />
                  <span>
                    <strong>Auto contraste</strong>
                    <small>
                      {contrastRatio(mobileText, tokens.background).toFixed(1)}
                      :1 on background
                    </small>
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="app-footer">
          <span>
            Palette Lab <i>·</i> versão 1.0.0
          </span>
          <span>
            <Smartphone size={14} /> projetado para designers
          </span>
          <span>
            Feito com <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>
    </div>
  );
}
