"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartAccounts } from "@/components/accounting/chart-accounts";
import { JournalEntries } from "@/components/accounting/journal-entries";

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("chart-accounts");

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chart-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal-entries">Journal Entries</TabsTrigger>
        </TabsList>
        <TabsContent value="chart-accounts">
          <ChartAccounts />
        </TabsContent>
        <TabsContent value="journal-entries">
          <JournalEntries />
        </TabsContent>
      </Tabs>
    </div>
  );
}
