import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { UserCog } from "lucide-react";

const roles: Role[] = ["Command Center","Traffic Police","Field Officer","Emergency Services","Viewer"];

export function RoleSelector() {
  const { role, dispatch } = useApp();
  return (
    <label className="chip cursor-pointer text-white">
      <UserCog className="w-3 h-3 text-[var(--color-predict)]" />
      Role
      <select
        value={role}
        onChange={(e) => dispatch({ type: "SET_ROLE", role: e.target.value as Role })}
        className="bg-transparent outline-none ml-1 font-semibold uppercase text-[10px] tracking-wider text-white"
      >
        {roles.map((r) => (
          <option key={r} value={r} className="bg-[var(--card)]">{r}</option>
        ))}
      </select>
    </label>
  );
}
