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
    highlightColor: "#1B98F5",
  },
  {
    id: "seguranca",
    title: "Segurança & Acidentes",
    description:
      "Registe acidentes, assaltos ou outras ocorrências para acionar ajuda.",
    icon: "shield-checkmark",
    route: "/reportar/seguranca",
    highlightColor: "#FF6B3C",
  },
  {
    id: "infraestrutura",
    title: "Infraestrutura",
    description:
      "Informe problemas de vias, iluminação pública e abastecimento de água.",
    icon: "construct",
    route: "/reportar/infraestrutura",
    highlightColor: "#16A085",
  },
  {
    id: "mapa",
    title: "Mapa de Ocorrências",
    description: "Visualize alertas confirmados perto de si.",
    icon: "map",
    route: "/Mapa",
    highlightColor: "#6C5CE7",
  },
];

export function getCategoryById(id: string | string[] | undefined) {
  if (!id) {
    return null;
  }
  const normalized = Array.isArray(id) ? id[0] : id;
  return reportCategories.find((category) => category.id === normalized) || null;
}
