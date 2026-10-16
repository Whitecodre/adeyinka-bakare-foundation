"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { DashboardCard } from "@/components/admin/dashboard-card";
import { LoadingState } from "@/components/admin/loading-state";
import { EmptyState } from "@/components/admin/empty-state";
import {
  Users,
  UserPlus,
  GraduationCap,
  Calendar,
  BookOpen,
  MessageSquare,
  Newspaper,
  CheckCircle2,
} from "lucide-react";

interface DashboardStats {
  totalMembers: number;
  totalVolunteers: number;
  totalBeneficiaries: number;
  activeEvents: number;
  totalProgrammes: number;
  totalTestimonials: number;
  totalNews: number;
}

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats from API
        const [statsRes, activityRes] = await Promise.all([
          fetch("/api/admin/stats").then(r => r.json()),
          fetch("/api/admin/activity").then(r => r.json()),
        ]);

        if (statsRes.success) {
          setStats(statsRes.data);
        } else {
          console.error("Error loading stats:", statsRes.error);
          setStats({
            totalMembers: 0,
            totalVolunteers: 0,
            totalBeneficiaries: 0,
            activeEvents: 0,
            totalProgrammes: 0,
            totalTestimonials: 0,
            totalNews: 0,
          });
        }

        if (activityRes.success) {
          setRecentActivity(activityRes.data);
        } else {
          setRecentActivity([]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setStats({
          totalMembers: 0,
          totalVolunteers: 0,
          totalBeneficiaries: 0,
          activeEvents: 0,
          totalProgrammes: 0,
          totalTestimonials: 0,
          totalNews: 0,
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your fellowship activities"
        />
        <LoadingState message="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Platform performance metrics and insights"
        aside={
          <span className="inline-flex items-center gap-1.5 text-success text-xs font-semibold"> <CheckCircle2 size={14} /> Live data </span>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Members"
          value={stats?.totalMembers?.toString() || "0"}
          icon={Users}
          color="maroon"
        />
        <DashboardCard
          title="Volunteers"
          value={stats?.totalVolunteers?.toString() || "0"}
          icon={UserPlus}
          color="gold"
        />
        <DashboardCard
          title="Beneficiaries"
          value={stats?.totalBeneficiaries?.toString() || "0"}
          icon={GraduationCap}
          color="maroon"
        />
        <DashboardCard
          title="Active Events"
          value={stats?.activeEvents?.toString() || "0"}
          icon={Calendar}
          color="gold"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Programmes"
          value={stats?.totalProgrammes?.toString() || "0"}
          icon={BookOpen}
          color="maroon"
        />
        <DashboardCard
          title="Testimonials"
          value={stats?.totalTestimonials?.toString() || "0"}
          icon={MessageSquare}
          color="gold"
        />
        <DashboardCard
          title="News Articles"
          value={stats?.totalNews?.toString() || "0"}
          icon={Newspaper}
          color="maroon"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-bold text-foreground mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <EmptyState
            title="No recent activity yet"
            description="Activity will appear here as you use the platform"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-gold-300 mt-2.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-foreground text-sm">{activity.action}</div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-muted-foreground text-xs">{activity.user}</span>
                    <span className="text-muted-foreground/70 text-xs">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
