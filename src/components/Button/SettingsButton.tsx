import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Settings, Database } from "lucide-react";
import { toast } from "sonner";

interface Props {
  branch?: string;
}

export default function SettingsEvaluasiSales({ branch }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => toast.success(`Branch dipilih: ${branch}`)}>
          <Database className="mr-2 h-4 w-4" />

          {branch || "Pilih Branch"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
