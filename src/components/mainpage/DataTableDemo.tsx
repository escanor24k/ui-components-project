"use client";
import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import sampleUsers from "@/data/sample-users.json";
import { Section, DemoRow } from "./Section";

export function DataTableDemo(): React.ReactElement {
  const [paginationPage, setPaginationPage] = useState(3);

  return (
    <>
      <Section title="Tabelle">
        <DataTable
          data={sampleUsers}
          rowKey="id"
          showPagination
          showPrint
          showDownload
          downloadFilename="benutzer"
          pageSize={5}
          columns={[
            {
              key: "name",
              label: "Benutzer",
              sortable: true,
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name as string} size="sm" />
                  <span className="font-medium">{row.name as string}</span>
                </div>
              ),
            },
            { key: "email", label: "E-Mail", className: "text-(--text-muted)" },
            { key: "role", label: "Rolle", sortable: true },
            {
              key: "status",
              label: "Status",
              sortable: true,
              render: (row) => (
                <Badge variant={row.status as "success" | "info" | "warning" | "danger"}>
                  {row.status === "success" ? "Aktiv" : row.status === "info" ? "Eingeladen" : row.status === "warning" ? "Ausstehend" : "Inaktiv"}
                </Badge>
              ),
            },
            {
              key: "actions",
              label: "Aktionen",
              headerClassName: "text-right",
              className: "text-right",
              render: () => (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">Bearbeiten</Button>
                  <Button variant="danger" size="sm">Löschen</Button>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Pagination">
        <DemoRow label="Standalone">
          <Pagination currentPage={paginationPage} totalPages={12} onPageChange={setPaginationPage} />
        </DemoRow>
      </Section>
    </>
  );
}
