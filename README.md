# Site de Maxime — Next.js

Stack : **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**.
Généré à partir du frame "Home" du Figma `CV - WEBSITE`.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvre http://localhost:3000

## Ce qui est branché

- **Home** : hero "I'm Maxime, Designer, and metal enjoyer.", paragraphe,
  3 boutons de nav (Case studies / Projects / Notes), bloc contact
  (email, téléphone, LinkedIn).
- **About** : s'ouvre en cliquant sur "Maxime." dans le hero. Transition
  slide fluide via Framer Motion, sans rechargement de page (comportement
  "faux one-page").
- **Lecteur de musique** (`src/components/MusicWidget.tsx`) : entièrement
  fonctionnel (lecture/pause, barre de progression cliquable, temps écoulé).
  Dépose ton fichier audio dans `public/audio/track.mp3` (ou change le prop
  `src` passé à `<MusicWidget />` dans `src/app/page.tsx`). Ajoute aussi ta
  pochette d'album via le prop `cover` (chemin vers une image dans `public/`).
- **Case studies / Projects / Notes** : routes stubs (`/case-studies`,
  `/projects`, `/notes`) avec navigation client (pas de rechargement). Le
  Figma ne contenait pas encore ces écrans — dès que tu les maquettes,
  je peux les brancher avec le même traitement que la home.

## Design tokens

Toutes les couleurs viennent des styles Figma et sont définies dans
`src/app/globals.css` (`--color-bg-*`, `--color-text-*`, `--color-border-*`),
exposées à Tailwind via `@theme inline`. Les deux polices (Newsreader pour les
titres, TASA Explorer pour le corps) sont chargées via `next/font/google` —
gratuites et open-source (OFL), donc pas de fichiers de police à gérer toi-même.

## Déploiement

Le plus simple : pousse ce dossier sur GitHub puis importe le repo sur
[vercel.com](https://vercel.com) (gratuit, déploiement automatique à chaque
push, aucune configuration nécessaire).

## Prochaines étapes possibles

- Ajouter ta vraie pochette d'album et ton morceau dans le lecteur.
- Maquetter Case studies / Projects / Notes dans Figma pour que je les code.
- Remplacer le lien LinkedIn placeholder par ton URL réelle.
- Ajouter des metadata Open Graph / favicon personnalisé.
