import { useServerSideDataGrid } from '@drivehub/ui-components';
import { GridColumns, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { saveAs } from 'file-saver';
import { useCallback, useMemo } from 'react';
import { copyText } from 'src/app/internationalization';
import { v4 as uuid } from 'uuid';

import { DataGrid } from '../../../DataGrid';
import { currencyRenderer } from '../../Dashboard/utils';
import { RiskDataType, useCompleteRiskTableData, useMarketRiskData } from '../../hooks';
import { MarketRiskSymbolInfo, TotalRiskProps } from '../../types';
import { formatValueOrCurrency, getSortFieldFromMap } from '../../utils';
import { RISK_DATA_MAP } from '../constants';
import { MarketTotalRiskDetail } from './MarketTotalRiskDetail';

const {
  common: { symbol },
  tradeMonitor: {
    marketRisk: {
      totalRisk,
      netSettlementRisk: { nSRBuy, nSRSell, nSRNet },
      unFiled: { uFBuy, uFSell, uFNet },
      frackerOvernightPositions: { frackerInventory, frackerPL, overnightErrorAccount },
      exposure,
    },
  },
} = copyText;

export const MarketTotalRisk = ({ riskDataType, currentSymbol }: TotalRiskProps): JSX.Element => {
  const title = totalRisk;
  // Remove the space in Market Notional
  const suffix = riskDataType.replace(' ', '');
  const isCurrency = riskDataType !== 'Shares';

  const getDetailPanelContent = useCallback(
    ({ row }) => <MarketTotalRiskDetail row={row} riskDataType={riskDataType} />,
    [riskDataType],
  );
  const getDetailPanelHeight = useCallback(() => 320, []);

  const { mutate } = useCompleteRiskTableData('MARKET', {
    onSuccess: data => {
      saveAs(data, `market-risk-data-${riskDataType.toLowerCase()}.csv`);
    },
  });

  const handleExport = useCallback(() => {
    mutate({
      type: riskDataType.split(' ').join('_').toUpperCase() as RiskDataType,
      search: currentSymbol,
    });
  }, [riskDataType, mutate, currentSymbol]);

  const {
    pagination,
    sortModel,
    onSortModelChange,
    onPageSizeChange,
    onPageChange,
    onFilterChange,
    onTotalRecordsChange,
  } = useServerSideDataGrid();

  const { data, isLoading, isError } = useMarketRiskData(
    'MARKET',
    {
      search: currentSymbol || '',
      page: pagination.currentPage + 1,
      pageSize: pagination.pageSize,
      sort: getSortFieldFromMap(sortModel?.[0]?.field, suffix, RISK_DATA_MAP),
      sortOrder: sortModel?.[0]?.sort || undefined,
    },
    {
      onSuccess: d => {
        onTotalRecordsChange(d.page.totalRecords);
      },
    },
  );

  const rows = useMemo(() => {
    return (
      data?.data
        ?.filter(d => d?.symbol)
        .map(r => {
          return {
            ...r,
            // Create Market Notional using Notional
            exposureMarketNotional: r.exposureNotional,
            id: `${r.symbol}-${uuid()}`,
          };
        }) ?? []
    );
  }, [data?.data]);

  const columns = useMemo<GridColumns>(
    () => [
      {
        field: 'symbol',
        flex: 1,
        headerName: symbol,
      },
      {
        field: 'buy',
        flex: 1,
        type: 'number',
        headerName: nSRBuy,
        valueFormatter: formatValueOrCurrency(isCurrency),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`buy${suffix}`];
        },
      },
      {
        field: 'sell',
        flex: 1,
        type: 'number',
        headerName: nSRSell,
        valueFormatter: formatValueOrCurrency(isCurrency),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`sell${suffix}`];
        },
      },
      {
        field: 'net',
        flex: 1,
        type: 'number',
        headerName: nSRNet,
        valueFormatter: formatValueOrCurrency(isCurrency),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`net${suffix}`];
        },
      },
      {
        field: 'ufBuy',
        flex: 1,
        type: 'number',
        headerName: uFBuy,
        valueFormatter: formatValueOrCurrency(isCurrency),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`ufBuy${suffix}`];
        },
      },
      {
        field: 'ufSell',
        flex: 1,
        type: 'number',
        headerName: uFSell,
        valueFormatter: formatValueOrCurrency(isCurrency),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`ufSell${suffix}`];
        },
      },
      {
        field: 'ufNet',
        flex: 1,
        type: 'number',
        headerName: uFNet,
        valueFormatter: formatValueOrCurrency(isCurrency),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`ufNet${suffix}`];
        },
      },
      {
        field: 'frackerInventory',
        flex: 1,
        type: 'number',
        headerName: frackerInventory,
        // Fracker Inventory needs to be full decimal values
        valueFormatter: currencyRenderer(isCurrency),
      },
      {
        field: 'frackerPl',
        flex: 1,
        type: 'number',
        headerName: frackerPL,
        // Fracker P&L is always currency
        valueFormatter: formatValueOrCurrency(true),
      },
      {
        field: 'overnightErrorAccount',
        flex: 1,
        type: 'number',
        headerName: overnightErrorAccount,
        valueFormatter: formatValueOrCurrency(isCurrency),
      },
      {
        field: 'exposure',
        flex: 1,
        type: 'number',
        headerName: exposure,
        // Exposure is always currency
        valueFormatter: formatValueOrCurrency(true),
        valueGetter: ({ row }: GridValueGetterParams<MarketRiskSymbolInfo>) => {
          return row[`exposure${suffix}`];
        },
      },
    ],
    [isCurrency, suffix],
  );

  return (
    <DataGrid
      title={title}
      hideFilterDrawer
      hideColumnSelection
      density="compact"
      filterMode="server"
      paginationMode="server"
      sortingMode="server"
      loading={isLoading}
      error={isError}
      columns={columns}
      rows={rows}
      rowCount={pagination.totalRecords}
      pageSize={pagination.pageSize}
      page={pagination.currentPage}
      onSortModelChange={onSortModelChange}
      onPageSizeChange={onPageSizeChange}
      onPageChange={onPageChange}
      onFilterChange={onFilterChange}
      rowsPerPageOptions={[10, 25, 50, 100]}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      onExport={handleExport}
      sx={{
        '& .MuiDataGrid-detailPanel': {
          overflow: 'auto',
        },
      }}
    />
  );
};
