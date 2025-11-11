# Application de Suivi d'Accompagnement de Candidats

Une application web complète pour suivre l'accompagnement de candidats dans leur recherche d'emploi, développée en HTML, CSS et JavaScript.

## 🚀 Fonctionnalités

### 📊 Tableau de bord
- **Statistiques en temps réel** : nombre total de candidats, embauchés, en entretien, en cours
- **Liste complète** des candidats avec filtres de recherche
- **Vue d'ensemble** des statuts et progressions

### ➕ Ajout de candidats
- Formulaire complet avec validation
- Champs obligatoires : nom, prénom, email, type de contrat, date de début
- Champs optionnels : téléphone, objectif professionnel, lien CV
- Vérification d'unicité de l'email

### 👤 Fiche candidat détaillée
- **Informations personnelles** complètes
- **Étapes d'accompagnement** avec cases à cocher :
  - Appel de découverte
  - Optimisation du CV
  - Optimisation LinkedIn
  - Préparation aux entretiens
- **Suivi quantitatif** :
  - Nombre de candidatures envoyées
  - Liste des entreprises ciblées
  - Entretiens passés (historique)
- **Gestion du statut** (en cours, en entretien, embauché, en pause)

### 💾 Persistance des données
- Stockage local avec `localStorage`
- Sauvegarde automatique de toutes les modifications
- Données conservées après rechargement/fermeture
- **Import CSV** depuis Google Sheets ou autres formulaires
- **Export/Import JSON** pour sauvegardes complètes

### 📊 Import de candidats depuis Google Sheets
- **Support CSV natif** : importez directement vos réponses de formulaire Google
- **Mapping automatique** des colonnes standard
- **Validation des données** avec gestion des erreurs
- **Déduplication** automatique basée sur l'email
- **Choix d'import** : ajouter aux existants ou remplacer

#### Format CSV supporté :
```
Nom,Prénom,Email,Téléphone,Type de contrat,Objectif professionnel,Lien CV,Date début
```

#### Étapes pour importer depuis Google Sheets :
1. Dans Google Sheets : Fichier → Télécharger → CSV
2. Dans l'app : bouton "Importer" → sélectionner le fichier CSV
3. Choisir : ajouter aux candidats existants ou remplacer
4. Vérification automatique des doublons

### 🎨 Interface utilisateur
- Design responsive avec Bootstrap 5
- Interface moderne et intuitive
- Animations et transitions fluides
- Compatible mobile et desktop

## 🛠️ Fonctionnalités bonus
- **Export/Import** de données au format JSON
- **Raccourcis clavier** :
  - `Ctrl + N` : Nouveau candidat
  - `Ctrl + H` : Retour au tableau de bord
  - `Escape` : Retour au tableau de bord
- **Alertes** et notifications utilisateur
- **Recherche en temps réel** dans la liste des candidats

## 📁 Structure des fichiers

```
├── index.html      # Structure HTML principale
├── style.css       # Styles personnalisés et responsive
├── app.js          # Logique JavaScript complète
└── README.md       # Cette documentation
```

## 🚀 Installation et utilisation

1. **Télécharger** tous les fichiers dans un dossier
2. **Ouvrir** `index.html` dans un navigateur moderne
3. **Commencer** à ajouter vos candidats !

*Aucune installation de serveur ou base de données requise.*

## 💡 Guide d'utilisation

### Ajouter un candidat
1. Cliquer sur "Ajouter candidat" dans la navigation
2. Remplir le formulaire (champs obligatoires marqués *)
3. Cliquer sur "Ajouter le candidat"

### Consulter/Modifier un candidat
1. Dans le tableau de bord, cliquer sur "Voir fiche"
2. Modifier les étapes d'accompagnement selon les besoins
3. Sauvegarder les modifications

### Rechercher un candidat
- Utiliser la barre de recherche en haut à droite du tableau
- La recherche fonctionne sur nom, prénom, email, type de contrat et statut

### Exporter/Importer des données
- **Exporter** : bouton "Exporter" dans la navigation (fichier JSON)
- **Importer** : bouton "Importer" pour charger un fichier d'export

## 🔒 Sécurité et données

- Toutes les données sont stockées **localement** dans votre navigateur
- **Aucune transmission** sur internet
- **Sauvegarde recommandée** via la fonction d'export
- Compatible avec tous les navigateurs modernes

## 🎯 Types de contrats supportés

- CDI (Contrat à Durée Indéterminée)
- Stage
- Alternance
- Freelance

## 📊 Statuts de candidats

- **En cours** : accompagnement actif
- **En entretien** : processus de recrutement en cours
- **Embauché** : objectif atteint
- **En pause** : accompagnement suspendu

## 🛠️ Technologies utilisées

- **HTML5** : structure sémantique
- **CSS3** : styles modernes avec variables CSS
- **JavaScript (ES6+)** : logique applicative orientée objet
- **Bootstrap 5** : framework CSS responsive
- **Font Awesome** : icônes modernes
- **localStorage** : persistance des données

## 🔧 Personnalisation

Le code est modulaire et facilement personnalisable :

- **Couleurs** : modifiables dans `:root` du CSS
- **Champs** : ajoutables dans les formulaires
- **Statuts** : configurables dans le JavaScript
- **Validations** : extensibles dans `validateCandidateData()`

## 🐛 Support et dépannage

### Problèmes courants
- **Données perdues** : vérifier que localStorage est activé
- **Design cassé** : s'assurer que la connexion internet fonctionne (Bootstrap CDN)
- **JavaScript non fonctionnel** : ouvrir la console développeur (F12)

### Compatibilité
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

**Développé avec ❤️ pour faciliter l'accompagnement professionnel**
