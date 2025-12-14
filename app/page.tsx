"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos.png"
              alt="Customer Journey"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-bold">Customer Journey</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex text-sm">
            <Link href="#features" className="hover:text-indigo-600">
              Fonctionnalités
            </Link>
            <Link href="#preview" className="hover:text-indigo-600">
              Aperçu
            </Link>
            <Link href="#pricing" className="hover:text-indigo-600">
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Nouveau • Assistant IA intégré
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Gérez vos relations clients{" "}
              <span className="text-indigo-600">intelligemment</span>.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Un CRM moderne qui réunit fiches clients, messagerie interne et
              agenda — avec des actions rapides en langage naturel pour créer
              tâches et événements.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/ai-assistant"
                className="rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
              >
                Démarrer gratuitement
              </Link>
              <Link
                href="#features"
                className="rounded-lg border px-5 py-3 hover:bg-gray-50"
              >
                Découvrir les fonctionnalités
              </Link>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Essai gratuit • Sans carte • Annulation à tout moment
            </p>
          </div>

          <div className="relative">
            <div className="mx-auto flex w-full items-center justify-center rounded-2xl border bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-12 shadow-sm">
              <div className="max-w-md text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Aperçu visuel
                </p>
                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  Votre flux, vos clients, vos tâches
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Ajoutez votre propre visuel ici. Nous affichons un panneau de
                  remplacement tant que l’illustration n’est pas fournie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-center text-3xl font-semibold">
            Tout ce qu’il faut pour votre équipe
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
            Centralisez vos données et gagnez du temps grâce à l’automatisation.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              title="Gestion clients"
              desc="Fiches complètes, recherche rapide, historique des interactions."
              icon="/icons/clients.png"
            />
            <Feature
              title="Assistant IA"
              desc="Créez tâches et événements en langage naturel, en un message."
              icon="/icons/ai.png"
            />
            <Feature
              title="Agenda collaboratif"
              desc="Tâches, rendez-vous, rappels et vues calendrier."
              icon="/icons/calendar.png"
            />
            <Feature
              title="Messagerie interne"
              desc="Conversations par équipe, mentions et pièces jointes."
              icon="/icons/message.png"
            />
          </div>
        </div>
      </section>

      {/* Preview / Dashboard */}
      <section id="preview">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">
                Un tableau de bord clair
              </h3>
              <p className="mt-3 text-gray-600">
                Suivez votre charge, vos projets, vos événements à venir et
                l’activité récente en un coup d’œil.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                <li>• Statut des clients et pipeline</li>
                <li>• Projets et tâches actives</li>
                <li>• Événements du calendrier</li>
                <li>• Flux d’activité de votre équipe</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 inline-block rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Voir un exemple de dashboard
              </Link>
            </div>
            <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-2xl border bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-10 shadow-sm">
              <div className="max-w-md text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Capture manquante
                </p>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">
                  Ajoutez une capture de votre dashboard
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Placez votre image dans public/illustrations et mettez à jour
                  le chemin si besoin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social proof */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-center text-sm text-gray-500">
            Ils nous font confiance
          </p>
          <div className="mt-6 grid grid-cols-2 items-center justify-items-center gap-6 opacity-80 sm:grid-cols-4">
            {["Helios", "Northwind", "Arcturus", "Bluehaven"].map((name) => (
              <div
                key={name}
                className="flex h-12 w-32 items-center justify-center rounded-lg border bg-white text-sm font-semibold text-gray-600 shadow-sm"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section id="pricing" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl bg-indigo-600 px-8 py-12 text-center text-white">
            <h3 className="text-2xl font-semibold">
              Prêt à améliorer votre relation client ?
            </h3>
            <p className="mt-2 text-indigo-100">
              Démarrez en quelques secondes et invitez votre équipe.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-white px-5 py-3 text-indigo-700 hover:bg-indigo-50"
              >
                Créer un compte gratuit
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-white/30 px-5 py-3 hover:bg-white/10"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-600 md:flex-row">
          <p>
            © {new Date().getFullYear()} Customer Journey. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="hover:text-indigo-600">
              Confidentialité
            </Link>
            <Link href="/legal/terms" className="hover:text-indigo-600">
              Conditions
            </Link>
            <Link href="/contact" className="hover:text-indigo-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --------- Petite carte “Feature” ---------- */
function Feature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <Image src={icon} alt="" width={28} height={28} />
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
