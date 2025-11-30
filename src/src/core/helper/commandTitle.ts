  export  function getCommandTitle(path: string): string {
        switch (path) {
            case "/debitcredit":
            case "DebitCreditCommand":
                return "DebitCreditCommand";
            case "/AvailableFunds":
            case "AvailableFundsCommand":
                return "AvailableFundsCommand";
            case "/salesrevenue":
            case "SalesRevenueCommand":
                return "SalesDataCommand";
            case "/cheques/payable-cheques":
            case "/cheques/receivable-cheques":
                return "ChequeDataCommand";
            case "NearDueChequesCommand":
                return "NearDueChequesCommand";
            case "TopNMostRevenuableProductsCommand":
                return "TopNMostRevenuableProductsCommand";
            case "TopNMostSoldProductsCommand":
                return "TopNMostSoldProductsCommand";
            case "OutOfStockInSaleProductsCommand":
            case "topSeller":
            case "topCustomer":
                return "OutOfStockInSaleProductsCommand";
            default:
                return "";
        }
    }