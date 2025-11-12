"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Info } from "lucide-react";

/* -----------------------------------------------------------
   Wizard d'inscription - 4 étapes + succès
   Étape 1 : Email & Mot de passe
   Étape 2 : Profil utilisateur
   Étape 3 : Société
   Étape 4 : Vérification (code)
   Succès : Confirmation
   ----------------------------------------------------------- */

type Step = 1 | 2 | 3 | 4 | 5; // 5 = success

export default function RegisterWizard() {
    const [step, setStep] = useState<Step>(1);

    // --- États du formulaire (exemple minimal) ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const [companyName, setCompanyName] = useState("");
    const [companySize, setCompanySize] = useState("1-10");
    const [website, setWebsite] = useState("");

    const [code, setCode] = useState("");

    // --- Validations 
    // légères par étape ---
    const canGoNext = () => {
        if (step === 1) return email.includes("@") && password.length >= 8 && password === password2;
        if (step === 2) return fullName.trim().length > 2;
        if (step === 3) return companyName.trim().length > 1;
        if (step === 4) return code.trim().length >= 4;
        return true;
    };


    type Step = 1 | 2 | 3 | 4 | 5;

    const NEXT: Record<Step, Step> = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 5 };
    const PREV: Record<Step, Step> = { 1: 1, 2: 1, 3: 2, 4: 3, 5: 4 };

    const next = () => setStep((s) => NEXT[s]);
    const back = () => setStep((s) => PREV[s]);
    // Liste des étapes pour la colonne gauche
    const stepsMeta = [
        { id: 1, title: "Informations de connexion", hint: "Email et mot de passe" },
        { id: 2, title: "Profil", hint: "Nom et coordonnées" },
        { id: 3, title: "Entreprise", hint: "Nom & effectif" },
        { id: 4, title: "Vérification", hint: "Code reçu par email" },
    ] as const;

    // Composant puces d’étapes (colonne gauche)
    const StepItem = ({
        index,
        active,
        done,
        title,
        hint,
    }: {
        index: number;
        active: boolean;
        done: boolean;
        title: string;
        hint: string;
    }) => (
        <div
            className={`flex items-start gap-3 rounded-xl px-3 py-3 transition
      ${active ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/5"}`}
        >
            {done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div>
                <div className="text-sm font-semibold">Étape {index}: {title}</div>
                <div className="text-xs opacity-80">{hint}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 md:grid-cols-[300px_1fr]">
                {/* Colonne gauche : panneau bleu “Get started” */}
                <aside className="rounded-2xl bg-[#5A8DEE] p-5 text-white md:sticky md:top-6 md:self-start">
                    {/* Logo + titre produit */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-md bg-white p-2">
                            {/* Remplace /brand/logo.svg par ton logo dans /public */}
                            <Image src="/brand/logo.svg" alt="Logo" width={24} height={24} />
                        </div>
                        <div className="text-lg font-semibold">Woorkroom</div>
                    </div>

                    <div className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-90">
                        Démarrer
                    </div>

                    <div className="space-y-2">
                        {stepsMeta.map((s, i) => (
                            <StepItem
                                key={s.id}
                                index={i + 1}
                                active={step === s.id}
                                done={step > s.id}
                                title={s.title}
                                hint={s.hint}
                            />
                        ))}
                    </div>

                    <p className="mt-6 flex items-start gap-2 text-xs text-white/90">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        Toutes vos données restent privées et sont utilisées uniquement pour
                        créer votre espace de travail.
                    </p>
                </aside>

                {/* Colonne droite : contenu des étapes */}
                <main className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                    {step !== 5 && (
                        <header className="mb-6">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Créez votre compte
                            </h1>
                            <p className="text-sm text-gray-500">
                                Étape {step} sur 4
                            </p>
                        </header>
                    )}

                    {/* Étape 1 */}
                    {step === 1 && (
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="mb-1 block text-sm text-gray-700">
                                    Adresse email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    placeholder="vous@exemple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Utilisez un email d’entreprise si possible.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Mot de passe <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="8 caractères minimum"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Confirmer le mot de passe <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Répétez le mot de passe"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-gray-500">
                                    En continuant, vous acceptez nos{" "}
                                    <a className="underline" href="#">
                                        Conditions
                                    </a>{" "}
                                    et notre{" "}
                                    <a className="underline" href="#">
                                        Politique de confidentialité
                                    </a>.
                                </div>
                                <Button type="button" onClick={next} disabled={!canGoNext()}>
                                    Continuer
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Étape 2 */}
                    {step === 2 && (
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Nom complet <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Nom et prénom"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Téléphone (optionnel)
                                    </label>
                                    <Input
                                        placeholder="+33 6 12 34 56 78"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Button variant="outline" type="button" onClick={back}>
                                    Retour
                                </Button>
                                <Button type="button" onClick={next} disabled={!canGoNext()}>
                                    Continuer
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Étape 3 */}
                    {step === 3 && (
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Nom de l’entreprise <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Ex: Acme Corp"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Effectif
                                    </label>
                                    <select
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                    >
                                        <option value="1-10">1–10</option>
                                        <option value="11-50">11–50</option>
                                        <option value="51-200">51–200</option>
                                        <option value="200+">200+</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">
                                        Site web (optionnel)
                                    </label>
                                    <Input
                                        placeholder="https://exemple.com"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Button variant="outline" type="button" onClick={back}>
                                    Retour
                                </Button>
                                <Button type="button" onClick={next} disabled={!canGoNext()}>
                                    Continuer
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Étape 4 */}
                    {step === 4 && (
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <p className="text-sm text-gray-600">
                                Nous avons envoyé un code à <span className="font-medium">{email || "votre email"}</span>.
                                Saisissez-le ci-dessous pour vérifier votre compte.
                            </p>
                            <div className="max-w-xs">
                                <label className="mb-1 block text-sm text-gray-700">
                                    Code de vérification <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Ex: 1234"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Button variant="outline" type="button" onClick={back}>
                                    Retour
                                </Button>
                                <Button type="button" onClick={next} disabled={!canGoNext()}>
                                    Terminer
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Succès */}
                    {step === 5 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            {/* Remplace /illustrations/signup-success.svg par ton image dans /public */}
                            <Image
                                src="/illustrations/signup-success.svg"
                                alt="Inscription réussie"
                                width={320}
                                height={220}
                                className="mb-6"
                            />
                            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                                Votre compte a bien été créé !
                            </h2>
                            <p className="mb-6 max-w-md text-sm text-gray-600">
                                Vous pouvez maintenant configurer votre espace de travail et
                                inviter votre équipe.
                            </p>
                            <div className="flex gap-3">
                                <Button onClick={() => alert("Rediriger vers le tableau de bord…")}>
                                    Accéder au tableau de bord
                                </Button>
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Recommencer
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
