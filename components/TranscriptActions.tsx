"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const TranscriptActions = () => {
    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        alert("Export functionality coming soon!");
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
            >
                <Printer className="w-4 h-4" />
                Print
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
            >
                <Download className="w-4 h-4" />
                Export
            </Button>
        </div>
    );
};

export default TranscriptActions;
