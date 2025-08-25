import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Globe, Clock, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamMember, Leader, AppSettings } from "../../types";
import { isTimezoneSupported } from "../../utils/timezone";
import { Header } from "./Header";
import { TeamMemberCard } from "./TeamMemberCard";
import { AddMemberForm } from "./AddMemberForm";
import { MeetingTimeFinder } from "./MeetingTimeFinder";
import { TimezoneGrid } from "./TimezoneGrid";
import { TimelineView } from "./TimelineView";

interface DashboardProps {
  members: TeamMember[];
  setMembers: (
    members: TeamMember[] | ((prev: TeamMember[]) => TeamMember[])
  ) => void;
  leader: Leader | null;
  setLeader: (leader: Leader | null) => void;
  settings: AppSettings;
  setSettings: (
    settings: AppSettings | ((prev: AppSettings) => AppSettings)
  ) => void;
}

export function Dashboard({
  members,
  setMembers,
  leader,
  setLeader,
  settings,
  setSettings,
}: DashboardProps) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const addMember = (memberData: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = {
      ...memberData,
      id: crypto.randomUUID(),
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleLogout = () => {
    setLeader(null);
    setMembers([]);
    navigate("/");
  };

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-colors ${
        settings.darkMode ? "bg-background" : "bg-background"
      }`}
    >
      <Header
        leader={leader}
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddMember={() => setIsAddFormOpen(true)}
        onSettingsChange={setSettings}
        onLeaderUpdate={setLeader}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-auto sm:w-[400px]">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Team</span>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="meetings"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              Meetings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <div className="rounded-xl shadow-lg p-6 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Team Members
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {members.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl shadow-lg p-6 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Now</p>
                    <p className="text-2xl font-bold text-foreground">
                      {
                        members.filter((member) => {
                          const safeTimezone = isTimezoneSupported(
                            member.timezone
                          )
                            ? member.timezone
                            : "UTC";
                          const hour = new Intl.DateTimeFormat("en", {
                            timeZone: safeTimezone,
                            hour: "numeric",
                            hour12: false,
                          })
                            .formatToParts(currentTime)
                            .find((part) => part.type === "hour")?.value;
                          const currentHour = hour
                            ? Number.parseInt(hour, 10)
                            : 0;
                          return (
                            currentHour >= member.workingHours.start &&
                            currentHour < member.workingHours.end
                          );
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl shadow-lg p-6 bg-card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timezones</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Set(members.map((m) => m.timezone)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timezone Grid */}
            <TimezoneGrid members={members} settings={settings} />

            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Team Members
                </h2>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredMembers.length} of {members.length} members
                  </p>
                )}
              </div>
              {filteredMembers.length === 0 ? (
                <div className="rounded-xl shadow-lg p-12 text-center bg-card">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {searchQuery ? "No Members Found" : "No Team Members Yet"}
                  </h3>
                  <p
                    className={`mb-6 ${
                      settings.darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Add your first team member to get started tracking timezones"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setIsAddFormOpen(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Users className="w-4 h-4" />
                      <span>Add First Member</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      onRemove={removeMember}
                      settings={settings}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-8">
            <TimelineView
              members={members}
              settings={settings}
              leader={leader}
            />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-8">
            <MeetingTimeFinder
              members={members}
              settings={settings}
              leader={leader}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Member Form */}
      <AddMemberForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={addMember}
        settings={settings}
      />
    </div>
  );
}
