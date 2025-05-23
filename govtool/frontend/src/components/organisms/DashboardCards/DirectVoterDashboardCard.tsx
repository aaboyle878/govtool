import { useNavigate } from "react-router-dom";
import { Trans } from "react-i18next";

import { LoadingButtonProps } from "@atoms";
import { IMAGES, PATHS } from "@consts";
import { PendingTransaction } from "@context";
import { useTranslation } from "@hooks";
import { VoterInfo } from "@models";
import { DashboardActionCard, DashboardActionCardProps } from "@molecules";
import { correctVoteAdaFormat, openInNewTab } from "@utils";
import { LINKS } from "@/consts/links";

type DirectVoterDashboardCardProps = {
  pendingTransaction: PendingTransaction;
  voter: VoterInfo;
  votingPower: number | null;
};

export const DirectVoterDashboardCard = ({
  pendingTransaction,
  voter,
  votingPower,
}: DirectVoterDashboardCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const ada = correctVoteAdaFormat(votingPower ?? 0);

  // learn more button
  const learnMoreButton: LoadingButtonProps = {
    children: t("learnMore"),
    dataTestId: "direct-voter-learn-more-button",
    onClick: () => openInNewTab(LINKS.DIRECT_VOTING),
  };

  const cardProps: Partial<DashboardActionCardProps> = (() => {
    // transaction in progress
    if (
      !!pendingTransaction.registerAsDirectVoter ||
      !!pendingTransaction.retireAsDirectVoter
    ) {
      return {
        buttons: [learnMoreButton],
        state: "inProgress",
        ...(pendingTransaction.registerAsDirectVoter && {
          description: t("dashboard.cards.directVoter.registrationInProgress"),
          transactionId:
            pendingTransaction?.registerAsDirectVoter?.transactionHash,
          title: t("dashboard.cards.directVoter.registration"),
        }),
        ...(pendingTransaction.retireAsDirectVoter && {
          description: t("dashboard.cards.directVoter.retirementInProgress"),
          transactionId:
            pendingTransaction?.retireAsDirectVoter?.transactionHash,
          title: t("dashboard.cards.directVoter.retirement"),
        }),
      };
    }

    // currently registered
    if (voter?.isRegisteredAsSoleVoter) {
      return {
        buttons: [
          {
            children: t("dashboard.cards.directVoter.retire"),
            dataTestId: "retire-as-sole-voter-button",
            onClick: () => navigate(PATHS.retireAsDirectVoter),
            sx: { backgroundColor: "arcticWhite" },
          },
          { ...learnMoreButton, variant: "text" },
        ],
        description: votingPower ? (
          <Trans
            i18nKey="dashboard.cards.directVoter.isRegisteredDescription"
            values={{ votingPower: ada }}
          />
        ) : (
          <Trans i18nKey="dashboard.cards.directVoter.isRegisteredDescriptionWithoutVotingPower" />
        ),
        state: "active",
        transactionId: voter?.soleVoterRegisterTxHash,
        title: t("dashboard.cards.directVoter.youAreDirectVoterTitle"),
      };
    }

    // was registered
    if (voter?.wasRegisteredAsSoleVoter) {
      return {
        buttons: [
          {
            children: t("dashboard.cards.directVoter.reRegister"),
            dataTestId: "register-as-sole-voter-button",
            onClick: () => navigate(PATHS.registerAsDirectVoter),
            variant: "contained",
          },
          {
            children: t("learnMore"),
            dataTestId: "learn-more-button",
            onClick: () => openInNewTab(LINKS.DIRECT_VOTING),
          },
        ],
        description: (
          <Trans i18nKey="dashboard.cards.directVoter.wasRegisteredDescription" />
        ),
        transactionId: voter?.soleVoterRetireTxHash,
        title: t("dashboard.cards.directVoter.wasDirectVoterTitle"),
      };
    }

    // not registered
    return {
      buttons: [
        {
          children: t("dashboard.cards.directVoter.register"),
          dataTestId: "register-as-sole-voter-button",
          onClick: () => navigate(PATHS.registerAsDirectVoter),
          variant: "contained",
        },
        learnMoreButton,
      ],
      description: (
        <Trans i18nKey="dashboard.cards.directVoter.registerDescription" />
      ),
      title: t("dashboard.cards.directVoter.registerTitle"),
    };
  })();

  return (
    <DashboardActionCard
      imageURL={IMAGES.directVoterImage}
      type="direct-voter"
      {...cardProps}
    />
  );
};
