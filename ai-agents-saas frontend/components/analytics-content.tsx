import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsContent({ analytics }: { analytics: any }) {
  if (!analytics) return null;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalGenerations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.uptime}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.avgResponseTime}s</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Most Popular Tools</h2>
        <ul className="list-disc pl-6">
          {analytics.mostPopularTools && analytics.mostPopularTools.length > 0 ? (
            analytics.mostPopularTools.map((tool: any, idx: number) => (
              <li key={idx} className="mb-1">
                <span className="font-medium">{tool.name}</span>: {tool.uses} uses
              </li>
            ))
          ) : (
            <li>No data available</li>
          )}
        </ul>
      </div>
    </div>
  );
} 