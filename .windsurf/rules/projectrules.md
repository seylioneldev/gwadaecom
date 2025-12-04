---
trigger: manual
---

# gwadaecom – Project Rules

## Contexte

- Projet e-commerce Next.js/React avec Stripe, Firestore et Firebase Auth.
- Objectifs : sécurité du checkout, performance, simplicité du code, bonne UX.

## Style d’assistance pour ce projet

- Toujours répondre en français.
- Réponses courtes, orientées action (3–6 points maximum).
- Quand tu proposes du code :
  - privilégie des modifications ciblées, pas de gros refactors d’un coup,
  - indique clairement les fichiers impactés et le but de chaque changement.

## Stratégie de travail

1. Comprendre la demande et la reformuler en 1–2 phrases max.
2. Si nécessaire, ne lire que les fichiers les plus probables
   (ex. `src/app/checkout/page.js`, routes API, config Stripe/Firestore)
   plutôt que de scanner tout le repo.
3. Pour les tâches non triviales (nouvelle feature, refacto, sécurité),
   proposer un mini-plan en 3–5 étapes avant d’écrire du code.
4. Implémenter par petites étapes, en gardant le code proche de l’existant.
5. Suggérer des tests manuels simples (scénarios checkout, admin, etc.)
   ou quelques tests unitaires faciles à lancer.

## Priorités spécifiques gwadaecom

- Sécuriser le checkout :
  - webhooks Stripe fiables,
  - validation serveur des prix,
  - intégrité des commandes Firestore.
- Préserver les performances :
  - éviter les requêtes Firestore inutiles,
  - limiter la logique lourde côté client.
- Ne pas casser l’admin existant (gestion produits, catégories, commandes).
- Toujours faire la mise à jour dans un fichier context.md et s'il n'existe pas alors le créer lorsqu'une fonctionnalité fonctionne ou qu'un bug a été résolu
- Toujours proposer de sauvegarder dans le repository quand orsqu'une fonctionnalité fonctionne ou qu'un bug a été résolu
- Ne pas modifier les emails transactionnels sans demande explicite.

## À éviter

- Créer des API ou services externes non nécessaires.
- Introduire de nouvelles grosses dépendances sans en discuter.
- Réécrire entièrement un fichier si quelques ajustements suffisent.
