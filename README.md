# AMMGROUP Digital — Invitations de mariage coutumier (édition HTML/CSS/JavaScript)

**Aucune dépendance Python, aucun framework et aucune base de données.** Ce projet est un ensemble de pages statiques fonctionnant sur GitHub Pages, et non la version Python livrée précédemment.

## Ouvrir le projet

- `index.html` : catalogue des **trois modèles**.
- `royal/index.html` : invitation **L’Éternel**, ouverture par **enveloppe rouge**.
- `cinema/index.html` : invitation **Notre Histoire**, ouverture par **cœur rouge symétrique**.
- `violet/index.html` : invitation **Nos Racines**, ouverture par **rose rouge**.
- `admin.html` : studio de personnalisation **local** (pas de mot de passe : ce n'est pas une interface sécurisée côté serveur).
- `print.html` : invitation nominative imprimable. Utiliser le bouton **Enregistrer au format PDF**, puis choisir « Enregistrer au format PDF » dans Chrome.

Les trois invitations sont responsive (téléphone, tablette, ordinateur). La musique originale démarre **au clic** sur le bouton d’ouverture ; un navigateur peut bloquer toute tentative de lecture sans interaction préalable. Le diaporama fait défiler les photos **verticalement du bas vers le haut**.

Pour visualiser les pages, ouvrir directement `index.html` dans Chrome. Pour utiliser le studio local en conservant les données entre les pages, le plus fiable est de servir le dossier avec **Live Server dans VS Code** (aucune installation Python), ou le publier sur GitHub Pages.

## Personnaliser sans coder

1. Ouvrir `admin.html`.
2. Choisir Royal, Cinéma ou Violet dans le menu.
3. Modifier le mariage, le programme, le dress code, les contacts et les photos. Les données sont sauvegardées avec **localStorage dans ce navigateur seulement**.
4. Télécharger `data.js` via **Exporter data.js**.
5. Remplacer le fichier `assets/js/data.js` du projet par celui qui vient d’être exporté et republier le site sur GitHub Pages.

Les **photos** acceptent des URL HTTPS ou de petites images locales (environ 500 Ko au maximum). Les URL externes nécessitent une connexion Internet et le consentement/droit d’utilisation des photos. La piste de musique originale se trouve dans `assets/media/ambiance-originale.wav`.

## 180 invitations nominatives

Dans `admin.html` → **Invités & tables** :

- Ajouter manuellement chaque invité ou importer un CSV avec les colonnes `nom;places;table;zone` (les virgules sont également acceptées).
- Cliquer sur **Exporter les liens CSV** : un lien différent est produit pour chaque personne/couple.
- Envoyer le lien à l'invité par WhatsApp. Il affichera son nom, ses places, sa table et un code QR qui ouvre la fiche correspondante.
- Exemple d’import dans `examples/invites-exemple.csv`.
- **Conserver une sauvegarde privée JSON** via le studio pour retrouver la liste et les liens sur un autre ordinateur.

**Attention :** dans cette version sans serveur, les informations du destinataire sont encodées dans son URL ; elles ne sont **ni chiffrées ni vérifiées**. La personne qui possède le lien peut le lire ou le modifier. Les QR codes servent uniquement à retrouver une table : **ils ne doivent pas être utilisés comme contrôle d’entrée sécurisé**, surtout pour un événement payant ou avec accès restreint.

## RSVP sans backend

Le formulaire RSVP fonctionne localement dans le navigateur de l’invité. Pour que l’organisation reçoive la réponse, le bouton **Envoyer ma réponse sur WhatsApp** ouvre un message prérempli vers le numéro configuré (en format international, par exemple `243...`). Sans ce numéro, aucune réponse n’est transmise. Le studio ne peut **pas** centraliser automatiquement les réponses envoyées depuis plusieurs téléphones ; cette fonction exigerait un backend ou un service externe (par exemple une base de données distante).

## Déploiement GitHub Pages

Décompresser le ZIP, copier **le contenu du dossier** dans la racine d’un dépôt GitHub, puis :

```powershell
git init -b main
git add -A
git commit -m "feat: trois invitations HTML CSS JS"
gh repo create ammgroupsarl/invitations-coutumieres-html-v7 --public --source . --remote origin --push
```

Pour un dépôt existant, exécuter plutôt `git add -A`, `git commit -m "Mise à jour invitations"`, `git push origin main`.

Activer GitHub Pages depuis **Settings → Pages → Deploy from a branch → main → /(root)**.

## Confidentialité et limites

- Le fichier `assets/js/data.js` distribué avec le site contient uniquement des **mariés et invités fictifs**.
- **Ne jamais publier** la sauvegarde JSON des vrais invités dans un dépôt public. Les coordonnées personnelles doivent être communiquées avec l’accord des personnes.
- L'administration dans `admin.html` est un éditeur de configuration **local**, pas une authentification : tout visiteur peut l’ouvrir et modifier *sa propre copie locale*. Les modifications ne touchent pas ton GitHub sans un nouveau push.
- L’affichage, les animations, la musique, les photos, les fiches de tables, le QR et l’impression PDF fonctionnent sans Python ; seuls la collecte centrale des RSVP et le contrôle sécurisé des entrées sont exclus.

Crédits : QRCode, Kazuhiko Arase, licence MIT (voir `LICENSE-QR.txt`). Photos de démonstration : liens Unsplash des fichiers de configuration ; remplacer par des photos autorisées avant livraison client.
