import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartTooltipContentProps = React.ComponentProps<typeof ChartTooltipContent>;
type ReusableTooltipProps = {
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelKey?: string;
  nameKey?: string;
  defaultIndex?: number;
  valueFormatter?: ChartTooltipContentProps["formatter"];
};

export function ReusableTooltip({
  indicator = "line",
  hideLabel = false,
  hideIndicator = false,
  labelKey,
  nameKey,
  defaultIndex,
  valueFormatter,
}: ReusableTooltipProps) {
  return (
    <ChartTooltip
      cursor={false}
      defaultIndex={defaultIndex}
      content={
        <ChartTooltipContent
          indicator={indicator}
          hideLabel={hideLabel}
          hideIndicator={hideIndicator}
          labelKey={labelKey}
          nameKey={nameKey}
          formatter={valueFormatter}
        />
      }
    />
  );
}
