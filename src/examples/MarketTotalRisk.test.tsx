import { expect } from "chai";
import { parseFn } from "../maineffect";
import React, { useState, useCallback, useMemo } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Big from "big.js";
import sinon, { stub } from "sinon";
// import { copyText } from 'src/app/internationalization';
// import { render, screen, within } from 'test';

// import { useMarketRiskData } from '../../hooks';
// import { useMarketRiskDetail } from '../../hooks/useMarketRiskDetail';
// import { TotalRiskApiReturnValue, TotalRiskDetailApiReturnValue } from '../../mocks/MarketRisk';
// import { MarketTotalRisk } from './MarketTotalRisk';

// jest.mock('../../hooks/useMarketRiskData');
// jest.mock('../../hooks/useMarketRiskDetail');

// const {
//   common: { symbol },
//   tradeMonitor: {
//     marketRisk: {
//       totalRisk,
//       netSettlementRisk: { nSRBuy, nSRSell, nSRNet },
//       unFiled: { uFBuy, uFSell, uFNet },
//       frackerOvernightPositions: { frackerInventory, frackerPL, overnightErrorAccount },
//       exposure,
//     },
//   },
// } = copyText;

describe("MarketTotalRisk", () => {
  // beforeEach(() => {
  //   (useMarketRiskData as jest.Mock).mockReturnValue({
  //     data: {
  //       data: TotalRiskApiReturnValue,
  //       isLoading: false,
  //       isError: false,
  //     },
  //     page: { page: 1, pageSize: 10, totalPage: 0, totalRecords: 0 },
  //   });
  // });

  describe("Defaults", () => {
    const DataGrid = sinon.stub();
    // console.log('PARSING >>>>')
    const parsed = parseFn(require.resolve("./MarketTotalRisk.tsx"), {
      React,
      useState,
      useCallback,
      DataGrid,
      formatValueOrCurrency: () => {},
      getSortFieldFromMap: () => {},
      RISK_DATA_MAP: {},
      useMemo,
      symbol: "AAPL",
      nSRBuy: () => {},
      nSRSell: () => {},
      nSRNet: () => {},
      uFBuy: () => {},
      uFSell: () => {},
      uFNet: () => {},
      frackerInventory: {},
      frackerPL: {},
      overnightErrorAccount: {},
      currencyRenderer: () => <div></div>,
      exposure: {},
      totalRisk: "FOO",
    });
    // console.log('PARSED')
    // console.log(parsed.find('MarketTotalRisk').source(), '<<<<<<')
    beforeEach(() => {
      parsed
        // .fold('copyText', {})
        .provide("useCompleteRiskTableData", () => {
          return {
            mutate() {},
          };
        })
        .provide("useServerSideDataGrid", () => {
          return {
            pagination: {},
          };
        })
        .provide("useMarketRiskData", () => {
          return {};
        });

      const MarketTotalRisk = parsed.find("MarketTotalRisk").getFn();
      render(<MarketTotalRisk riskDataType="Notional" currentSymbol={null} />);
    });

    it("should render correctly", () => {
      expect(DataGrid.calledOnce).to.be.true;
      expect(DataGrid.firstCall.args[0].title).to.equal("FOO");
    });

    // it('should display all the columns', () => {
    //   // All columns are accounted for
    //   expect(screen.getByText(symbol)).toBeTruthy();
    //   expect(screen.getByText(nSRBuy)).toBeTruthy();
    //   expect(screen.getByText(nSRSell)).toBeTruthy();
    //   expect(screen.getByText(nSRNet)).toBeTruthy();
    //   expect(screen.getByText(uFBuy)).toBeTruthy();
    //   expect(screen.getByText(uFSell)).toBeTruthy();
    //   expect(screen.getByText(uFNet)).toBeTruthy();
    //   expect(screen.getByText(frackerInventory)).toBeTruthy();
    //   expect(screen.getByText(frackerPL)).toBeTruthy();
    //   expect(screen.getByText(overnightErrorAccount)).toBeTruthy();
    //   expect(screen.getByText(exposure)).toBeTruthy();
    // });
  });

  // describe('Page Filter', () => {
  //   describe('Shares', () => {
  //     it('should display correct format for values', () => {
  //       const { getByText, getAllByRole } = render(
  //         <MarketTotalRisk riskDataType="Shares" currentSymbol={null} />,
  //       );

  //       const component = getByText('AA');
  //       expect(component).toBeInTheDocument();

  //       // Get all rows (2)
  //       const rows = getAllByRole('row');

  //       // AA example
  //       const AARaw = TotalRiskApiReturnValue[1];
  //       const row = rows.find(e => e.dataset.id?.includes('AA'));

  //       // Net Settlement Risk Buy should be 2 decimal places
  //       const nsrBuyRaw = new Big(AARaw.buyShares).toFormat(2);
  //       const nsrBuy = within(row as HTMLElement).getByText(nsrBuyRaw);
  //       expect(nsrBuy).toBeInTheDocument();

  //       // Should not be formatted to 2 decimal places
  //       const frackerInventoryRaw = AARaw.frackerInventory;
  //       const frackerInventoryCell = within(row as HTMLElement).getByText(frackerInventoryRaw);
  //       expect(frackerInventoryCell).toBeInTheDocument();

  //       // Exposure should be currency
  //       const exposureRaw = AARaw.exposureShares;
  //       const exposureCurrency = `$${new Big(exposureRaw).toFormat(2)}`;
  //       const exposureCell = within(row as HTMLElement).getByText(exposureCurrency);
  //       expect(exposureCell).toBeInTheDocument();
  //     });
  //   });

  //   describe('Notional / Market Notional', () => {
  //     it.skip('should display correct format for values', () => {
  //       const { getAllByRole } = render(
  //         <MarketTotalRisk riskDataType="Market Notional" currentSymbol={null} />,
  //       );

  //       // Get all rows (2)
  //       const rows = getAllByRole('row');

  //       // AA example
  //       const AARaw = TotalRiskApiReturnValue[1];
  //       const row = rows.find(e => e.dataset.id?.includes('AA'));

  //       // Net Settlement Risk Buy should be 2 decimal places
  //       const nsrBuyRaw = new Big(AARaw.marketBuyNotional).toFormat(2);
  //       const nsrBuy = within(row as HTMLElement).getByText(`$${nsrBuyRaw}`);
  //       expect(nsrBuy).toBeInTheDocument();

  //       // Fracker Inventory should be currency
  //       const frackerInventoryRaw = AARaw.frackerInventory;
  //       const frackerInventoryCurrency = `$${new Big(frackerInventoryRaw).toFormat(2)}`;
  //       const frackerInventoryCell = within(row as HTMLElement).getByText(frackerInventoryCurrency);
  //       expect(frackerInventoryCell).toBeInTheDocument();

  //       // Exposure should be the same as Notional
  //       const exposureRaw = AARaw.exposureNotional;
  //       const exposureCurrency = `$${new Big(exposureRaw).toFormat(2)}`;
  //       const exposureCell = within(row as HTMLElement).getByText(exposureCurrency);
  //       expect(exposureCell).toBeInTheDocument();
  //     });
  //   });

  //   describe('Total Risk Detail', () => {
  //     beforeEach(() => {
  //       (useMarketRiskDetail as jest.Mock).mockReturnValue({
  //         data: {
  //           data: TotalRiskDetailApiReturnValue,
  //           isLoading: false,
  //           isError: false,
  //         },
  //         page: { page: 1, pageSize: 10, totalPage: 0, totalRecords: 0 },
  //       });
  //     });

  //     it('should display inner view when symbol is clicked on', () => {
  //       const { getByText, getAllByRole } = render(
  //         <MarketTotalRisk riskDataType="Market Notional" currentSymbol={null} />,
  //       );

  //       const rows = getAllByRole('row');

  //       // AA example
  //       const row = rows.find(e => e.dataset.id?.includes('AA'));
  //       const symbolCellButton = within(row as HTMLElement).getByRole('button');

  //       // Click the Symbol cell to expand the inner table
  //       fireEvent.click(symbolCellButton);

  //       const innerTableRow = getByText('DW');
  //       expect(innerTableRow).toBeInTheDocument();
  //     });
  //   });
  // });
});
