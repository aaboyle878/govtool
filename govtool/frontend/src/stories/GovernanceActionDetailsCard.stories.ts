import { MetadataValidationStatus, ProposalData } from "@models";
import { GovernanceActionDetailsCard } from "@organisms";
import { expect, jest } from "@storybook/jest";
import type { Meta, StoryObj } from "@storybook/react";
import { screen, userEvent, waitFor, within } from "@storybook/testing-library";
import { formatDisplayDate, getProposalTypeNoEmptySpaces } from "@/utils";
import { GovernanceActionType } from "@/types/governanceAction";

const meta = {
  title: "Example/GovernanceActionDetailsCard",
  component: GovernanceActionDetailsCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GovernanceActionDetailsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  isDataMissing: null,
  proposal: {
    id: '1',
    index: 1,
    txHash: "exampleTxHash",
    createdDate: new Date().toISOString(),
    createdEpochNo: 1000000,
    expiryEpochNo: 1000001,
    expiryDate: new Date().toISOString(),
    type: GovernanceActionType.InfoAction,
    url: "https://exampleurl.com",
    title: "Example title",
    dRepYesVotes: 1000000,
    dRepNoVotes: 302,
    dRepAbstainVotes: 350,
    poolYesVotes: 1,
    poolNoVotes: 0,
    poolAbstainVotes: 2,
    ccYesVotes: 1,
    ccNoVotes: 0,
    ccAbstainVotes: 2,
    protocolParams: null,
    prevGovActionIndex: null,
    prevGovActionTxHash: null,
    metadataHash: "exampleMetadataHash",
    metadataStatus: null,
    metadataValid: true,
  } satisfies ProposalData,
};

const govActionId = commonArgs.proposal.index + commonArgs.proposal.txHash;

async function assertTooltip(tooltip: HTMLElement, expectedText: RegExp) {
  await userEvent.hover(tooltip);
  await waitFor(async () => {
    await expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await expect(screen.getByRole("tooltip")).toHaveTextContent(expectedText);
    await userEvent.unhover(tooltip);
  });
}

async function assertGovActionDetails(
  canvas: ReturnType<typeof within>,
  args: React.ComponentProps<typeof GovernanceActionDetailsCard>,
) {
  const todayDate = formatDisplayDate(new Date());
  await expect(canvas.getAllByText(todayDate)).toHaveLength(2);
  await expect(
    canvas.getByTestId(`${getProposalTypeNoEmptySpaces(args.proposal.type)}-type`),
  ).toHaveTextContent(args.proposal.type);
  await expect(canvas.getByTestId(`${govActionId}-id`)).toHaveTextContent(
    govActionId,
  );
}

export const GovernanceActionDetailsCardComponent: Story = {
  args: {
    ...commonArgs,
    proposal: {
      ...commonArgs.proposal,
    abstract: "Example about section",
    rationale: "Example rationale section",
    motivation: "Example motivation section",
    }
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(args.proposal.title!)).toBeInTheDocument();

    await assertGovActionDetails(canvas, args);
    const [tooltip1, tooltip2] = canvas.getAllByTestId("InfoOutlinedIcon");

    await assertTooltip(tooltip1, /Submission Date/i);
    await assertTooltip(tooltip2, /Expiry Date/i);

    await expect(canvas.getByText(/Yes/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Abstain/i)).toBeInTheDocument();
    await expect(canvas.getByText(/No/i)).toBeInTheDocument();
  },
};

export const GovernanceActionDetailsDrep: Story = {
  args: {
    ...commonArgs,
    isDashboard: true,
    isVoter: true,
    proposal: {
      ...commonArgs.proposal,
      abstract: "Example about section",
      rationale: "Example rationale section",
      motivation: "Example motivation section",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(args.proposal.title!)).toBeInTheDocument();

    await assertGovActionDetails(canvas, args);
    const [tooltip1, tooltip2] = canvas.getAllByTestId("InfoOutlinedIcon");

    await assertTooltip(tooltip1, /Submission Date/i);
    await assertTooltip(tooltip2, /Expiry Date/i);
  },
};

export const GovernanceActionDetailsDataMissing: Story = {
  args: {
    ...commonArgs,
    isDataMissing: MetadataValidationStatus.URL_NOT_FOUND,
  },
  play: async ({ canvasElement, args }) => {
    window.open = jest.fn();
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Data Missing")).toBeVisible();
    await expect(
      canvas.getByText(
        /The data that was originally used when this Governance Action was created has not been found./i,
      ),
    ).toBeVisible();
    await userEvent.click(canvas.getByText(/learn more/i));
    await expect(window.open).toHaveBeenCalledTimes(1);

    await assertGovActionDetails(canvas, args);
    const [tooltip1, tooltip2] = canvas.getAllByTestId("InfoOutlinedIcon");

    await assertTooltip(tooltip1, /Submission Date/i);
    await assertTooltip(tooltip2, /Expiry Date/i);
  },
};

export const GovernanceActionDetailsIncorrectFormat: Story = {
  args: {
    ...commonArgs,
    isDataMissing: MetadataValidationStatus.INVALID_JSONLD,
  },
  play: async ({ canvasElement, args }) => {
    window.open = jest.fn();
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Data Formatted Incorrectly")).toBeVisible();
    await expect(
      canvas.getByText(
        /The data that was originally used when this Governance Action was created has been formatted incorrectly./i,
      ),
    ).toBeVisible();
    await userEvent.click(canvas.getByText(/learn more/i));
    await expect(window.open).toHaveBeenCalledTimes(1);

    await assertGovActionDetails(canvas, args);
    const [tooltip1, tooltip2] = canvas.getAllByTestId("InfoOutlinedIcon");

    await assertTooltip(tooltip1, /Submission Date/i);
    await assertTooltip(tooltip2, /Expiry Date/i);
  },
};

export const GovernanceActionDetailsNotVerifiable: Story = {
  args: {
    ...commonArgs,
    isDataMissing: MetadataValidationStatus.INVALID_HASH,
  },
  play: async ({ canvasElement, args }) => {
    window.open = jest.fn();
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Data Not Verifiable")).toBeVisible();
    await expect(
      canvas.getByText(
        /The data that was originally used when this Governance Action was created has changed./i,
      ),
    ).toBeVisible();
    await userEvent.click(canvas.getByText(/learn more/i));
    await expect(window.open).toHaveBeenCalledTimes(1);

    await assertGovActionDetails(canvas, args);
    const [tooltip1, tooltip2] = canvas.getAllByTestId("InfoOutlinedIcon");

    await assertTooltip(tooltip1, /Submission Date/i);
    await assertTooltip(tooltip2, /Expiry Date/i);
  },
};
