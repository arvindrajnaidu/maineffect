async function fetchData(apiCall) {
    let data = null;
    const response = await apiCall();
    if (response.ok) {
      data = response.data;
      if (data.length > 0) {
        data = data.map(item => item.name);
      } else {
        data = ['empty'];
      }
    } else {
      data = ['error: ' + response.status];
    }
    return data;
  }
