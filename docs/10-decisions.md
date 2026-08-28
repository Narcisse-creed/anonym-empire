# Décisions Techniques — ANONYM Empire

## 2026-08-28 — Résolution et Architecture de Synchronisation Multi-Appareils Supabase

### Contexte
Lors de tests en production réelle, les modifications d'images et de produits effectuées par l'administrateur depuis un appareil n'apparaissaient pas pour les visiteurs sur d'autres appareils/navigateurs.

### Problèmes Identifiés
1. **Écrasement au montage (Race Condition)** : Les hooks `useEffect` dans `App.tsx` déclenchaient une écriture (`saveProductsToSupabase`) dès le premier rendu de chaque visiteur avec ses données locales/par défaut, ré-écrasant les modifications fraîches dans Supabase.
2. **Payload d'image trop lourd (Base64 brut)** : En l'absence de bucket Supabase Storage, les photos de smartphone brutes (3-8 Mo) étaient sérialisées en Base64 géant, provoquant un échec silencieux de PostgREST lors de la sauvegarde globale des 214 produits.
3. **Absence de sauvegarde unitaire** : Modification d'un produit tentait de re-sauvegarder l'ensemble du catalogue.

### Décisions Prises
1. **Suppression de l'écriture automatique au montage pour les visiteurs** : Les visiteurs n'exécutent que des requêtes de lecture (`fetch...FromSupabase`). Seules les actions d'administration explicites écrivent dans la base de données.
2. **Optimiseur client d'images** (`src/utils/imageOptimizer.ts`) : Toute image sélectionnée est automatiquement redimensionnée et compressée côté client (Canvas max 1200px, JPEG/WebP 82%) pour un poids < 80 Ko, garantissant une synchronisation instantanée et fiable dans Supabase.
3. **Sauvegardes unitaires ciblées** (`src/services/supabase.ts`) : Ajout de `saveSingleProductToSupabase` et `deleteSingleProductFromSupabase` pour isoler les mutations d'articles.
4. **Synchronisation Realtime** (`subscribeToDatabaseChanges`) : Abonnement aux événements `postgres_changes` sur les tables pour propager en direct les mises à jour à tous les visiteurs connectés sans rechargement.
5. **Gestion d'erreurs et Toasts visuels** : Affichage d'un retour utilisateur clair pour chaque action d'administration.
