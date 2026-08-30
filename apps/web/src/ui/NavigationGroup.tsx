import {
  NAVIGATION_CATEGORY_LABELS,
  type NavigationCategoryId,
  type NavigationDestination,
  type NavigationDestinationId,
} from "../navigation/navigationRegistry";
import { NavigationPageLink } from "./NavigationPageLink";

export function NavigationGroup({
  category,
  destinations,
  collapsed,
  activeId,
  onNavigate,
}: {
  category: NavigationCategoryId;
  destinations: readonly NavigationDestination[];
  collapsed: boolean;
  activeId: NavigationDestinationId | null;
  onNavigate?: () => void;
}) {
  if (destinations.length === 0) {
    return null;
  }
  const labelId = `nav-cat-${category}`;
  const label = NAVIGATION_CATEGORY_LABELS[category];
  return (
    <div className="app-nav-group">
      <p className="app-nav-category" id={labelId} hidden={collapsed}>
        {label}
      </p>
      <div className="app-nav-pages" role="group" aria-labelledby={labelId}>
        {destinations.map((destination) => (
          <NavigationPageLink
            key={destination.id}
            destination={destination}
            collapsed={collapsed}
            current={destination.id === activeId}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
