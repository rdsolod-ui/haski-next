export const ANALYTICS_GOALS = {
  ticket: "ticket",
  dogOpen: "dog_open",
  favoriteAdd: "favorite_add",
  favoriteRemove: "favorite_remove",
  search: "search",
  filter: "filter",
  sectionOpen: "section_open",
} as const;

export type AnalyticsGoal = (typeof ANALYTICS_GOALS)[keyof typeof ANALYTICS_GOALS];
export type AnalyticsParams = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
  __haskiReachGoal?: (goal: AnalyticsGoal, params?: AnalyticsParams) => void;
};

export function trackGoal(goal: AnalyticsGoal, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  (window as AnalyticsWindow).__haskiReachGoal?.(goal, {
    path: window.location.pathname,
    ...params,
  });
}
