export interface InearDuePayableChequesDetails {
  chequeNumber: string;
  accountName: string;
  chequeAmount: number;
  formattedChequeAmount: string;
  chequeAmountUOM: string;
  dueDate: Date;
  issueDate: Date;
  bankName: string;
  bankAccountNumber: string;
}
export interface InearDuePayableCheques {
  nearDuePayableCheques: InearDuePayableChequesDetails[];
  chequesQuantity: number;
  chequesAmount: number;
  formattedChequesAmount: number;
  chequesAmountUOM: string;
}
export interface IChequesNearDueTotal {
  payableChequesQuantity: number;
  payableChequesAmount: number;
  formattedPayableChequesAmount: string;
  payableChequesAmountUOM: string;
  receivableChequesQuantity: number;
  receivableChequesAmount: number;
  formattedReceivableChequesAmount: string;
  receivableChequesAmountUOM: string;
  allChequesBalanceAmount: number;
  formattedAllChequesBalanceAmount: string;
  allChequesBalanceAmountUOM: string;


}
export interface IChequesNearDueTotalMain {
  nearDueChequesSubTotalOutput: IChequesNearDueTotal

}

export interface IChequesNearDueSubTotal {
  nearDueChequesSubTotalOutput: INearDueChequesSubTotalOutput[]
}
export interface INearDueChequesSubTotalOutput {
  chequesQuantity: number;
  chequesAmount: number;
  formattedChequesAmount: string;
  chequesAmountUOM: string;
  bankName: string;
  bankcode: string;
  bankAccountNumber: string;
  bankBalance: number;
  formattedBankBalance: string;
  bankBalanceUOM: string;
  needAmount: number
}

export interface IBanksChequeDetails {
  nearDueChequesDtos: INearDueChequesDtos[]
}
export interface INearDueChequesDtos {
  accountName: string,
  bankAccountNumber: string,
  bankCode: string,
  bankName: string,
  chequeAmount: number,
  chequeAmountUOM: string,
  chequeNumber: string,
  direction: string,
  dueDate: string,
  formattedChequeAmount: string,
  issueDate: string,

}
export interface IOverDueReceivableChequesDetailsDtos {
  dueDate: string,
  issueDate: string,
  chequeNumber: string,
  accountName: string,
  chequesAmount: number,
  formattedChequesAmount: string,
  chequesAmountUOM: string,
  bankCode: string,
  bankName: string,
  bankAccountNumber: string
}
export interface IOverDueReceivableRes {
  overDueReceivableChequesDetailsDtos: IOverDueReceivableChequesDetailsDtos[],
  chequesQuantity: number,
  chequesAmount: number,
  formattedChequesAmount: string,
  chequesAmountUOM: string
}


