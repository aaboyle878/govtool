import { useNavigate, generatePath } from "react-router-dom";
import { Box } from "@mui/material";

import { Typography } from "@atoms";
import { PATHS } from "@consts";
import { useCardano } from "@context";
import { useScreenDimension, useTranslation } from "@hooks";
import { ProposalData } from "@models";
import { getProposalTypeTitle, getFullGovActionId } from "@utils";
import { Slider, ValidatedGovernanceActionCard } from "@organisms";

type GovernanceActionsToVoteProps = {
  filters: string[];
  sorting: string;
  proposals: { title: string; actions: ProposalData[] }[];
  onDashboard?: boolean;
  searchPhrase?: string;
};

export const GovernanceActionsToVote = ({
  filters,
  onDashboard = true,
  proposals,
  searchPhrase,
  sorting,
}: GovernanceActionsToVoteProps) => {
  const { pendingTransaction } = useCardano();
  const navigate = useNavigate();
  const { isMobile, pagePadding } = useScreenDimension();
  const { t } = useTranslation();

  return (
    <>
      {!proposals?.length ? (
        <Typography fontWeight={300} sx={{ py: 4 }}>
          {t("govActions.noResultsForTheSearch")}
        </Typography>
      ) : (
        <>
          {proposals?.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                mx: -pagePadding,
                px: pagePadding,
                pb: 2.5,
                overflow: "hidden",
              }}
            >
              <Slider
                data={item.actions.slice(0, 6).map((action) => (
                  <div
                    className="keen-slider__slide"
                    key={action.id}
                    style={{
                      overflow: "visible",
                      width: "auto",
                    }}
                  >
                    <ValidatedGovernanceActionCard
                      {...action}
                      inProgress={
                        onDashboard &&
                        pendingTransaction.vote?.resourceId ===
                          `${action.txHash ?? ""}${action.index ?? ""}`
                      }
                      onClick={() => {
                        navigate(
                          onDashboard
                            ? generatePath(
                                PATHS.dashboardGovernanceActionsAction,
                                {
                                  proposalId: getFullGovActionId(
                                    action.txHash,
                                    action.index,
                                  ),
                                },
                              )
                            : PATHS.governanceActionsAction.replace(
                                ":proposalId",
                                getFullGovActionId(action.txHash, action.index),
                              ),
                          {
                            state: {
                              proposal: action,
                            },
                          },
                        );
                      }}
                    />
                  </div>
                ))}
                dataLength={item.actions.slice(0, 6)?.length}
                filters={filters}
                navigateKey={item.title}
                notSlicedDataLength={item.actions?.length}
                onDashboard={onDashboard}
                searchPhrase={searchPhrase}
                sorting={sorting}
                title={getProposalTypeTitle(item.title)}
              />
              {index < proposals.length - 1 && (
                <Box height={isMobile ? 40 : 52} />
              )}
            </Box>
          ))}
        </>
      )}
    </>
  );
};
