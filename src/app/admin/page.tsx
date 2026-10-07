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
    // TODO: Replace with actual Supabase queries
    // This will be integrated when database is connected
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate loading - replace with actual Supabase calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Example of what the data structure will be:
        // const { data: members } = await supabase.from('members').select('count')
        // const { data: volunteers } = await supabase.from('volunteers').select('count')
        // etc.
        
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
      } catch (error) {
        console.error("Error loading dashboard data:", error);
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
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1816] m-0">Dashboard Overview</h1>
          <p className="text-[#2d1816]/60 mt-1 text-sm">Platform performance metrics and insights</p>
        </div>
        <div className="flex gap-3 items-center">
          <span className="inline-flex items-center gap-1.5 text-[#10b981] text-xs font-semibold">
            <CheckCircle2 size={14} /> Live data
          </span>
        </div>
      </div>

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
      <div className="bg-[#fffdf8] border border-[#e9ddd3] rounded-xl p-5">
        <h3 className="text-base font-bold text-[#2d1816] mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <EmptyState
            title="No recent activity yet"
            description="Activity will appear here as you use the platform"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#f8c84d] mt-2.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-[#2d1816] text-sm">{activity.action}</div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[#2d1816]/60 text-xs">{activity.user}</span>
                    <span className="text-[#2d1816]/40 text-xs">{activity.time}</span>
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
