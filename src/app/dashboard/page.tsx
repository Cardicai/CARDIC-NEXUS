import DashboardClient from './DashboardClient';

const DASHBOARD_PREFETCH_DELAY = 1200;

export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, DASHBOARD_PREFETCH_DELAY));

  return <DashboardClient />;
}
