"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  ChefHat,
  BadgeIndianRupee,
  Phone,
  Mail,
  X,
} from "lucide-react";

type Staff = {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  salary: number;
  status: "Active" | "On Leave" | "Off Duty";
};

export default function StaffPage() {
  const [search, setSearch] = useState("");

  const [staff, setStaff] = useState<Staff[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Head Chef",
      phone: "+91 9876543210",
      email: "rahul@vibebite.com",
      salary: 45000,
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "Waiter",
      phone: "+91 9123456789",
      email: "priya@vibebite.com",
      salary: 22000,
      status: "Active",
    },
    {
      id: 3,
      name: "Aman Verma",
      role: "Cashier",
      phone: "+91 9988776655",
      email: "aman@vibebite.com",
      salary: 28000,
      status: "On Leave",
    },
    {
      id: 4,
      name: "Sneha Kapoor",
      role: "Kitchen Staff",
      phone: "+91 9000011111",
      email: "sneha@vibebite.com",
      salary: 24000,
      status: "Off Duty",
    },
    {
      id: 5,
      name: "Rohit Mehta",
      role: "Manager",
      phone: "+91 9112233445",
      email: "rohit@vibebite.com",
      salary: 60000,
      status: "Active",
    },
  ]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    salary: "",
    status: "Active" as "Active" | "On Leave" | "Off Duty",
  });

  const filteredStaff = useMemo(() => {
    return staff.filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [staff, search]);

  // Actions
  const handleDeleteStaff = (id: number) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaff((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditSave = () => {
    if (!selectedStaff) return;
    setStaff((prev) =>
      prev.map((item) => (item.id === selectedStaff.id ? selectedStaff : item))
    );
    setShowEditModal(false);
    setSelectedStaff(null);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#3F6B63] flex items-center gap-3">
            <Users className="w-10 h-10" />
            Staff Management
          </h1>
          <p className="text-gray-500 mt-2">
            Manage restaurant employees, salaries and work status.
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border bg-white w-72 outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#3F6B63] hover:bg-[#355b54] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition font-semibold"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <Users className="w-10 h-10 text-[#3F6B63]" />
          <p className="text-gray-500 mt-4">Total Employees</p>
          <h2 className="text-3xl font-bold mt-2">{staff.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <ChefHat className="w-10 h-10 text-green-600" />
          <p className="text-gray-500 mt-4">Active Staff</p>
          <h2 className="text-3xl font-bold mt-2">
            {staff.filter((member) => member.status === "Active").length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <BadgeIndianRupee className="w-10 h-10 text-orange-500" />
          <p className="text-gray-500 mt-4">Monthly Payroll</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹
            {staff
              .reduce((sum, member) => sum + member.salary, 0)
              .toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <UserPlus className="w-10 h-10 text-blue-600" />
          <p className="text-gray-500 mt-4">On Leave</p>
          <h2 className="text-3xl font-bold mt-2">
            {staff.filter((member) => member.status === "On Leave").length}
          </h2>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="mt-10">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="w-16 h-16 rounded-full bg-[#3F6B63] text-white flex items-center justify-center text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold mt-4">{member.name}</h2>
                  <p className="text-[#F97316] font-medium">{member.role}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : member.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#F97316]" />
                  <span>{member.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#F97316]" />
                  <span className="break-all">{member.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <BadgeIndianRupee className="w-5 h-5 text-[#F97316]" />
                  <span>₹{member.salary.toLocaleString()}/month</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedStaff(member);
                    setShowViewModal(true);
                  }}
                  className="bg-[#3F6B63] hover:bg-[#355b54] text-white py-2 rounded-xl transition font-medium"
                >
                  View
                </button>

                <button
                  onClick={() => {
                    setSelectedStaff({ ...member });
                    setShowEditModal(true);
                  }}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white py-2 rounded-xl transition font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredStaff.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl">
              No staff members found.
            </div>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Department Distribution */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            👨‍🍳 Department Distribution
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span>Kitchen</span>
                <span>40%</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="bg-[#F97316] h-full w-[40%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Service Staff</span>
                <span>30%</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="bg-[#3F6B63] h-full w-[30%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Management</span>
                <span>20%</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="bg-blue-500 h-full w-[20%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Cleaning Staff</span>
                <span>10%</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="bg-green-500 h-full w-[10%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee of the Month */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🏆 Employee of the Month
          </h2>

          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#3F6B63] flex items-center justify-center text-white text-4xl font-bold">
              R
            </div>

            <h3 className="text-2xl font-bold mt-5">Rahul Sharma</h3>

            <p className="text-[#F97316] font-medium">Head Chef</p>

            <p className="text-gray-500 mt-4 max-w-sm">
              Achieved the highest customer satisfaction score and maintained
              excellent kitchen efficiency this month.
            </p>

            <button className="mt-6 bg-[#3F6B63] hover:bg-[#355b54] text-white px-6 py-3 rounded-xl transition font-medium">
              View Performance
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Shifts */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🔔 Staff Notifications
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-xl">
              <h3 className="font-semibold">Shift Started</h3>
              <p className="text-gray-600 text-sm mt-1">
                Morning kitchen staff checked in successfully.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-xl">
              <h3 className="font-semibold">Leave Request</h3>
              <p className="text-gray-600 text-sm mt-1">
                Aman Verma requested leave for tomorrow.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold">Training Reminder</h3>
              <p className="text-gray-600 text-sm mt-1">
                Hygiene training scheduled for Friday at 10:00 AM.
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📅 Upcoming Shifts
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <div>
                <h3 className="font-semibold">Rahul Sharma</h3>
                <p className="text-sm text-gray-500">Head Chef</p>
              </div>
              <span className="font-medium">9:00 AM</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <div>
                <h3 className="font-semibold">Priya Singh</h3>
                <p className="text-sm text-gray-500">Waiter</p>
              </div>
              <span className="font-medium">10:00 AM</span>
            </div>

            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Sneha Kapoor</h3>
                <p className="text-sm text-gray-500">Kitchen Staff</p>
              </div>
              <span className="font-medium">11:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance & Payroll */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Staff Performance */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📈 Staff Performance
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Rahul Sharma</h3>
                <p className="text-sm text-gray-500">Head Chef</p>
              </div>
              <span className="font-bold text-green-600">⭐ 98%</span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Priya Singh</h3>
                <p className="text-sm text-gray-500">Waiter</p>
              </div>
              <span className="font-bold text-blue-600">⭐ 94%</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Sneha Kapoor</h3>
                <p className="text-sm text-gray-500">Kitchen Staff</p>
              </div>
              <span className="font-bold text-orange-600">⭐ 91%</span>
            </div>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            💰 Payroll Summary
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-green-50 rounded-xl p-5">
              <p className="text-gray-500">Monthly Payroll</p>
              <h3 className="text-3xl font-bold mt-2 text-green-700">
                ₹
                {(
                  staff.reduce((sum, m) => sum + m.salary, 0) / 100000
                ).toFixed(2)}
                L
              </h3>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-500">Employees Paid</p>
              <h3 className="text-3xl font-bold mt-2 text-blue-700">
                {staff.length}
              </h3>
            </div>

            <div className="bg-orange-50 rounded-xl p-5">
              <p className="text-gray-500">Pending Salary</p>
              <h3 className="text-3xl font-bold mt-2 text-orange-600">₹24K</h3>
            </div>

            <div className="bg-purple-50 rounded-xl p-5">
              <p className="text-gray-500">Attendance</p>
              <h3 className="text-3xl font-bold mt-2 text-purple-700">96%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent HR Activity */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
          📋 Recent HR Activity
        </h2>

        <div className="space-y-5">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">New Employee Joined</h3>
              <p className="text-gray-500 text-sm">
                Arjun Singh joined as Waiter.
              </p>
            </div>
            <span className="text-sm text-gray-400">Today</span>
          </div>

          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">Salary Processed</h3>
              <p className="text-gray-500 text-sm">
                July payroll processed successfully.
              </p>
            </div>
            <span className="text-sm text-gray-400">Yesterday</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Training Completed</h3>
              <p className="text-gray-500 text-sm">
                Food Safety & Hygiene certification completed.
              </p>
            </div>
            <span className="text-sm text-gray-400">2 Days Ago</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t pt-6 text-center text-gray-500">
        <p>© 2026 VibeBite Staff Management</p>
        <p className="mt-2">
          Built with ❤️ using Next.js, Tailwind CSS & Supabase
        </p>
      </footer>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 text-[#3F6B63]">
              Add New Staff
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Name"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F97316]"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, name: e.target.value })
                }
              />

              <input
                placeholder="Role"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F97316]"
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, role: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F97316]"
                value={newStaff.phone}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, phone: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F97316]"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Salary"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F97316]"
                value={newStaff.salary}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, salary: e.target.value })
                }
              />

              <select
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F97316]"
                value={newStaff.status}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    status: e.target.value as "Active" | "On Leave" | "Off Duty",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border rounded-xl py-3 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!newStaff.name || !newStaff.role || !newStaff.phone)
                    return;

                  setStaff([
                    ...staff,
                    {
                      id: Date.now(),
                      name: newStaff.name,
                      role: newStaff.role,
                      phone: newStaff.phone,
                      email:
                        newStaff.email ||
                        `${newStaff.name.toLowerCase().replace(/\s+/g, "")}@vibebite.com`,
                      salary: Number(newStaff.salary) || 20000,
                      status: newStaff.status,
                    },
                  ]);

                  setNewStaff({
                    name: "",
                    role: "",
                    phone: "",
                    email: "",
                    salary: "",
                    status: "Active",
                  });

                  setShowAddModal(false);
                }}
                className="flex-1 bg-[#3F6B63] text-white rounded-xl py-3 font-semibold hover:bg-[#355b54]"
              >
                Save Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-4 text-[#3F6B63]">
              Staff Profile
            </h2>
            <div className="space-y-3 text-lg">
              <p>
                <strong>Name:</strong> {selectedStaff.name}
              </p>
              <p>
                <strong>Role:</strong> {selectedStaff.role}
              </p>
              <p>
                <strong>Phone:</strong> {selectedStaff.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedStaff.email}
              </p>
              <p>
                <strong>Salary:</strong> ₹{selectedStaff.salary.toLocaleString()}
                /month
              </p>
              <p>
                <strong>Status:</strong> {selectedStaff.status}
              </p>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="mt-6 w-full bg-[#3F6B63] text-white py-3 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 text-[#F97316]">
              Edit Staff Member
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Name"
                className="w-full border rounded-xl p-3 outline-none"
                value={selectedStaff.name}
                onChange={(e) =>
                  setSelectedStaff({ ...selectedStaff, name: e.target.value })
                }
              />

              <input
                placeholder="Role"
                className="w-full border rounded-xl p-3 outline-none"
                value={selectedStaff.role}
                onChange={(e) =>
                  setSelectedStaff({ ...selectedStaff, role: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                className="w-full border rounded-xl p-3 outline-none"
                value={selectedStaff.phone}
                onChange={(e) =>
                  setSelectedStaff({ ...selectedStaff, phone: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="w-full border rounded-xl p-3 outline-none"
                value={selectedStaff.email}
                onChange={(e) =>
                  setSelectedStaff({ ...selectedStaff, email: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Salary"
                className="w-full border rounded-xl p-3 outline-none"
                value={selectedStaff.salary}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    salary: Number(e.target.value),
                  })
                }
              />

              <select
                className="w-full border rounded-xl p-3 outline-none"
                value={selectedStaff.status}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    status: e.target.value as "Active" | "On Leave" | "Off Duty",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 border rounded-xl py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSave}
                className="flex-1 bg-[#F97316] text-white rounded-xl py-3 font-semibold hover:bg-[#EA580C]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}