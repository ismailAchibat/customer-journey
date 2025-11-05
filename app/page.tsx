"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      name: "Jane Cooper",
      company: "Microsoft",
      phone: "(225) 555-0118",
      email: "jane@microsoft.com",
      country: "United States",
      status: "Active",
    },
    {
      name: "Floyd Miles",
      company: "Yahoo",
      phone: "(205) 555-0100",
      email: "floyd@yahoo.com",
      country: "Kiribati",
      status: "Inactive",
    },
    {
      name: "Ronald Richards",
      company: "Adobe",
      phone: "(302) 555-0107",
      email: "ronald@adobe.com",
      country: "Israel",
      status: "Inactive",
    },
    {
      name: "Marvin McKinney",
      company: "Tesla",
      phone: "(252) 555-0126",
      email: "marvin@tesla.com",
      country: "Iran",
      status: "Active",
    },
    {
      name: "Jerome Bell",
      company: "Google",
      phone: "(629) 555-0129",
      email: "jerome@google.com",
      country: "Réunion",
      status: "Active",
    },
    {
      name: "Kathryn Murphy",
      company: "Microsoft",
      phone: "(406) 555-0120",
      email: "kathryn@microsoft.com",
      country: "Curaçao",
      status: "Active",
    },
  ];

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-6 text-2xl font-bold text-gray-900">Dashboard</div>
          <nav className="px-4 space-y-2">
            <SidebarItem label="Dashboard" />
            <SidebarItem label="Product" />
            <SidebarItem label="Customers" active />
            <SidebarItem label="Income" />
            <SidebarItem label="Promote" />
            <SidebarItem label="Help" />
          </nav>
        </div>

        {/* Bottom profile section */}
        <div className="p-4 border-t flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
            E
          </div>
          <div>
            <p className="font-semibold">Evano</p>
            <p className="text-sm text-gray-500">Project Manager</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Hello Evano <span className="text-2xl">👋</span>
          </h1>

          <div className="relative w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <div>
              <h2 className="font-semibold text-lg">All Customers</h2>
              <p className="text-sm text-green-600 font-medium">
                Active Members
              </p>
            </div>
            <Button variant="outline" size="sm">
              Sort by: Newest
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.company}</td>
                  <td className="px-6 py-4">{c.phone}</td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4">{c.country}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      className={
                        c.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 px-6 py-4 border-t text-sm">
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="ghost" size="sm">
              2
            </Button>
            <Button variant="ghost" size="sm">
              3
            </Button>
            <Button variant="ghost" size="sm">
              ...
            </Button>
            <Button variant="ghost" size="sm">
              40
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full px-4 py-2 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
