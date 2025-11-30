import React, { memo, useCallback } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  // PickerHeaderCard,
  // PickerBodyCard,
  PickerHeaderContent,
  // PickerBodyContent,
  PickerDivider,
  OptionRow,
  OptionTitle,
  OptionDesc,
} from "./PersonalityCard.style";

export type PersonalityOption = {
  id: string;
  name: string;
  summery?: string;
  description?: string;
  tone?: "default" | "danger";
};

type Props = {
  title: string;
  iconSrc?: string;
  icon?: React.ReactElement;
  options: PersonalityOption[];
  value: string | null;
  onChange: (id: string) => void;
};

const OptionItem = memo(function OptionItem({
  option,
  selected,
  onSelect,
  withDivider,
}: {
  option: PersonalityOption;
  selected: boolean;
  onSelect: () => void;
  withDivider: boolean;
}) {
  const danger = option.tone === "danger";

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <OptionRow
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      selected={selected}
      danger={danger}
      withDivider={withDivider}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <OptionTitle selected={selected} danger={danger}>
        {option.name}
        {option.summery && (
          <span style={{
            fontSize: "13px",
            fontWeight: 400,
            color: danger ? "#dc3545" : selected ? "#d32f2f" : "#7f8c8d",
            marginLeft: "6px"
          }}>
            ({option.summery})
          </span>
        )}
      </OptionTitle>

      {option.description && (
        <OptionDesc selected={selected} danger={danger}>
          {option.description}
        </OptionDesc>
      )}
    </OptionRow>
  );
});

const PersonalityPickerCard: React.FC<Props> = ({
  title,
  iconSrc,
  icon,
  options,
  value,
  onChange,
}) => {
  const theme = useTheme();

  const handleSelect = useCallback(
    (id: string) => onChange(id),
    [onChange]
  );

  return (
    <Box role="radiogroup" aria-label={title}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: theme.shadows[1],
          margin: "16px",
          maxWidth: "calc(100vw - 32px)", 
        }}
      >
        <PickerHeaderContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: "16px",
                flex: 1,
                textAlign: "right",
                marginTop: "4px",
                color: theme.palette.text.primary
              }}
            >
              {title}
            </Typography>
            {icon && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {icon}
              </Box>
            )}
            {iconSrc && !icon && (
              <Box
                component="img"
                src={iconSrc}
                alt={title}
                sx={{
                  width: 24,
                  height: 24,
                }}
              />
            )}
          </Box>
        </PickerHeaderContent>

        <PickerDivider />

        <Box sx={{ padding: "8px" }}>
          {options.map((opt, i) => (
            <OptionItem
              key={opt.id}
              option={opt}
              selected={value === opt.id}
              onSelect={() => handleSelect(opt.id)}
              withDivider={i < options.length - 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalityPickerCard;
