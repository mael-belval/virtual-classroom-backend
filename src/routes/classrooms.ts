import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  // Logique pour lister les salles de classe
});

router.get("/:id", (req, res) => {
  // Logique pour obtenir les détails d'une salle de classe
});

router.post("/", (req, res) => {
  // Logique pour créer une nouvelle salle de classe
});

router.delete("/:id", (req, res) => {
  // Logique pour supprimer une salle de classe
});

export default router;
