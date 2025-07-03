export const CROWDFUNDING_CONTRACT_ADDRESS =
  "0xe1DA8919f262Ee86f9BE05059C9280142CF23f48" as const; // Default Anvil address
export const CROWDFUNDING_ABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "cancelAndRefund",
    inputs: [{ name: "_programId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "contribute",
    inputs: [{ name: "_programId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "contributeHistory",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "contribute", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createProgram",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_desc", type: "string", internalType: "string" },
      { name: "_image", type: "string", internalType: "string" },
      { name: "_pic", type: "address", internalType: "address" },
      { name: "_targetFund", type: "uint256", internalType: "uint256" },
      { name: "_startDate", type: "uint256", internalType: "uint256" },
      { name: "_endDate", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getHistoryWithdrawByProgram",
    inputs: [{ name: "_programId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct CrowdFundingContract.Withdrawal[]",
        components: [
          {
            name: "programId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "desc", type: "string", internalType: "string" },
          { name: "time", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getListProgramId",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProgramById",
    inputs: [{ name: "_programId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct CrowdFundingContract.Program",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "title", type: "string", internalType: "string" },
          { name: "image", type: "string", internalType: "string" },
          { name: "desc", type: "string", internalType: "string" },
          { name: "pic", type: "address", internalType: "address" },
          {
            name: "targetFund",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "startDate",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "endDate", type: "uint256", internalType: "uint256" },
          {
            name: "totalAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "withdrawAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum CrowdFundingContract.ProgramStatus",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "listProgramId",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "programs",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "title", type: "string", internalType: "string" },
      { name: "image", type: "string", internalType: "string" },
      { name: "desc", type: "string", internalType: "string" },
      { name: "pic", type: "address", internalType: "address" },
      { name: "targetFund", type: "uint256", internalType: "uint256" },
      { name: "startDate", type: "uint256", internalType: "uint256" },
      { name: "endDate", type: "uint256", internalType: "uint256" },
      { name: "totalAmount", type: "uint256", internalType: "uint256" },
      {
        name: "withdrawAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "status",
        type: "uint8",
        internalType: "enum CrowdFundingContract.ProgramStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      { name: "_programId", type: "uint256", internalType: "uint256" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_desc", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawalByProgram",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "programId", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "desc", type: "string", internalType: "string" },
      { name: "time", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ContributionReceived",
    inputs: [
      {
        name: "programId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "contributor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amountContributed",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalCollected",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FundsWithdrawn",
    inputs: [
      {
        name: "programId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "desc",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProgramCanceled",
    inputs: [
      {
        name: "programId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "canceller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProgramCreated",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "title",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "pic",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "targetFund",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "startDate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "endDate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RefundIssued",
    inputs: [
      {
        name: "programId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "contributor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "CallerNotPIC", inputs: [] },
  { type: "error", name: "CancelAndRefundFailed", inputs: [] },
  { type: "error", name: "FundraiseIsNotClosed", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  { type: "error", name: "ProgramEnd", inputs: [] },
  { type: "error", name: "WithdrawAmountError", inputs: [] },
  { type: "error", name: "WithdrawFailed", inputs: [] },
] as const;

export enum ProgramStatus {
  Active = 0,
  Completed = 1,
  Canceled = 2,
}

export interface Program {
  id: bigint;
  title: string;
  image: string;
  desc: string;
  pic: string;
  targetFund: bigint;
  startDate: bigint;
  endDate: bigint;
  totalAmount: bigint;
  withdrawAmount: bigint;
  status: ProgramStatus;
}

export interface ContributeHistory {
  contribute: string;
  amount: bigint;
}

export interface Withdrawal {
  programId: bigint;
  amount: bigint;
  desc: string;
  time: bigint;
}
