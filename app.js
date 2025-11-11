// Application Suivi Candidats - Logique JavaScript
class CandidateManager {
    constructor() {
        this.candidates = this.loadCandidatesFromStorage();
        this.currentCandidateId = null;
        this.init();
    }

    // Initialisation de l'application
    init() {
        this.setupEventListeners();
        this.showDashboard();
        this.updateStats();
        this.renderCandidatesList();
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Navigation
        document.getElementById('showDashboard').addEventListener('click', () => this.showDashboard());
        document.getElementById('showAddForm').addEventListener('click', () => this.showAddForm());
        document.getElementById('backToDashboard').addEventListener('click', () => this.showDashboard());
        document.getElementById('cancelAdd').addEventListener('click', () => this.showDashboard());

        // Formulaires
        document.getElementById('candidateForm').addEventListener('submit', (e) => this.handleAddCandidate(e));
        document.getElementById('detailForm').addEventListener('submit', (e) => this.handleUpdateCandidate(e));

        // Actions
        document.getElementById('deleteCandidate').addEventListener('click', () => this.deleteCandidate());
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterCandidates(e.target.value));

        // Définir la date du jour par défaut
        document.getElementById('dateDebut').value = new Date().toISOString().split('T')[0];
    }

    // Gestion du localStorage
    loadCandidatesFromStorage() {
        const stored = localStorage.getItem('candidates');
        return stored ? JSON.parse(stored) : [];
    }

    saveCandidatesToStorage() {
        localStorage.setItem('candidates', JSON.stringify(this.candidates));
    }

    // Navigation entre les sections
    showSection(sectionId) {
        ['dashboardSection', 'addCandidateSection', 'candidateDetailSection'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
        document.getElementById(sectionId).classList.add('fade-in');
    }

    showDashboard() {
        this.showSection('dashboardSection');
        this.updateStats();
        this.renderCandidatesList();
    }

    showAddForm() {
        this.showSection('addCandidateSection');
        document.getElementById('candidateForm').reset();
        document.getElementById('dateDebut').value = new Date().toISOString().split('T')[0];
    }

    showCandidateDetail(candidateId) {
        this.currentCandidateId = candidateId;
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        this.showSection('candidateDetailSection');
        this.populateCandidateDetail(candidate);
    }

    // Gestion des candidats
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    handleAddCandidate(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const candidateData = {
            id: this.generateId(),
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            email: document.getElementById('email').value.trim(),
            telephone: document.getElementById('telephone').value.trim(),
            typeContrat: document.getElementById('typeContrat').value,
            objectifPro: document.getElementById('objectifPro').value.trim(),
            lienCV: document.getElementById('lienCV').value.trim(),
            dateDebut: document.getElementById('dateDebut').value,
            dateCreation: new Date().toISOString(),

            // Étapes d'accompagnement
            appelDecouverte: false,
            optimisationCV: false,
            optimisationLinkedIn: false,
            preparationEntretiens: false,
            nbCandidatures: 0,
            entreprisesCiblees: '',
            entretiensPass: '',
            statutActuel: 'en cours'
        };

        // Validation
        if (!this.validateCandidateData(candidateData)) {
            return;
        }

        // Vérifier l'unicité de l'email
        if (this.candidates.some(c => c.email.toLowerCase() === candidateData.email.toLowerCase())) {
            this.showAlert('Un candidat avec cet email existe déjà.', 'warning');
            return;
        }

        this.candidates.push(candidateData);
        this.saveCandidatesToStorage();
        this.showAlert('Candidat ajouté avec succès !', 'success');
        this.showDashboard();
    }

    validateCandidateData(data) {
        const requiredFields = ['nom', 'prenom', 'email', 'typeContrat', 'dateDebut'];

        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showAlert(`Le champ ${this.getFieldLabel(field)} est obligatoire.`, 'danger');
                return false;
            }
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showAlert('L\'adresse email n\'est pas valide.', 'danger');
            return false;
        }

        return true;
    }

    getFieldLabel(field) {
        const labels = {
            nom: 'Nom',
            prenom: 'Prénom',
            email: 'Email',
            typeContrat: 'Type de contrat',
            dateDebut: 'Date de début'
        };
        return labels[field] || field;
    }

    handleUpdateCandidate(e) {
        e.preventDefault();

        const candidate = this.candidates.find(c => c.id === this.currentCandidateId);
        if (!candidate) return;

        // Mise à jour des données
        candidate.appelDecouverte = document.getElementById('appelDecouverte').checked;
        candidate.optimisationCV = document.getElementById('optimisationCV').checked;
        candidate.optimisationLinkedIn = document.getElementById('optimisationLinkedIn').checked;
        candidate.preparationEntretiens = document.getElementById('preparationEntretiens').checked;
        candidate.nbCandidatures = parseInt(document.getElementById('nbCandidatures').value) || 0;
        candidate.entreprisesCiblees = document.getElementById('entreprisesCiblees').value.trim();
        candidate.entretiensPass = document.getElementById('entretiensPass').value.trim();
        candidate.statutActuel = document.getElementById('statutActuel').value;

        this.saveCandidatesToStorage();
        this.showAlert('Modifications sauvegardées avec succès !', 'success');
        this.showDashboard();
    }

    deleteCandidate() {
        if (!this.currentCandidateId) return;

        const candidate = this.candidates.find(c => c.id === this.currentCandidateId);
        if (!candidate) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer le candidat ${candidate.prenom} ${candidate.nom} ?`)) {
            this.candidates = this.candidates.filter(c => c.id !== this.currentCandidateId);
            this.saveCandidatesToStorage();
            this.showAlert('Candidat supprimé avec succès.', 'info');
            this.showDashboard();
        }
    }

    // Affichage des données
    populateCandidateDetail(candidate) {
        // Informations personnelles
        document.getElementById('detailNom').textContent = candidate.nom;
        document.getElementById('detailPrenom').textContent = candidate.prenom;
        document.getElementById('detailEmail').textContent = candidate.email;
        document.getElementById('detailTelephone').textContent = candidate.telephone || 'Non renseigné';
        document.getElementById('detailTypeContrat').textContent = candidate.typeContrat;
        document.getElementById('detailDateDebut').textContent = this.formatDate(candidate.dateDebut);
        document.getElementById('detailObjectif').textContent = candidate.objectifPro || 'Non renseigné';

        // Lien CV
        const cvLink = document.getElementById('detailCV');
        if (candidate.lienCV) {
            cvLink.href = candidate.lienCV;
            cvLink.style.display = 'inline';
        } else {
            cvLink.style.display = 'none';
            cvLink.parentNode.innerHTML = '<strong>CV :</strong> Non renseigné';
        }

        // Afficher les informations supplémentaires du formulaire Google Sheets
        this.displayAdditionalInfo(candidate);

        // Étapes d'accompagnement
        document.getElementById('appelDecouverte').checked = candidate.appelDecouverte || false;
        document.getElementById('optimisationCV').checked = candidate.optimisationCV || false;
        document.getElementById('optimisationLinkedIn').checked = candidate.optimisationLinkedIn || false;
        document.getElementById('preparationEntretiens').checked = candidate.preparationEntretiens || false;
        document.getElementById('nbCandidatures').value = candidate.nbCandidatures || 0;
        document.getElementById('entreprisesCiblees').value = candidate.entreprisesCiblees || '';
        document.getElementById('entretiensPass').value = candidate.entretiensPass || '';
        document.getElementById('statutActuel').value = candidate.statutActuel || 'en cours';
    }

    displayAdditionalInfo(candidate) {
        // Créer ou mettre à jour la section d'informations supplémentaires
        let additionalSection = document.getElementById('additionalInfoSection');

        if (!additionalSection) {
            // Créer la section si elle n'existe pas
            additionalSection = document.createElement('div');
            additionalSection.id = 'additionalInfoSection';
            additionalSection.className = 'row mb-4';

            const targetElement = document.querySelector('#candidateDetailSection .row.mb-4');
            targetElement.insertAdjacentElement('afterend', additionalSection);
        }

        additionalSection.innerHTML = `
            <div class="col-12">
                <h6 class="border-bottom pb-2">Informations du formulaire</h6>
            </div>
            <div class="col-md-6">
                ${candidate.ville ? `<p><strong>Localisation :</strong> ${candidate.ville}</p>` : ''}
                ${candidate.disponibilite ? `<p><strong>Disponibilité :</strong> ${candidate.disponibilite}</p>` : ''}
                ${candidate.niveauExperience ? `<p><strong>Niveau :</strong> ${candidate.niveauExperience}</p>` : ''}
                ${candidate.memeFac ? `<p><strong>Même fac :</strong> ${candidate.memeFac}</p>` : ''}
            </div>
            <div class="col-md-6">
                ${candidate.stackPrincipale ? `<p><strong>Stack :</strong> ${candidate.stackPrincipale}</p>` : ''}
                ${candidate.souhaitsPart ? `<p><strong>Souhaits :</strong> ${candidate.souhaitsPart}</p>` : ''}
            </div>
            ${candidate.derniereExperience ? `
                <div class="col-12 mt-2">
                    <p><strong>Dernière expérience :</strong></p>
                    <div class="bg-light p-2 rounded" style="max-height: 200px; overflow-y: auto;">
                        <small>${candidate.derniereExperience}</small>
                    </div>
                </div>
            ` : ''}
        `;
    }

    renderCandidatesList() {
        const tbody = document.getElementById('candidatsTableBody');
        const noCandidats = document.getElementById('noCandidats');

        if (this.candidates.length === 0) {
            tbody.innerHTML = '';
            noCandidats.style.display = 'block';
            return;
        }

        noCandidats.style.display = 'none';
        tbody.innerHTML = this.candidates.map(candidate => this.createCandidateRow(candidate)).join('');
    }

    createCandidateRow(candidate) {
        const statutBadge = this.getStatusBadge(candidate.statutActuel);

        return `
            <tr>
                <td data-label="Nom">${candidate.prenom} ${candidate.nom}</td>
                <td data-label="Type de contrat">${candidate.typeContrat}</td>
                <td data-label="Statut">${statutBadge}</td>
                <td data-label="Date début">${this.formatDate(candidate.dateDebut)}</td>
                <td data-label="Actions">
                    <button class="btn btn-primary btn-sm" onclick="app.showCandidateDetail('${candidate.id}')">
                        <i class="fas fa-eye"></i> Voir fiche
                    </button>
                </td>
            </tr>
        `;
    }

    getStatusBadge(statut) {
        const badges = {
            'en cours': '<span class="badge bg-primary">En cours</span>',
            'en entretien': '<span class="badge bg-warning">En entretien</span>',
            'embauché': '<span class="badge bg-success">Embauché</span>',
            'en pause': '<span class="badge bg-secondary">En pause</span>'
        };
        return badges[statut] || '<span class="badge bg-secondary">Non défini</span>';
    }

    // Statistiques
    updateStats() {
        const stats = this.calculateStats();

        document.getElementById('totalCandidats').textContent = stats.total;
        document.getElementById('candidatsEmb').textContent = stats.embauches;
        document.getElementById('candidatsEntretien').textContent = stats.entretiens;
        document.getElementById('candidatsCours').textContent = stats.enCours;
    }

    calculateStats() {
        const total = this.candidates.length;
        const embauches = this.candidates.filter(c => c.statutActuel === 'embauché').length;
        const entretiens = this.candidates.filter(c => c.statutActuel === 'en entretien').length;
        const enCours = this.candidates.filter(c => c.statutActuel === 'en cours').length;

        return { total, embauches, entretiens, enCours };
    }

    // Recherche et filtrage
    filterCandidates(searchTerm) {
        const filteredCandidates = this.candidates.filter(candidate => {
            const searchString = `${candidate.nom} ${candidate.prenom} ${candidate.email} ${candidate.typeContrat} ${candidate.statutActuel}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });

        this.renderFilteredCandidates(filteredCandidates);
    }

    renderFilteredCandidates(candidates) {
        const tbody = document.getElementById('candidatsTableBody');
        const noCandidats = document.getElementById('noCandidats');

        if (candidates.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Aucun candidat trouvé</td></tr>';
            noCandidats.style.display = 'none';
            return;
        }

        noCandidats.style.display = 'none';
        tbody.innerHTML = candidates.map(candidate => this.createCandidateRow(candidate)).join('');
    }

    // Utilitaires
    formatDate(dateString) {
        if (!dateString) return 'Non renseigné';

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    showAlert(message, type = 'info') {
        // Supprimer les alertes existantes
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Créer la nouvelle alerte
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insérer l'alerte au début du container
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto-suppression après 5 secondes
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Méthodes pour l'export/import (bonus)
    exportData() {
        const data = {
            candidates: this.candidates,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `candidats-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
        this.showAlert('Données exportées avec succès !', 'success');
    }

    importData(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'csv') {
            this.importCSV(file);
        } else if (fileExtension === 'json') {
            this.importJSON(file);
        } else {
            this.showAlert('Format de fichier non supporté. Utilisez un fichier CSV ou JSON.', 'danger');
        }
    }

    importJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.candidates && Array.isArray(data.candidates)) {
                    if (confirm('Cette action va remplacer toutes les données existantes. Continuer ?')) {
                        this.candidates = data.candidates;
                        this.saveCandidatesToStorage();
                        this.updateStats();
                        this.renderCandidatesList();
                        this.showAlert('Données JSON importées avec succès !', 'success');
                    }
                } else {
                    this.showAlert('Format de fichier JSON invalide.', 'danger');
                }
            } catch (error) {
                this.showAlert('Erreur lors de l\'importation du fichier JSON.', 'danger');
                console.error('Erreur import JSON:', error);
            }
        };
        reader.readAsText(file);
    }

    importCSV(file) {
        console.log('Début import CSV, fichier:', file.name, 'taille:', file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvContent = e.target.result;
                console.log('Fichier lu, longueur:', csvContent.length);
                console.log('Encodage détecté, premiers caractères:', csvContent.substring(0, 100));

                const candidates = this.parseCSV(csvContent);
                console.log('Parsing terminé, candidats obtenus:', candidates.length);

                if (candidates.length === 0) {
                    this.showAlert('Aucun candidat valide trouvé dans le fichier CSV.', 'warning');
                    return;
                }

                const action = confirm(`${candidates.length} candidat(s) trouvé(s) dans le fichier CSV.\n\nChoisissez :\n- OK : Ajouter à la liste existante\n- Annuler : Remplacer toutes les données`);

                if (action) {
                    // Ajouter à la liste existante
                    const duplicates = [];
                    const newCandidates = [];

                    candidates.forEach(candidate => {
                        const exists = this.candidates.some(c =>
                            c.email.toLowerCase() === candidate.email.toLowerCase()
                        );

                        if (exists) {
                            duplicates.push(candidate);
                        } else {
                            newCandidates.push(candidate);
                            this.candidates.push(candidate);
                        }
                    });

                    console.log('Nouveaux candidats ajoutés:', newCandidates.length);
                    console.log('Doublons ignorés:', duplicates.length);

                    this.saveCandidatesToStorage();
                    this.updateStats();
                    this.renderCandidatesList();

                    let message = `${newCandidates.length} nouveau(x) candidat(s) ajouté(s) avec succès !`;
                    if (duplicates.length > 0) {
                        message += `\n${duplicates.length} candidat(s) ignoré(s) (email déjà existant).`;
                    }
                    this.showAlert(message, 'success');

                } else {
                    // Remplacer toutes les données
                    console.log('Remplacement de tous les candidats');
                    this.candidates = candidates;
                    this.saveCandidatesToStorage();
                    this.updateStats();
                    this.renderCandidatesList();
                    this.showAlert('Données remplacées avec succès !', 'success');
                }

            } catch (error) {
                console.error('Erreur import CSV:', error);
                this.showAlert(`Erreur lors de l'importation du fichier CSV: ${error.message}`, 'danger');
            }
        };

        reader.onerror = () => {
            console.error('Erreur lecture fichier');
            this.showAlert('Erreur lors de la lecture du fichier.', 'danger');
        };

        reader.readAsText(file, 'UTF-8');
    }

    parseCSV(csvContent) {
        try {
            console.log('Début parsing CSV, longueur:', csvContent.length);
            console.log('Premiers 200 caractères:', csvContent.substring(0, 200));

            // Diviser le contenu en lignes
            const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
            console.log('Nombre de lignes trouvées:', lines.length);

            if (lines.length < 2) {
                throw new Error('Le fichier CSV doit contenir au moins une ligne d\'en-têtes et une ligne de données.');
            }

            // Ignorer la première ligne (en-têtes)
            const dataLines = lines.slice(1);
            const candidates = [];
            console.log('Lignes de données à traiter:', dataLines.length);

            dataLines.forEach((line, index) => {
                try {
                    console.log(`Traitement ligne ${index + 2}:`, line.substring(0, 100) + '...');
                    const candidate = this.parseCsvLine(line, index + 2); // +2 car on ignore la première ligne
                    if (candidate) {
                        candidates.push(candidate);
                        console.log(`Candidat créé: ${candidate.prenom} ${candidate.nom}`);
                    }
                } catch (error) {
                    console.error(`Erreur ligne ${index + 2}:`, error.message);
                    console.error('Ligne complète:', line);
                }
            });

            console.log('Candidats parsés avec succès:', candidates.length);
            return candidates;
        } catch (error) {
            console.error('Erreur globale parsing CSV:', error);
            throw new Error(`Erreur de parsing CSV: ${error.message}`);
        }
    }

    parseCsvLine(line, lineNumber) {
        console.log(`Parsing ligne ${lineNumber}...`);

        // Parser CSV simple qui gère les guillemets et les virgules
        const fields = this.parseCSVFields(line);
        console.log(`Nombre de champs extraits: ${fields.length}`);
        console.log('Premiers champs:', fields.slice(0, 5));

        // Vérifier le nombre minimum de champs requis (votre fichier a 15 colonnes)
        if (fields.length < 4) {
            throw new Error(`Ligne ${lineNumber}: Nombre insuffisant de colonnes (${fields.length} trouvées, minimum 4 requis)`);
        }

        // Mapping exact selon votre structure Google Sheets
        const [
            horodateur = '',           // 0
            nomUtilisateur = '',       // 1
            nomPrenom = '',            // 2 - "Nom & Prénom"
            email = '',                // 3 - "Email pro ou perso"
            telephone = '',            // 4 - "Téléphone (optionnel)"
            ville = '',                // 5 - "Ville actuelle + mobilité"
            typeContrat = '',          // 6 - "Type de contrat recherché"
            disponibilite = '',        // 7 - "Disponibilité"
            stackPrincipale = '',      // 8 - "Stack principale"
            niveauExperience = '',     // 9 - "Niveau d'expérience"
            derniereExperience = '',   // 10 - "Dernière expérience ou projet marquant"
            lienCV = '',               // 11 - "Lien vers ton CV, GitHub, portfolio ou LinkedIn"
            souhaitsPart = '',         // 12 - "Souhaits particuliers"
            memeFac = '',              // 13 - "As-tu étudié dans la même fac que moi ?"
            consentement = ''          // 14 - "Consentement RGPD"
        ] = fields.map(field => field.trim());

        console.log(`Données extraites: nomPrenom="${nomPrenom}", email="${email}"`);

        // Extraire nom et prénom du champ "Nom & Prénom"
        const { nom, prenom } = this.parseNomPrenom(nomPrenom);
        console.log(`Nom/Prénom parsés: nom="${nom}", prenom="${prenom}"`);

        // Validation des champs obligatoires
        if (!nom || !prenom || !email) {
            throw new Error(`Ligne ${lineNumber}: Champs obligatoires manquants (nom: "${nom}", prénom: "${prenom}", email: "${email}")`);
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error(`Ligne ${lineNumber}: Email invalide: ${email}`);
        }

        // Normalisation du type de contrat selon vos valeurs
        let normalizedTypeContrat = this.normalizeContractType(typeContrat);

        // Utiliser l'horodateur pour la date de début si pas d'autre date
        let normalizedDate = this.parseHorodateur(horodateur);

        // Construire l'objectif professionnel enrichi
        let objectifComplet = this.buildObjectifProfessionnel(
            stackPrincipale,
            niveauExperience,
            derniereExperience,
            souhaitsPart
        );

        // Créer l'objet candidat
        const candidate = {
            id: this.generateId(),
            nom: this.capitalizeWords(nom),
            prenom: this.capitalizeWords(prenom),
            email: email.toLowerCase(),
            telephone: this.normalizePhone(telephone),
            typeContrat: normalizedTypeContrat,
            objectifPro: objectifComplet,
            lienCV: this.normalizeURL(lienCV),
            dateDebut: normalizedDate,
            dateCreation: new Date().toISOString(),

            // Données supplémentaires de votre formulaire
            ville: ville,
            disponibilite: disponibilite,
            stackPrincipale: stackPrincipale,
            niveauExperience: niveauExperience,
            derniereExperience: derniereExperience.substring(0, 500), // Limiter la taille
            souhaitsPart: souhaitsPart,
            memeFac: memeFac,

            // Étapes d'accompagnement (par défaut non cochées)
            appelDecouverte: false,
            optimisationCV: false,
            optimisationLinkedIn: false,
            preparationEntretiens: false,
            nbCandidatures: 0,
            entreprisesCiblees: '',
            entretiensPass: '',
            statutActuel: 'en cours'
        };

        console.log('Candidat créé avec succès:', candidate.prenom, candidate.nom);
        return candidate;
    }

    // Nouvelle méthode pour parser "Nom & Prénom"
    parseNomPrenom(nomPrenom) {
        if (!nomPrenom) return { nom: '', prenom: '' };

        // Nettoyer et diviser le nom complet
        const cleaned = nomPrenom.trim();
        const parts = cleaned.split(' ').filter(part => part.length > 0);

        if (parts.length === 0) {
            return { nom: '', prenom: '' };
        } else if (parts.length === 1) {
            return { nom: parts[0], prenom: '' };
        } else if (parts.length === 2) {
            return { nom: parts[0], prenom: parts[1] };
        } else {
            // Plus de 2 mots : premier = prénom, le reste = nom
            return {
                prenom: parts[0],
                nom: parts.slice(1).join(' ')
            };
        }
    }

    // Nouvelle méthode pour parser l'horodateur Google Sheets
    parseHorodateur(horodateur) {
        if (!horodateur) return new Date().toISOString().split('T')[0];

        try {
            // Format Google Sheets: "2025/10/13 9:43:20 AM UTC+1"
            const dateStr = horodateur.split(' ')[0]; // Prendre juste la partie date
            const [year, month, day] = dateStr.split('/');

            if (year && month && day) {
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }

            return new Date().toISOString().split('T')[0];
        } catch (error) {
            return new Date().toISOString().split('T')[0];
        }
    }

    // Nouvelle méthode pour construire un objectif professionnel enrichi
    buildObjectifProfessionnel(stack, niveau, experience, souhaits) {
        let objectif = '';

        if (stack && stack !== 'Oui') {
            objectif += `Stack: ${stack}`;
        }

        if (niveau) {
            if (objectif) objectif += ' | ';
            objectif += `Niveau: ${niveau}`;
        }

        if (souhaits && souhaits.toLowerCase() !== 'secteur' && souhaits.toLowerCase() !== 'tecno') {
            if (objectif) objectif += ' | ';
            objectif += `Souhaits: ${souhaits}`;
        }

        return objectif || 'À définir lors de l\'entretien';
    }

    parseCSVFields(line) {
        const fields = [];
        let currentField = '';
        let inQuotes = false;
        let i = 0;

        console.log('Parsing ligne CSV:', line.substring(0, 100) + '...');

        while (i < line.length) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"' && !inQuotes) {
                // Début de guillemets
                inQuotes = true;
            } else if (char === '"' && inQuotes && nextChar === '"') {
                // Guillemets échappés ("")
                currentField += '"';
                i++; // Skip next quote
            } else if (char === '"' && inQuotes) {
                // Fin de guillemets
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                // Séparateur de champ
                fields.push(currentField);
                currentField = '';
            } else {
                // Caractère normal
                currentField += char;
            }

            i++;
        }

        // Ajouter le dernier champ
        fields.push(currentField);

        console.log(`${fields.length} champs extraits:`, fields.slice(0, 3).map(f => f.substring(0, 30)));
        return fields;
    }

    normalizeContractType(type) {
        if (!type) return 'CDI'; // Valeur par défaut

        const normalized = type.toLowerCase().trim();

        // Correspondance exacte avec vos valeurs Google Sheets
        if (normalized === 'cdi') return 'CDI';
        if (normalized === 'cdd') return 'CDD';
        if (normalized === 'stage') return 'Stage';
        if (normalized === 'alternance') return 'Alternance';
        if (normalized.includes('freelance') || normalized.includes('portage')) return 'Freelance';

        // Autres variantes possibles
        if (normalized.includes('cdi') || normalized.includes('indéterminée')) return 'CDI';
        if (normalized.includes('cdd') || normalized.includes('déterminée')) return 'CDD';
        if (normalized.includes('stage')) return 'Stage';
        if (normalized.includes('alternance') || normalized.includes('apprentissage')) return 'Alternance';
        if (normalized.includes('freelance') || normalized.includes('indépendant')) return 'Freelance';

        return 'CDI'; // Valeur par défaut si non reconnu
    }

    normalizeDate(dateStr) {
        if (!dateStr) return new Date().toISOString().split('T')[0];

        try {
            // Essayer différents formats de date
            let date;

            // Format ISO (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                date = new Date(dateStr);
            }
            // Format français (DD/MM/YYYY)
            else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                const [day, month, year] = dateStr.split('/');
                date = new Date(`${year}-${month}-${day}`);
            }
            // Format américain (MM/DD/YYYY)
            else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
                date = new Date(dateStr);
            }
            // Autres formats
            else {
                date = new Date(dateStr);
            }

            if (isNaN(date.getTime())) {
                return new Date().toISOString().split('T')[0];
            }

            return date.toISOString().split('T')[0];
        } catch (error) {
            return new Date().toISOString().split('T')[0];
        }
    }

    normalizePhone(phone) {
        if (!phone) return '';

        // Supprimer tous les caractères non numériques sauf le +
        let normalized = phone.replace(/[^\d+]/g, '');

        // Formatter pour la France si c'est un numéro français
        if (normalized.startsWith('0') && normalized.length === 10) {
            normalized = '+33' + normalized.substring(1);
        }

        return normalized;
    }

    normalizeURL(url) {
        if (!url) return '';

        // Ajouter https:// si pas de protocole
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }

        return url;
    }

    capitalizeWords(str) {
        if (!str) return '';

        return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }
}

// Initialisation de l'application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new CandidateManager();

    // Ajout d'options d'export/import dans la navbar (bonus)
    addExportImportFeatures();
});

// Fonctions bonus pour export/import
function addExportImportFeatures() {
    const navbar = document.querySelector('.navbar .navbar-nav');

    // Bouton d'export
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-outline-light ms-2';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Exporter';
    exportBtn.addEventListener('click', () => app.exportData());

    // Bouton d'import (caché)
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json,.csv';
    importInput.style.display = 'none';
    importInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            app.importData(e.target.files[0]);
        }
    });

    const importBtn = document.createElement('button');
    importBtn.className = 'btn btn-outline-light ms-2';
    importBtn.innerHTML = '<i class="fas fa-upload"></i> Importer';
    importBtn.addEventListener('click', () => importInput.click());

    navbar.appendChild(exportBtn);
    navbar.appendChild(importBtn);
    navbar.appendChild(importInput);
}

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', (e) => {
    // Les données sont automatiquement sauvegardées, rien à faire ici
});

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    // Ctrl + N : Nouveau candidat
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        app.showAddForm();
    }

    // Ctrl + H : Retour au tableau de bord
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        app.showDashboard();
    }

    // Escape : Retour au tableau de bord
    if (e.key === 'Escape') {
        app.showDashboard();
    }
});
