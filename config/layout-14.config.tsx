import { MenuConfig } from "@/config/types";
import {
  ChartLine,
  Cog,
  UserRoundCog,
  Bolt,
  Users,
  Download,
  FileChartLine,
  SquareActivity,
  Newspaper,
  Briefcase,
  Megaphone,
  Palette,
  BarChart2,
  Handshake,
  ClipboardList,
  Grid,
  Calendar,
  BarChart3,
  Network,
  Phone,
  MessageCircle
} from "lucide-react";

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  {
    children: [
      {
        title: 'Dashboard',
        path: '/',
        icon: BarChart3
      },
      {
        title: 'Campaigns',
        path: '/campaign',
        icon: Network
      },
      {
        title: 'IVR',
        path: '/ivr',
        icon: Phone
      },
      {
        title: 'WhatsApp',
        path: '/whatsapp',
        icon: MessageCircle
      },
    ],
  }
];

export const MENU_SIDEBAR_RESOURCES: MenuConfig = [
  {
    title: 'Resources',
    children: [
      {
        title: 'About Metronic',
        path: '#',
        icon: Download
      },
      {
        title: 'Advertise',
        path: '#',
        icon: FileChartLine,
        badge: 'Pro'
      },
      {
        title: 'Help',
        path: '#',
        icon: SquareActivity
      },
      {
        title: 'Blog',
        path: '#',
        icon: Newspaper
      },
      {
        title: 'Careers',
        path: '#',
        icon: Briefcase
      },
      {
        title: 'Press',
        path: '#',
        icon: Megaphone
      },
    ],
  }
];

export const MENU_SIDEBAR_WORKSPACES: MenuConfig = [
  {
    title: 'Workspaces',
    children: [
      {
        title: 'Business Concepts',
        path: '#',
        icon: Briefcase
      },
      {
        title: 'KeenThemes Studio',
        path: '#',
        icon: Palette
      },
      {
        title: 'Teams',
        path: '#',
        icon: Handshake,
        badge: 'Pro'
      },
      {
        title: 'Reports',
        path: '#',
        icon: BarChart2
      },
    ],
  }
];

export const MENU_TOOLBAR: MenuConfig = [
  {
    title: 'Overview',
    path: '/',
    icon: BarChart3
  },
  {
    title: 'Analytics',
    path: '/?tab=analytics',
    icon: BarChart2
  },
  {
    title: 'AI Assistant',
    path: '/?tab=ai',
    icon: Bolt
  },
];
