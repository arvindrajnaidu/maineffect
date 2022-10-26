(function(exports, require, module, __filename, __dirname) {
        
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    const React = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.React;
                
                    const useState = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.useState;
                
                    const useCallback = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.useCallback;
                
                    const DataGrid = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.DataGrid;
                
                    const formatValueOrCurrency = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.formatValueOrCurrency;
                
                    const getSortFieldFromMap = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.getSortFieldFromMap;
                
                    const RISK_DATA_MAP = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.RISK_DATA_MAP;
                
                    const useMemo = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.useMemo;
                
                    const symbol = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.symbol;
                
                    const nSRBuy = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.nSRBuy;
                
                    const nSRSell = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.nSRSell;
                
                    const nSRNet = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.nSRNet;
                
                    const uFBuy = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.uFBuy;
                
                    const uFSell = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.uFSell;
                
                    const uFNet = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.uFNet;
                
                    const frackerInventory = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.frackerInventory;
                
                    const frackerPL = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.frackerPL;
                
                    const overnightErrorAccount = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.overnightErrorAccount;
                
                    const currencyRenderer = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.currencyRenderer;
                
                    const exposure = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.exposure;
                
                    const totalRisk = __maineffect__.Users_anaidu_myws_maineffect_src_examples_MarketTotalRisk_tsx.totalRisk;
                
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MarketTotalRisk = void 0;
const {
  common: {
    symbol
  },
  tradeMonitor: {
    marketRisk: {
      totalRisk,
      netSettlementRisk: {
        nSRBuy,
        nSRSell,
        nSRNet
      },
      unFiled: {
        uFBuy,
        uFSell,
        uFNet
      },
      frackerOvernightPositions: {
        frackerInventory,
        frackerPL,
        overnightErrorAccount
      },
      exposure
    }
  }
} = copyText;
const MarketTotalRisk = ({
  riskDataType,
  currentSymbol
}) => {
  var _sortModel$, _sortModel$2;
  const title = totalRisk;
  // Remove the space in Market Notional
  const suffix = riskDataType.replace(' ', '');
  const isCurrency = riskDataType !== 'Shares';
  const getDetailPanelContent = useCallback(({
    row
  }) => /*#__PURE__*/React.createElement(MarketTotalRiskDetail, {
    row: row,
    riskDataType: riskDataType
  }), [riskDataType]);
  const getDetailPanelHeight = useCallback(() => 320, []);
  const {
    mutate
  } = useCompleteRiskTableData('MARKET', {
    onSuccess: data => {
      saveAs(data, `market-risk-data-${riskDataType.toLowerCase()}.csv`);
    }
  });
  const handleExport = useCallback(() => {
    mutate({
      type: riskDataType.split(' ').join('_').toUpperCase(),
      search: currentSymbol
    });
  }, [riskDataType, mutate, currentSymbol]);
  const {
    pagination,
    sortModel,
    onSortModelChange,
    onPageSizeChange,
    onPageChange,
    onFilterChange,
    onTotalRecordsChange
  } = useServerSideDataGrid();
  const {
    data,
    isLoading,
    isError
  } = useMarketRiskData('MARKET', {
    search: currentSymbol || '',
    page: pagination.currentPage + 1,
    pageSize: pagination.pageSize,
    sort: getSortFieldFromMap(sortModel === null || sortModel === void 0 ? void 0 : (_sortModel$ = sortModel[0]) === null || _sortModel$ === void 0 ? void 0 : _sortModel$.field, suffix, RISK_DATA_MAP),
    sortOrder: (sortModel === null || sortModel === void 0 ? void 0 : (_sortModel$2 = sortModel[0]) === null || _sortModel$2 === void 0 ? void 0 : _sortModel$2.sort) || undefined
  }, {
    onSuccess: d => {
      onTotalRecordsChange(d.page.totalRecords);
    }
  });
  const rows = useMemo(() => {
    var _data$data$filter$map, _data$data;
    return (_data$data$filter$map = data === null || data === void 0 ? void 0 : (_data$data = data.data) === null || _data$data === void 0 ? void 0 : _data$data.filter(d => d === null || d === void 0 ? void 0 : d.symbol).map(r => {
      return {
        ...r,
        // Create Market Notional using Notional
        exposureMarketNotional: r.exposureNotional,
        id: `${r.symbol}-${uuid()}`
      };
    })) !== null && _data$data$filter$map !== void 0 ? _data$data$filter$map : [];
  }, [data === null || data === void 0 ? void 0 : data.data]);
  const columns = useMemo(() => [{
    field: 'symbol',
    flex: 1,
    headerName: symbol
  }, {
    field: 'buy',
    flex: 1,
    type: 'number',
    headerName: nSRBuy,
    valueFormatter: formatValueOrCurrency(isCurrency),
    valueGetter: ({
      row
    }) => {
      return row[`buy${suffix}`];
    }
  }, {
    field: 'sell',
    flex: 1,
    type: 'number',
    headerName: nSRSell,
    valueFormatter: formatValueOrCurrency(isCurrency),
    valueGetter: ({
      row
    }) => {
      return row[`sell${suffix}`];
    }
  }, {
    field: 'net',
    flex: 1,
    type: 'number',
    headerName: nSRNet,
    valueFormatter: formatValueOrCurrency(isCurrency),
    valueGetter: ({
      row
    }) => {
      return row[`net${suffix}`];
    }
  }, {
    field: 'ufBuy',
    flex: 1,
    type: 'number',
    headerName: uFBuy,
    valueFormatter: formatValueOrCurrency(isCurrency),
    valueGetter: ({
      row
    }) => {
      return row[`ufBuy${suffix}`];
    }
  }, {
    field: 'ufSell',
    flex: 1,
    type: 'number',
    headerName: uFSell,
    valueFormatter: formatValueOrCurrency(isCurrency),
    valueGetter: ({
      row
    }) => {
      return row[`ufSell${suffix}`];
    }
  }, {
    field: 'ufNet',
    flex: 1,
    type: 'number',
    headerName: uFNet,
    valueFormatter: formatValueOrCurrency(isCurrency),
    valueGetter: ({
      row
    }) => {
      return row[`ufNet${suffix}`];
    }
  }, {
    field: 'frackerInventory',
    flex: 1,
    type: 'number',
    headerName: frackerInventory,
    // Fracker Inventory needs to be full decimal values
    valueFormatter: currencyRenderer(isCurrency)
  }, {
    field: 'frackerPl',
    flex: 1,
    type: 'number',
    headerName: frackerPL,
    // Fracker P&L is always currency
    valueFormatter: formatValueOrCurrency(true)
  }, {
    field: 'overnightErrorAccount',
    flex: 1,
    type: 'number',
    headerName: overnightErrorAccount,
    valueFormatter: formatValueOrCurrency(isCurrency)
  }, {
    field: 'exposure',
    flex: 1,
    type: 'number',
    headerName: exposure,
    // Exposure is always currency
    valueFormatter: formatValueOrCurrency(true),
    valueGetter: ({
      row
    }) => {
      return row[`exposure${suffix}`];
    }
  }], [isCurrency, suffix]);
  return /*#__PURE__*/React.createElement(DataGrid, {
    title: title,
    hideFilterDrawer: true,
    hideColumnSelection: true,
    density: "compact",
    filterMode: "server",
    paginationMode: "server",
    sortingMode: "server",
    loading: isLoading,
    error: isError,
    columns: columns,
    rows: rows,
    rowCount: pagination.totalRecords,
    pageSize: pagination.pageSize,
    page: pagination.currentPage,
    onSortModelChange: onSortModelChange,
    onPageSizeChange: onPageSizeChange,
    onPageChange: onPageChange,
    onFilterChange: onFilterChange,
    rowsPerPageOptions: [10, 25, 50, 100],
    getDetailPanelContent: getDetailPanelContent,
    getDetailPanelHeight: getDetailPanelHeight,
    onExport: handleExport,
    sx: {
      '& .MuiDataGrid-detailPanel': {
        overflow: 'auto'
      }
    }
  });
};
exports.MarketTotalRisk = MarketTotalRisk;
        
        return null
    })({}, ()=>{}, {}, '', '');
    