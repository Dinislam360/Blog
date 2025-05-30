
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import { FileText, Tags, Settings2, BarChart3, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const { posts, categories } = useAppContext();

  const stats = [
    { title: "Total Posts", value: posts.length, icon: FileText, color: "text-blue-500", bgColor: "bg-blue-100" },
    { title: "Total Categories", value: categories.length, icon: Tags, color: "text-green-500", bgColor: "bg-green-100" },
    // Add more stats as needed, e.g., comments, users if implemented
    // { title: "Total Users", value: "1", icon: Users, color: "text-purple-500", bgColor: "bg-purple-100" },
    // { title: "Site Traffic", value: "Coming Soon", icon: BarChart3, color: "text-yellow-500", bgColor: "bg-yellow-100" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Quickly jump to common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/posts/new"><FileText className="mr-2 h-4 w-4" />Create New Post</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/categories"><Tags className="mr-2 h-4 w-4" />Manage Categories</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/settings"><Settings2 className="mr-2 h-4 w-4" />Site Settings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent posts.</CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length > 0 ? (
              <ul className="space-y-3">
                {posts.slice(0, 3).map(post => (
                  <li key={post.id} className="text-sm flex justify-between items-center">
                    <Link href={`/admin/posts/edit/${post.id}`} className="hover:text-primary transition-colors truncate max-w-[70%]">
                      {post.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent posts.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
