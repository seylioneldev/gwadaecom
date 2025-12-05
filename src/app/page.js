"use client";

// ==========================================================
// FICHIER : PAGE.JS (L'assembleur principal de la page d'accueil)
// RÔLE : Importe tous les composants et définit leur ordre d'affichage.
// ==========================================================

// 1. IMPORT DES COMPOSANTS (La clé de l'architecture propre)
// Ces chemins pointent vers les dossiers que nous avons créés :
import Header from "../components/layout/Header"; // Le haut de page (menu)
import Hero from "../components/layout/Hero"; // La bannière d'accueil
import Footer from "../components/layout/Footer"; // Le pied de page
import ProductGrid from "../components/products/ProductGrid"; // La grille de produits
import AdminFloatingButton from "../components/AdminFloatingButton"; // Bouton d'accès admin (visible uniquement pour le propriétaire)
import { useSettings } from "@/context/SettingsContext";

export default function Home() {
  const { settings } = useSettings();

  const defaultLayout = [
    { id: "hero", type: "hero", enabled: true },
    { id: "infoStrip", type: "infoStrip", enabled: true },
    { id: "story", type: "story", enabled: true },
    { id: "newsletter", type: "newsletter", enabled: true },
    { id: "productGrid", type: "productGrid", enabled: true },
  ];

  const layoutFromSettings = settings?.homepage?.layout;
  const buildHomepageLayout = (savedLayout) => {
    if (!Array.isArray(savedLayout) || savedLayout.length === 0) {
      return defaultLayout;
    }

    const defaultByType = new Map(
      defaultLayout.map((block) => [block.type, block])
    );

    const seenTypes = new Set();
    const normalized = [];

    savedLayout.forEach((block) => {
      if (!block || !block.type) return;
      if (seenTypes.has(block.type)) return;

      const defaultBlock = defaultByType.get(block.type) || {
        id: block.id || block.type,
        type: block.type,
        enabled: true,
      };

      normalized.push({
        ...defaultBlock,
        ...block,
        id: block.id || defaultBlock.id || block.type,
        enabled: block.enabled === false ? false : true,
      });

      seenTypes.add(block.type);
    });

    defaultLayout.forEach((defaultBlock) => {
      if (!seenTypes.has(defaultBlock.type)) {
        normalized.push(defaultBlock);
      }
    });

    return normalized;
  };

  const layout = buildHomepageLayout(layoutFromSettings);

  const homepageBlocksStyles = settings?.customStyles?.homepageBlocks || {};

  const infoStripBgColor = homepageBlocksStyles.infoStripBgColor || "#f5f5f5";
  const infoStripBgImageUrl = homepageBlocksStyles.infoStripBgImageUrl || "";
  const infoStripBgBlur = homepageBlocksStyles.infoStripBgBlur ?? 0;
  const infoStripBgDarken = homepageBlocksStyles.infoStripBgDarken ?? 0;

  const storyBgColor = homepageBlocksStyles.storyBgColor || "#ffffff";
  const storyBgImageUrl = homepageBlocksStyles.storyBgImageUrl || "";
  const storyBgBlur = homepageBlocksStyles.storyBgBlur ?? 0;
  const storyBgDarken = homepageBlocksStyles.storyBgDarken ?? 0;

  const newsletterBgColor = homepageBlocksStyles.newsletterBgColor || "#f7f3ec";
  const newsletterBgImageUrl = homepageBlocksStyles.newsletterBgImageUrl || "";
  const newsletterBgBlur = homepageBlocksStyles.newsletterBgBlur ?? 0;
  const newsletterBgDarken = homepageBlocksStyles.newsletterBgDarken ?? 0;

  const infoStripText =
    settings?.homepage?.infoStripText ||
    "Livraison offerte dès 50€ • Retours sous 30 jours • Paiement sécurisé";
  const storyTitle =
    settings?.homepage?.storyTitle || "L'artisanat de Guadeloupe";
  const storyText =
    settings?.homepage?.storyText ||
    "Chaque pièce est imaginée et fabriquée avec soin sur l'île, en petites séries, pour mettre en valeur le savoir-faire local et les matières naturelles.";
  const newsletterTitle =
    settings?.homepage?.newsletterTitle || "Rester informé des nouveautés";
  const newsletterSubtitle =
    settings?.homepage?.newsletterSubtitle ||
    "Recevez en avant-première les nouvelles collections et les ventes privées.";
  const newsletterCtaLabel =
    settings?.homepage?.newsletterCtaLabel || "S'inscrire";
  const newsletterPlaceholder =
    settings?.homepage?.newsletterPlaceholder || "Votre email";

  const renderBlock = (block) => {
    if (block.enabled === false) {
      return null;
    }

    const key = block.id || block.type;

    if (block.type === "hero") {
      return <Hero key={key} />;
    }

    if (block.type === "productGrid") {
      return <ProductGrid key={key} />;
    }

    if (block.type === "infoStrip") {
      return (
        <InfoStrip
          key={key}
          text={infoStripText}
          bgColor={infoStripBgColor}
          bgImageUrl={infoStripBgImageUrl}
          bgBlur={infoStripBgBlur}
          bgDarken={infoStripBgDarken}
        />
      );
    }

    if (block.type === "story") {
      return (
        <StorySection
          key={key}
          title={storyTitle}
          text={storyText}
          bgColor={storyBgColor}
          bgImageUrl={storyBgImageUrl}
          bgBlur={storyBgBlur}
          bgDarken={storyBgDarken}
        />
      );
    }

    if (block.type === "newsletter") {
      return (
        <NewsletterBlock
          key={key}
          title={newsletterTitle}
          subtitle={newsletterSubtitle}
          ctaLabel={newsletterCtaLabel}
          placeholder={newsletterPlaceholder}
          bgColor={newsletterBgColor}
          bgImageUrl={newsletterBgImageUrl}
          bgBlur={newsletterBgBlur}
          bgDarken={newsletterBgDarken}
        />
      );
    }

    return null;
  };

  return (
    // <main> est le conteneur principal de la page.
    // 'flex flex-col' assure que les éléments s'empilent verticalement.
    // Le fond global est géré par DynamicStyles via la balise <body>.
    <main className="min-h-screen flex flex-col">
      {/* 1. Haut de page - Affiche le composant Header */}
      <Header />

      {/* 2. Bannière - Affiche le composant Hero */}
      {/* 3. Contenu principal - Affiche le composant ProductGrid */}
      {layout.map((block) => renderBlock(block))}

      {/* 4. Bas de page - Affiche le composant Footer */}
      <Footer />

      {/* 5. Bouton flottant admin - Visible uniquement pour le propriétaire (mode dev) */}
      <AdminFloatingButton />
    </main>
  );
}

function InfoStrip({ text, bgColor, bgImageUrl, bgBlur, bgDarken }) {
  const hasImage = typeof bgImageUrl === "string" && bgImageUrl.trim() !== "";
  const blur = Number(bgBlur) || 0;
  const darken = Number(bgDarken) || 0;
  const overlayAlpha = Math.min(Math.max(darken / 100, 0), 0.85);

  return (
    <section
      className="relative overflow-hidden py-4 px-4 md:px-8 text-xs text-center tracking-[0.2em] text-gray-600 uppercase"
      style={!hasImage ? { backgroundColor: bgColor } : undefined}
    >
      {hasImage && (
        <>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: blur ? `blur(${blur}px)` : undefined,
              transform: blur ? "scale(1.05)" : undefined,
            }}
          />
          {overlayAlpha > 0 && (
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})`,
              }}
            />
          )}
        </>
      )}

      <div className="relative z-10">{text}</div>
    </section>
  );
}

function StorySection({ title, text, bgColor, bgImageUrl, bgBlur, bgDarken }) {
  const hasImage = typeof bgImageUrl === "string" && bgImageUrl.trim() !== "";
  const blur = Number(bgBlur) || 0;
  const darken = Number(bgDarken) || 0;
  const overlayAlpha = Math.min(Math.max(darken / 100, 0), 0.85);

  return (
    <section
      className="relative overflow-hidden py-12 px-4 md:px-8 text-center text-gray-800"
      style={!hasImage ? { backgroundColor: bgColor } : undefined}
    >
      {hasImage && (
        <>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: blur ? `blur(${blur}px)` : undefined,
              transform: blur ? "scale(1.05)" : undefined,
            }}
          />
          {overlayAlpha > 0 && (
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})`,
              }}
            />
          )}
        </>
      )}

      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-serif mb-4 tracking-widest text-[#5d6e64]">
          {title}
        </h2>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 leading-relaxed">
          {text}
        </p>
      </div>
    </section>
  );
}

function NewsletterBlock({
  title,
  subtitle,
  ctaLabel,
  placeholder,
  bgColor,
  bgImageUrl,
  bgBlur,
  bgDarken,
}) {
  const hasImage = typeof bgImageUrl === "string" && bgImageUrl.trim() !== "";
  const blur = Number(bgBlur) || 0;
  const darken = Number(bgDarken) || 0;
  const overlayAlpha = Math.min(Math.max(darken / 100, 0), 0.85);

  return (
    <section
      className="relative overflow-hidden py-12 px-4 md:px-8 text-center text-gray-800"
      style={!hasImage ? { backgroundColor: bgColor } : undefined}
    >
      {hasImage && (
        <>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: blur ? `blur(${blur}px)` : undefined,
              transform: blur ? "scale(1.05)" : undefined,
            }}
          />
          {overlayAlpha > 0 && (
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})`,
              }}
            />
          )}
        </>
      )}

      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-serif mb-3 tracking-widest text-[#5d6e64]">
          {title}
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-base text-gray-600 mb-4">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            className="flex-1 border border-gray-300 px-4 py-2 text-sm"
            placeholder={placeholder}
          />
          <button className="px-6 py-2 bg-[#5d6e64] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#4a5850] transition">
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
