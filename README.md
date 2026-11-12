# AMMGROUP Digital — Collection d'invitations coutumières Premium V2

Trois sites de démonstration **responsive** :

- `royal/index.html` — **L'Éternel**, ivoire et or ;
- `cinema/index.html` — **Notre Histoire**, cinéma noir et bronze ;
- `violet/index.html` — **Nos Racines**, violet royal et or.

Le fichier `index.html` à la racine présente le catalogue des trois univers. Déployé dans le dépôt `ammgroupsarl/invitations-mariage-coutumier`, son adresse sera :

https://ammgroupsarl.github.io/invitations-mariage-coutumier/

## Fonctionnalités de la démonstration

- Page d'accueil courte, élégante et adaptée au téléphone et à l'ordinateur ;
- Nom de l'invité clairement visible ;
- Menu responsive et raccourcis ;
- Détails affichés dans des fenêtres : invitation, programme coutumier, histoire, familles, tenue, menu, galerie, accès et contacts ;
- Compte à rebours et animations douces, désactivables via les préférences d'accessibilité ;
- Formulaire RSVP **local uniquement** ;
- Carte « Ma table » avec QR scannable ouvrant la fiche de table ;
- PDF **nominatif de démonstration**, téléchargeable ;
- Musique d'ambiance **originale**, activable manuellement (pas de lecture automatique).

## Deux invités fictifs pour tester

| Code | Invité | Table | Places |
|------|--------|-------|--------|
| `demo-jk` | Monsieur Jean Kabeya | Table 08 | 2 |
| `demo-am` | Madame Amina Mulumba | Table 03 | 1 |

Exemple : `violet/?invite=demo-jk`.

Les QR codes sont prévus pour les adresses GitHub Pages du dépôt cité plus haut. Après publication, scanner le QR sur une invitation conduit à `violet/table.html?invite=demo-jk`, etc.

## Personnaliser les sites

**Un seul fichier de configuration :** `assets/config.js`.

Modifier : noms, date, lieu, dress code, noms des familles, informations de contacts, déroulement coutumier et liste des invités pour la démonstration. Pour afficher une **vraie photo du couple**, déposer un fichier dans `assets/photo-couple.webp`, puis renseigner `couplePhoto: '../assets/photo-couple.webp'`.

Les informations de démonstration (noms, date, tables, zones, lieux) **ne doivent pas être considérées comme de vraies données**.

**Contacts :** ne renseigner que les numéros WhatsApp et les e-mails réellement confirmés. Tant que les contacts restent vides, le site n'affiche pas de faux moyens de contact.

**PDF :** les six PDF fournis correspondent aux deux invités fictifs sur les trois thèmes. Ils ne se mettent pas à jour automatiquement en modifiant `config.js` ; ils doivent être régénérés pour les invités réels.

## Limites à lever avant une prestation réelle de 180 invités

Cette version est une **démo front-end statique**, pas une solution complète de gestion d'événement.

- Le RSVP est stocké uniquement dans le navigateur de l'invité (`localStorage`) ; les organisateurs ne reçoivent aucune confirmation.
- Les deux codes de démonstration sont publics et **ne sécurisent pas l'entrée**. Ne les utilisez pas pour autoriser des accès.
- Pour les 180 invités, prévoir un backend sécurisé, des liens opaque à usage individuel, une base privée, un tableau de bord et un système de scan/pointage avec gestion des invitations déjà utilisées.
- Les informations privées de vrais invités **ne doivent pas** être stockées dans les sources d'un dépôt GitHub public.
- Les contacts, les lieux et le programme doivent être validés avant publication.

## Publier sur GitHub Pages

Si votre dépôt existe déjà et que vous avez extrait l'archive sur votre ordinateur, placez-vous dans le dossier contenant le **`index.html` racine**, puis :

```powershell
git status -sb
git add .
git commit -m "feat: refonte premium responsive des invitations coutumieres"
git push origin main
```

Les fichiers sont entièrement statiques et compatibles avec GitHub Pages (pas de build Node nécessaire). Le fichier `.nojekyll` est inclus.

## Licence et média

- Les illustrations décoratives proviennent des maquettes précédemment réalisées pour ce projet.
- Le fichier `musique-originale.wav` est une courte composition originale générée pour cette démonstration ; elle n'utilise pas d'enregistrement commercial.
- Les noms et les invités sont fictifs.
