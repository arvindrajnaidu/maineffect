function processOrders(orders, validator) {
    const results = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      try {
        const isValid = validator(order);
        if (isValid) {
          switch (order.type) {
            case 'buy':
              results.push({ action: 'buy', amount: order.amount });
              break;
            case 'sell':
              results.push({ action: 'sell', amount: order.amount });
              break;
            default:
              results.push({ action: 'hold', amount: 0 });
              break;
          }
        } else {
          results.push({ action: 'rejected', reason: 'invalid' });
        }
      } catch (e) {
        results.push({ action: 'error', reason: e.message });
      }
    }
    return results;
  }