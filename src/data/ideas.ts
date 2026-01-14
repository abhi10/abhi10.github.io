export type IdeaStatus = "launched" | "building" | "idea" | "parked";

export interface Idea {
  name: string;
  summary: string;
  tags: string[];
  status: IdeaStatus;
  links?: {
    github?: string;
    demo?: string;
    blog?: string;
    website?: string;
  };
}

export const ideas: Idea[] = [
  {
    name: "Chitram",
    summary: "Image hosting with AI vision tagging",
    tags: ["AI", "Full Stack"],
    status: "launched",
    links: {
      github: "https://github.com/abhi10/chitram",
      demo: "https://chitram.io",
      blog: "/blog/fastapi-supabase-integration",
    },
  },
  {
    name: "Gremlin",
    summary: "AI-powered exploratory QA agent that surfaces 'what if?' risks",
    tags: ["AI", "QA", "CLI"],
    status: "launched",
    links: {
      github: "https://github.com/abhi10/gremlin",
    },
  },
  {
    name: "Civic Agents",
    summary:
      "AI agents for civic infrastructure - potholes, disasters, community services",
    tags: ["AI", "Civic Tech"],
    status: "building",
    links: {
      website: "https://www.civicagents.ai/",
      blog: "/blog/ai-for-social-impact",
    },
  },
  {
    name: "Park Ping",
    summary: "Community park quality reporting and maintenance tracking",
    tags: ["Civic Tech", "Mobile"],
    status: "idea",
  },
  {
    name: "Solar Advisor",
    summary: "Rooftop solar ROI calculator with local incentive data",
    tags: ["Energy", "AI"],
    status: "idea",
  },
  {
    name: "QA AI Studio",
    summary:
      "Dedicated workspace for QA engineers - from test strategy to spinning up testing infrastructure",
    tags: ["QA", "AI", "Platform"],
    status: "idea",
  },
];

// Helper to get status emoji
export function getStatusEmoji(status: IdeaStatus): string {
  switch (status) {
    case "launched":
      return "✅";
    case "building":
      return "🔨";
    case "idea":
      return "💡";
    case "parked":
      return "🗄️";
  }
}

// Helper to get status label
export function getStatusLabel(status: IdeaStatus): string {
  switch (status) {
    case "launched":
      return "Launched";
    case "building":
      return "Building";
    case "idea":
      return "Idea";
    case "parked":
      return "Parked";
  }
}

// Calculate progress
export function getProgress(): { launched: number; total: number } {
  const launched = ideas.filter((i) => i.status === "launched").length;
  return { launched, total: ideas.length };
}
