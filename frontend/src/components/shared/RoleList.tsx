import React from "react";
import RoleCard from "./RoleCard";

interface RoleListProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles: Array<any>;
  roleType: "student" | "professor" | "business";
}

const RoleList: React.FC<RoleListProps> = ({ roles, roleType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} roleType={roleType} />
      ))}
    </div>
  );
};

export default RoleList;
