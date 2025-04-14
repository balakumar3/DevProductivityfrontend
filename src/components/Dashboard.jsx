import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Dashboard = ({ emailId, role }) => {
    const [user, setUser] = useState(null);
    const [team, setTeam] = useState(null);

    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:4000/users/${emailId}`),
            axios.get(`http://localhost:4000/users/teams/${emailId}`)
        ])
            .then(([userRes, teamRes]) => {
                setUser(userRes.data);
                setTeam(teamRes.data);
            })
            .catch(err => console.error("Error fetching dashboard data:", err));
    }, [emailId]);

    if (!user || !team) return <div className="p-4">Loading...</div>;

    const totalCompleted = team.members.reduce((sum, m) => sum + m.completedTasks, 0);
    const totalOverdue = team.members.reduce((sum, m) => sum + m.overdueTasks, 0);
    const avgTime = (
        team.members.reduce((sum, m) => sum + m.avgCompletionTime, 0) / team.members.length
    ).toFixed(1);

    const topPerformer = team.members.reduce((top, curr) =>
        curr.completedTasks > top.completedTasks ? curr : top
    ).emailId;

    const chartData = team.members.map((m) => ({
        name: m.emailId,
        Completed: m.completedTasks,
        Overdue: m.overdueTasks,
    }));

    const userImprovementAreas = [];
    if (user.overdueTasks > 0) userImprovementAreas.push("Reduce overdue tasks");
    if (user.avgCompletionTime > 3) userImprovementAreas.push("Improve task completion speed");
    if (user.pendingTasks > 0) userImprovementAreas.push("Follow up on pending tasks");

    const teamImprovementAreas = team.members.flatMap(member => {
        const issues = [];
        if (member.overdueTasks > 2) issues.push(`${member.emailId} has many overdue tasks`);
        if (member.avgCompletionTime > 4) issues.push(`${member.emailId} has high avg completion time`);
        return issues;
    });

    return (
        <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Productivity Dashboard</h1>

            {/* User Metrics */}
            <div className="bg-white p-4 sm:p-6 rounded shadow w-full">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-600">Your Productivity</h2>
                <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base">
                    <li>Email ID: <span className="break-all">{user.emailId}</span></li>
                    <li>Completed Tasks: {user.completedTasks}</li>
                    <li>Pending Tasks: {user.pendingTasks}</li>
                    <li>Overdue Tasks: {user.overdueTasks}</li>
                    <li>Average Completion Time: {user.avgCompletionTime} hrs</li>
                </ul>

                {userImprovementAreas.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-base sm:text-lg font-semibold text-red-500">Areas for Improvement</h3>
                        <ul className="list-disc pl-5 sm:pl-6 text-gray-700 text-sm sm:text-base">
                            {userImprovementAreas.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                )}
            </div>

            {/* Team Metrics */}
            {role === 'admin' && (
                <div className="bg-white p-4 sm:p-6 rounded shadow w-full">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-green-600">Team Overview</h2>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Text Details */}
                        <div className="w-full">
                            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 text-sm sm:text-base">
                                <li>Total Completed Tasks: {totalCompleted}</li>
                                <li>Total Overdue Tasks: {totalOverdue}</li>
                                <li>Average Time to Complete: {avgTime} hrs</li>
                                <li>Top Performer: <span className="break-all">{topPerformer}</span></li>
                            </ul>

                            {teamImprovementAreas.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-red-500">Team Areas for Improvement</h3>
                                    <ul className="list-disc pl-5 sm:pl-6 text-gray-700 text-sm sm:text-base">
                                        {teamImprovementAreas.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Chart */}
                        <div className="w-full h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Completed" fill="#4ade80" />
                                    <Bar dataKey="Overdue" fill="#f87171" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
