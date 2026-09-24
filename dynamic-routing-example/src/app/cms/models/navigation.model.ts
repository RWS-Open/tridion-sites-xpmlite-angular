export interface NavItem {
    id: string;
    title: string;
    routePath: string;
    rawUrl: string;
    visible: boolean;
    children: NavItem[];
  }