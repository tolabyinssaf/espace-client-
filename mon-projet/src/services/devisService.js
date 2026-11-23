import axios from "axios";
import initialData from "../../data/devis.json";

const API_URL = "http://localhost:3000/devis";
const LOCAL_STORAGE_KEY = "espace_client_devis";

// Récupère ou initialise la liste des devis dans le localStorage
const getLocalDevis = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        const defaultList = initialData.devis || [];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultList));
        return defaultList;
    } catch {
        return initialData.devis || [];
    }
};

// Sauvegarde dans le localStorage
const saveLocalDevis = (list) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
        console.warn("Impossible d'écrire dans le localStorage :", error);
    }
};

/**
 * Récupère la liste des devis.
 * 1. Tente d'appeler l'API JSON-Server sur http://localhost:3000/devis
 * 2. Si le serveur n'est pas lancé, bascule sans planter sur les données locales (fallback)
 */
export const getDevis = async () => {
    try {
        const response = await axios.get(API_URL, { timeout: 1200 });
        if (Array.isArray(response.data)) {
            saveLocalDevis(response.data);
            return response.data;
        }
    } catch {
        console.info(
            "Serveur JSON-Server non détecté sur http://localhost:3000/devis. Utilisation des données mockées locales."
        );
    }

    // Fallback instantané sur les données locales
    return getLocalDevis();
};

/**
 * Crée un nouveau devis.
 * Tente d'enregistrer sur JSON-Server et met à jour le stockage local.
 */
export const createDevis = async (nouveauDevis) => {
    try {
        const response = await axios.post(API_URL, nouveauDevis, { timeout: 1200 });
        const localList = getLocalDevis();
        saveLocalDevis([response.data, ...localList.filter((d) => d.id !== response.data.id)]);
        return response.data;
    } catch {
        // En mode local, on génère un ID unique et on ajoute le devis
        const localList = getLocalDevis();
        const devisAvecId = {
            id: Date.now(),
            ...nouveauDevis
        };
        const nouvelleListe = [devisAvecId, ...localList];
        saveLocalDevis(nouvelleListe);
        return devisAvecId;
    }
};