export enum DateFilterType {
  Last3Months = "Last3Months",
  Last6Months = "Last6Months",
  LastYear = "LastYear",
  Last30Days = "Last30Days",
  Last7Days = "Last7Days",
  Yesterday = "Yesterday",
  Today = "Today"
}
export enum ChequesDateFilterType {
  TomorrowDate = "TomorrowDate",
  Next7DaysDate = "Next7DaysDate",
  Next30DaysDate = "Next30DaysDate",
}

export type DateFilterTypeUnion = "Last30Days" | "Last7Days" | "Yesterday" | "Today";
