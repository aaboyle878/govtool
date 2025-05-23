import { useState, useEffect } from "react";

import { useValidateMutation } from "@/hooks/mutations";
import { MetadataStandard, ProposalData, VotedProposal } from "@/models";
import { GovernanceVotedOnCard } from "../molecules";

type Props = {
  votedProposal: VotedProposal;
  inProgress?: boolean;
};
export const ValidatedGovernanceVotedOnCard = ({
  votedProposal,
  inProgress,
}: Props) => {
  const [isValidating, setIsValidating] = useState(false);
  const [metadataStatus, setMetadataStatus] = useState<
    MetadataValidationStatus | undefined
  >();
  const { validateMetadata } = useValidateMutation();
  const [extendedVotedProposal, setExtendedVotedProposal] =
    useState<VotedProposal>(votedProposal);

  useEffect(() => {
    if (!votedProposal.proposal.url) return;

    const validate = async () => {
      setIsValidating(true);

      const { status, metadata } = await validateMetadata({
        standard: MetadataStandard.CIP108,
        url: votedProposal.proposal.url,
        hash: votedProposal.proposal.metadataHash,
      });

      if (metadata) {
        setExtendedVotedProposal((prevProposal) => ({
          ...(prevProposal || {}),
          proposal: {
            ...(prevProposal.proposal || {}),
            ...(metadata as Pick<
              ProposalData,
              "title" | "abstract" | "motivation" | "rationale"
            >),
          },
        }));
      }
      setMetadataStatus(status);
      setIsValidating(false);
    };
    validate();
  }, [votedProposal.proposal.url]);

  return (
    <GovernanceVotedOnCard
      votedProposal={extendedVotedProposal}
      inProgress={inProgress}
      isValidating={isValidating}
      metadataStatus={metadataStatus}
    />
  );
};
