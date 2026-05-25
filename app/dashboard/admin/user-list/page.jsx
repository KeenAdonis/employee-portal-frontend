"use client";

import { useEffect, useState } from "react";

import {
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { getUsers } from "@/services/userService";

import UsersTable from "@/components/adminsuper/UserTable";

import CreateAdminModal from "@/components/adminsuper/CreateAdminModal";

export default function UsersPage() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | FETCH USERS
  |--------------------------------------------------------------------------
  */
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const response = await getUsers();

      setUsers(response.data.data);

    } catch (error) {

      console.error(
        "Fetch Users Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL FETCH
  |--------------------------------------------------------------------------
  */
  useEffect(() => {

    fetchUsers();

  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <div>

          <h1 className="text-2xl font-bold">
            User Management
          </h1>

          <p className="text-muted-foreground">
            Manage all system users.
          </p>

        </div>

        {/* CREATE BUTTON */}
        <Button
          onClick={() =>
            setOpenCreateModal(true)
          }
          className="
            bg-gradient-to-r
            from-amber-400
            to-amber-500
            text-white
            hover:from-amber-300
            hover:to-amber-400
            shadow-md
            shadow-amber-500/30
          "
        >

          <Plus className="w-4 h-4 mr-2" />

          Create User

        </Button>

      </div>

      {/* TABLE */}
      <UsersTable
        data={users}
        loading={loading}

        onView={(user) => {
          console.log("VIEW", user);
        }}

        onEdit={(user) => {
          console.log("EDIT", user);
        }}

        onDelete={(user) => {
          console.log("DELETE", user);
        }}

        onResetPassword={(user) => {
          console.log(
            "RESET PASSWORD",
            user
          );
        }}
      />

      {/* CREATE MODAL */}
      <CreateAdminModal
        open={openCreateModal}
        onClose={() =>
          setOpenCreateModal(false)
        }

        onSuccess={() => {

          fetchUsers();

        }}
      />

    </div>
  );
}