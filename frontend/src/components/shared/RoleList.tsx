/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// Import the RoleCard component that will be used to display individual roles
import RoleCard from "./RoleCard";

// Define the props interface for the RoleList component
interface RoleListProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Array of roles that will be displayed in the list
  roles: Array<any>;
  // Type of role - must be either "student", "professor", or "business"
  roleType: "student" | "professor" | "business";
}

// Define the RoleList component as a functional component with RoleListProps type
const RoleList: React.FC<RoleListProps> = ({ roles, roleType }) => {
  return (
    // Container div with responsive grid layout
    // - 1 column on mobile (grid-cols-1)
    // - 2 columns on medium screens (md:grid-cols-2)
    // - 3 columns on large screens (lg:grid-cols-3)
    // - gap-6 adds spacing between grid items
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Map through the roles array and render a RoleCard component for each role */}
      {/* Each RoleCard receives a unique key, the role data, and the roleType */}
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} roleType={roleType} />
      ))}
    </div>
  );
};

// Export the RoleList component as the default export
export default RoleList;
