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
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { settings } = useSettings();
  const { isAdmin } = useAuth();

  const defaultLayout = [
    { id: "hero", type: "hero", enabled: true },
    { id: "infoStrip", type: "infoStrip", enabled: true },
    { id: "story", type: "story", enabled: true },
    { id: "newsletter", type: "newsletter", enabled: true },
    { id: "productGrid", type: "productGrid", enabled: true },
    { id: "imageBlock", type: "imageBlock", enabled: true },
    { id: "testimonials", type: "testimonials", enabled: true },
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

  const imageBlockBgColor = homepageBlocksStyles.imageBlockBgColor || "#ffffff";
  const imageBlockBgImageUrl = homepageBlocksStyles.imageBlockBgImageUrl || "";
  const imageBlockBgBlur = homepageBlocksStyles.imageBlockBgBlur ?? 0;
  const imageBlockBgDarken = homepageBlocksStyles.imageBlockBgDarken ?? 0;

  const testimonialsBgColor = homepageBlocksStyles.testimonialsBgColor || "#f9fafb";
  const testimonialsBgImageUrl = homepageBlocksStyles.testimonialsBgImageUrl || "";
  const testimonialsBgBlur = homepageBlocksStyles.testimonialsBgBlur ?? 0;
  const testimonialsBgDarken = homepageBlocksStyles.testimonialsBgDarken ?? 0;

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

  const imageBlockImageUrl =
    settings?.homepage?.imageBlockImageUrl || "";
  const imageBlockTitle =
    settings?.homepage?.imageBlockTitle || "Nos créations artisanales";
  const imageBlockSubtitle =
    settings?.homepage?.imageBlockSubtitle || "Découvrez l'authenticité de nos produits faits main";

  const testimonialsTitle =
    settings?.homepage?.testimonialsTitle || "Ils nous font confiance";
  const testimonialsItems = settings?.homepage?.testimonialsItems || [
    {
      name: "Marie D.",
      text: "Des bijoux magnifiques et de grande qualité. Je recommande !",
      rating: 5,
    },
    {
      name: "Sophie L.",
      text: "Un savoir-faire exceptionnel, chaque pièce est unique.",
      rating: 5,
    },
    {
      name: "Julien M.",
      text: "Livraison rapide et produits conformes à la description.",
      rating: 5,
    },
  ];

  const renderBlock = (block, index) => {
    if (block.enabled === false) {
      return null;
    }

    const key = block.id || block.type;

    const debugNumberMap = {
      hero: 2,
      infoStrip: 3,
      story: 4,
      newsletter: 5,
      productGrid: 6,
      imageBlock: 7,
      testimonials: 8,
    };

    const debugNumber = debugNumberMap[block.type];

    const wrapWithDebug = (node) => (
      <section key={key} className="relative">
        {isAdmin && debugNumber != null && (
          <div className="absolute top-2 left-2 z-30">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-semibold shadow">
              {debugNumber}
            </span>
          </div>
        )}
        {node}
      </section>
    );

    if (block.type === "hero") {
      return wrapWithDebug(<Hero />);
    }

    if (block.type === "productGrid") {
      return wrapWithDebug(<ProductGrid />);
    }

    if (block.type === "infoStrip") {
      return wrapWithDebug(
        <InfoStrip
          text={infoStripText}
          bgColor={infoStripBgColor}
          bgImageUrl={infoStripBgImageUrl}
          bgBlur={infoStripBgBlur}
          bgDarken={infoStripBgDarken}
        />
      );
    }

    if (block.type === "story") {
      return wrapWithDebug(
        <StorySection
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
      return wrapWithDebug(
        <NewsletterBlock
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

    if (block.type === "imageBlock") {
      return wrapWithDebug(
        <ImageBlock
          imageUrl={imageBlockImageUrl}
          title={imageBlockTitle}
          subtitle={imageBlockSubtitle}
          bgColor={imageBlockBgColor}
          bgImageUrl={imageBlockBgImageUrl}
          bgBlur={imageBlockBgBlur}
          bgDarken={imageBlockBgDarken}
        />
      );
    }

    if (block.type === "testimonials") {
      return wrapWithDebug(
        <TestimonialsBlock
          title={testimonialsTitle}
          items={testimonialsItems}
          bgColor={testimonialsBgColor}
          bgImageUrl={testimonialsBgImageUrl}
          bgBlur={testimonialsBgBlur}
          bgDarken={testimonialsBgDarken}
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
      {layout.map((block, index) => renderBlock(block, index))}

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
      className="relative overflow-hidden py-4 px-4 md:px-8 text-xs text-center tracking-[0.2em] text-white uppercase"
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

      <div className="relative z-10 text-white">{text}</div>
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
        <h2 className="text-xl md:text-2xl font-serif mb-3 tracking-widest text-white">
          {title}
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-base text-white/90 mb-6">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            className="flex-1 border-2 border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder-white/60 focus:border-[#D4AF37] focus:outline-none transition-all"
            placeholder={placeholder}
            suppressHydrationWarning
          />
          <button className="px-8 py-3 bg-[#D4AF37] text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C19B2B] hover:shadow-lg transition-all">
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

function ImageBlock({
  imageUrl,
  title,
  subtitle,
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
      className="relative overflow-hidden py-16 px-4 md:px-8"
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 tracking-wide text-[#5d6e64]">
              {title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div className="order-1 md:order-2">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsBlock({
  title,
  items,
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
      className="relative overflow-hidden py-16 px-4 md:px-8"
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif mb-12 text-center tracking-widest text-[#5d6e64]">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex mb-3">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm italic mb-4">"{item.text}"</p>
              <p className="text-gray-900 font-semibold text-sm">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
