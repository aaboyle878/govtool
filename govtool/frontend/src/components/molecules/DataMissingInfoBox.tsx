import { Box, Link, Skeleton, SxProps } from "@mui/material";

import { Typography } from "@atoms";
import { useTranslation } from "@hooks";
import { MetadataValidationStatus } from "@models";
import { openInNewTab } from "@utils";
import { LINKS } from "@/consts/links";

export const DataMissingInfoBox = ({
  isDataMissing,
  isInProgress,
  isValidating,
  isSubmitted,
  isDrep = false,
  sx,
}: {
  isDataMissing?: MetadataValidationStatus;
  isInProgress?: boolean;
  isValidating?: boolean;
  isSubmitted?: boolean;
  isDrep?: boolean;
  sx?: SxProps;
}) => {
  const { t } = useTranslation();

  const gaMetadataErrorMessage = {
    [MetadataValidationStatus.URL_NOT_FOUND]: isDrep
      ? t("errors.dRep.message.dataMissing")
      : t("errors.gAMetadata.message.dataMissing"),
    [MetadataValidationStatus.INVALID_JSONLD]: isDrep
      ? t("errors.dRep.message.incorrectFormat")
      : t("errors.gAMetadata.message.incorrectFormat"),
    [MetadataValidationStatus.INVALID_HASH]: isDrep
      ? t("errors.dRep.message.notVerifiable")
      : t("errors.gAMetadata.message.notVerifiable"),
    [MetadataValidationStatus.INCORRECT_FORMAT]: isDrep
      ? t("errors.dRep.message.incorrectFormat")
      : t("errors.gAMetadata.message.incorrectFormat"),
  }[isDataMissing as MetadataValidationStatus];

  const gaMetadataErrorDescription = {
    [MetadataValidationStatus.URL_NOT_FOUND]: isDrep
      ? t("errors.dRep.description.dataMissing")
      : t("errors.gAMetadata.description.dataMissing"),
    [MetadataValidationStatus.INVALID_JSONLD]: isDrep
      ? t("errors.dRep.description.incorrectFormat")
      : t("errors.gAMetadata.description.incorrectFormat"),
    [MetadataValidationStatus.INVALID_HASH]: isDrep
      ? t("errors.dRep.description.notVerifiable")
      : t("errors.gAMetadata.description.notVerifiable"),
    [MetadataValidationStatus.INCORRECT_FORMAT]: isDrep
      ? t("errors.dRep.description.incorrectFormat")
      : t("errors.gAMetadata.description.incorrectFormat"),
  }[isDataMissing as MetadataValidationStatus];

  return isDataMissing && !isSubmitted && !isInProgress ? (
    <Box
      sx={{
        mb: 4,
        pr: 6,
        maxWidth: {
          xxs: "295px",
          md: "100%",
        },
        ...sx,
      }}
    >
      {isValidating ? (
        <Skeleton
          sx={{ mb: 0.5 }}
          width="128px"
          height="48px"
          variant="rounded"
        />
      ) : (
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            color: "errorRed",
            mb: 0.5,
          }}
        >
          {gaMetadataErrorMessage}
        </Typography>
      )}
      {isValidating ? (
        <Skeleton
          sx={{ mb: 0.5 }}
          width="100%"
          height="96px"
          variant="rounded"
        />
      ) : (
        <Typography
          sx={{
            fontWeight: 400,
            color: "errorRed",
            mb: 0.5,
          }}
        >
          {gaMetadataErrorDescription}
        </Typography>
      )}
      {isValidating ? (
        <Skeleton width="128px" height="24px" variant="text" />
      ) : (
        <Link
          onClick={() => openInNewTab(LINKS.DREP_ERROR_CONDITIONS)}
          sx={{
            fontFamily: "Poppins",
            fontSize: "16px",
            lineHeight: "24px",
            cursor: "pointer",
          }}
        >
          {t("learnMore")}
        </Link>
      )}
    </Box>
  ) : null;
};
