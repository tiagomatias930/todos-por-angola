export type ReportCategoryId = "infraestrutura" | "seguranca" | "saude" | "mapa";

export interface ReportCategory {
  id: ReportCategoryId;
  title: string;
  description: string;
  icon: string;
  route: string;
  highlightColor: string;
}

export const reportCategories: ReportCategory[] = [
  {
    id: "saude",
    title: "Saúde & Primeiros Socorros",
    description:
      "Receba orientação imediata para sintomas e emergências leves.",
    icon: "medkit",
    route: "/saude",
    highlightColor: "#1565C0",
  },
  {
    id: "seguranca",
    title: "Segurança & Acidentes",
    description:
      "Registe acidentes, assaltos ou outras ocorrências para acionar ajuda.",
    icon: "shield-checkmark",
    route: "/reportar/seguranca",
    highlightColor: "#EF6C00",
  },
  {
    id: "infraestrutura",
    title: "Infraestrutura",
    description:
      "Informe problemas de vias, iluminação pública e abastecimento de água.",
    icon: "construct",
    route: "/reportar/infraestrutura",
    highlightColor: "#00897B",
  },
  {
    id: "mapa",
    title: "Mapa de Ocorrências",
    description: "Visualize alertas confirmados perto de si.",
    icon: "map",
    route: "/Mapa",
    highlightColor: "#7C4DFF",
  },
];

export function getCategoryById(id: string | string[] | undefined) {
  if (!id) {
    return null;
  }
  const normalized = Array.isArray(id) ? id[0] : id;
  return reportCategories.find((category) => category.id === normalized) || null;
}
