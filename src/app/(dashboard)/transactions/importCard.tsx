import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertAmountToMilliunits } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useState } from "react";
import { ImportTable } from "./importTable";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputDateFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"] as const;

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );

  const headers = data[0];
  const body = data.slice(1);

  const handleTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    if (value === "skip") return;
    if (Object.values(selectedColumns).includes(value)) return;

    setSelectedColumns((prev) => {
      return { ...prev, [columnIndex.toString()]: value };
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const columnIndexes = Object.entries(selectedColumns)
      .filter(([_key, value]) => !!value)
      .map(([key]) => Number(key));

    const transformedData = body.slice(0, -1).map((row) => {
      const transformedRow = row.reduce(
        (acc: Record<string, any>, cell, index) => {
          if (!cell) return acc;
          if (!columnIndexes.includes(index)) return acc;

          const key = selectedColumns[index]?.toString();
          if (!key) return acc;

          acc[key] = cell;
          return acc;
        },
        {}
      );
      return transformedRow;
    });

    const formattedData = transformedData.map((data) => ({
      ...data,
      amount: convertAmountToMilliunits(Number.parseFloat(data.amount)),
      date: format(parse(data.date, dateFormat, new Date()), outputDateFormat)
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleContinue}
              className="w-full lg:w-auto"
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={handleTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
